import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './addproduct.css'; // CSS file for styling
import { toast, ToastContainer } from 'react-toastify'; // Toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast styles
import AdminCategory from './AdminCategory'; // Category component
import { useAuth } from '../MainOpeningpage/AuthContext';

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [fileChosen, setFileChosen] = useState(false);

  const [singleProduct, setSingleProduct] = useState({
    partnumber: '',
    description: '',
    image: '',
    thumb1: '',
    thumb2: '',
    prices: [{ country_code: '', price: '' }],
    stock: 0,
    mainCategory: '',
    subCategory: '',
  });

  const [isTableVisible, setIsTableVisible] = useState(true);

  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/categories`);
        if (response.data.categories && response.data.subcategories) {
          setCategories(response.data.categories);
          setSubcategories(response.data.subcategories);
        } else {
          toast.error('Unexpected API response structure');
        }
      } catch (error) {
        toast.error('Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  // Handle file upload and parse Excel data
// Handle file upload and parse Excel data
// Function to handle file upload and parse Excel data

;
// Fetch the current user

const fetchCurrentUser = () => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      console.log('Fetched User:', parsedUser);
      return parsedUser;
    } catch (error) {
      console.error('Error parsing user data from local storage:', error);
      return null;
    }
  }
  console.error('No user data found in local storage.');
  return null;
};
const currentUser = fetchCurrentUser();
const adminCountry = currentUser ? currentUser.country : null;




// Debug output
console.log('Admin Country:', adminCountry);

// Check if adminCountry is correctly set
if (!adminCountry) {
  console.error('Country code for admin is undefined. Please check the stored user information.');
}


const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) {
    console.error('No file selected.');
    return;
  }

  setFileChosen(true);
  const reader = new FileReader();

  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const [headerRow, ...rows] = jsonData;

    const normalizedHeaders = headerRow.map((header) =>
      header
        .toLowerCase()
        .replace(/[\s\(\):"]/g, '') // Removes spaces, parentheses, colons, and quotes
        .replace('itemnumber', 'partnumber')
        .replace('priceusd', 'price')
    );

    const parsedProducts = rows.map((row) => {
      const product = normalizedHeaders.reduce((acc, header, index) => {
        acc[header] = row[index] || '';
        return acc;
      }, {});

      return {
        partnumber: product['partnumber'] || '',
        description: product['description'] || '',
        image: product['image'] || '',
        thumb1: product['thumb1'] || '',
        thumb2: product['thumb2'] || '',
        mainCategory: product['maincategory'] || '',
        subCategory: product['subcategory'] || '',
        prices: [
          {
            country_code: 'US', // Assuming country code; replace with your dynamic logic
            price: parseFloat(product['price']) || 0,
            stock_quantity: parseInt(product['stock']) || 0,
          },
        ],
      };
    });

    setProducts(parsedProducts);
    setIsFileLoaded(true);
    setIsTableVisible(true);
  };

  reader.readAsArrayBuffer(file);
};













  // Handle changes to product data in the table
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [name]: value } : product
    );
    setProducts(updatedProducts);
  };

  // Handle bulk product submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userEmail = currentUser ? currentUser.email : null;

    if (!userEmail) {
      toast.error('User email not found in localStorage');
      return;
    }

    if (!products.length) {
      toast.error('No products to add. Please upload a file first.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LOCAL}/api/newproducts/batch`,
        { products },
        {
          headers: {
            'User-Email': userEmail,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Products added successfully');
      setProducts([]);
      setIsFileLoaded(false);
      setFileChosen(false);
      setIsTableVisible(true);
    } catch (error) {
      toast.error('Error adding products: You do not have the required permissions');
    }
  };

  // Handle single product form submission
  const handleSingleProductSubmit = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userEmail = currentUser ? currentUser.email : null;

    if (!userEmail) {
      toast.error('User email not found in localStorage');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LOCAL}/api/newproducts`,
        singleProduct,
        {
          headers: {
            'User-Email': userEmail,
          },
        }
      );
      toast.success('Product added successfully');
      setSingleProduct({
        partnumber: '',
        description: '',
        image: '',
        thumb1: '',
        thumb2: '',
        prices: [{ country_code: '', price: '' }],
        stock: 0,
        mainCategory: '',
        subCategory: '',
      });
    } catch (error) {
      toast.error('Error adding products: You do not have the required permissions');
    }
  };

  // Handle input changes for single product form
  const handleSingleProductChange = (e) => {
    const { name, value } = e.target;
    setSingleProduct({
      ...singleProduct,
      [name]: value,
    });
  };

  // Handle changes to the price entries in the single product form
  const handleSinglePriceChange = (index, e) => {
    const { name, value } = e.target;
    setSingleProduct({
      ...singleProduct,
      prices: singleProduct.prices.map((price, prIdx) =>
        prIdx === index ? { ...price, [name]: value } : price
      ),
    });
  };

  // Add a new price entry for the single product form
  const handleAddSinglePrice = () => {
    setSingleProduct({
      ...singleProduct,
      prices: [...singleProduct.prices, { country_code: '', price: '' }],
    });
  };
  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };
  return (
    <div className="add-product-container">
      <h2>Bulk Product Upload</h2>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
        className="file-upload-input"
      />
       {isFileLoaded && (
       <button
       onClick={toggleTableVisibility}
        className="button-base add-product-toggle-table-btn"
        disabled={!fileChosen}
      >
        {isTableVisible ? 'Hide Table' : 'Show Table'}
      </button>
       )}

{isTableVisible && products.length > 0 && (
        <table className="product-data-table">
          <thead>
            <tr>
              <th>Part Number</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.partnumber}</td>
                <td>{product.description}</td>
                <td>{product.prices[0]?.price || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={handleSubmit}
        className="button-base add-product-submit-btn"
        disabled={!products.length}
      >
        Add Products
      </button>

      <ToastContainer />

      <h2>Add Single Product</h2>
      <form onSubmit={handleSingleProductSubmit} className="single-product-form">
        <div className="form-group">
          <label>Part Number:</label>
          <input
            type="text"
            name="partnumber"
            value={singleProduct.partnumber}
            onChange={handleSingleProductChange}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={singleProduct.description}
            onChange={handleSingleProductChange}
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={singleProduct.image}
            onChange={handleSingleProductChange}
          />
        </div>
        <div className="form-group">
          <label>Main Category:</label>
          <select
            name="mainCategory"
            value={singleProduct.mainCategory}
            onChange={handleSingleProductChange}
          >
            <option value="">Select Main Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Sub Category:</label>
          <select
            name="subCategory"
            value={singleProduct.subCategory}
            onChange={handleSingleProductChange}
          >
            <option value="">Select Sub Category</option>
            {subcategories.map((subcategory, index) => (
              <option key={index} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>
        {singleProduct.prices.map((price, index) => (
          <div key={index} className="form-group">
            <label>Country Code:</label>
            <input
              type="text"
              name="country_code"
              value={price.country_code}
              onChange={(e) => handleSinglePriceChange(index, e)}
            />
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={price.price}
              onChange={(e) => handleSinglePriceChange(index, e)}
            />
             <button
          type="button"
          onClick={handleAddSinglePrice}
          className="button-base add-product-price-btn"
        >
          Add More Prices
        </button>
          </div>
        ))}
       
        <button type="submit" className="button-base add-product-submit-btn">
          Add Single Product
        </button>
      </form>

      <AdminCategory />
    </div>
  );
};

export default AddProduct;
