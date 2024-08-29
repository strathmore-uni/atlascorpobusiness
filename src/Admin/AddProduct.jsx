import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

import './addproduct.css'; // Import the CSS file
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles
import AdminCategory from './AdminCategory'; // Assuming AdminCategory is needed

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/categories`);
        console.log('Categories fetched:', response.data);
        if (response.data.categories && response.data.subcategories) {
          setCategories(response.data.categories);
          setSubcategories(response.data.subcategories);
        } else {
          console.error('Unexpected API response structure:', response.data);
          toast.error('Unexpected API response structure');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File chosen:', file.name);
    setFileChosen(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      console.log('File loaded:', file.name);
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const [headerRow, ...rows] = jsonData;
      console.log('Excel headers:', headerRow);
      setHeaders(headerRow);

      const parsedProducts = rows.map((row) => {
        const product = headerRow.reduce((acc, header, index) => {
          acc[header] = row[index] || ''; // Use empty string for missing values
          return acc;
        }, {});
        
        // Log parsed product data
        console.log('Parsed product:', product);

        // Auto-fill prices and stock quantities for the given countries based on the Excel file
        const priceForAllCountries = parseFloat(product.Price) || 0; // Ensure price is a number
        const defaultStockQuantity = 30; // Default stock quantity

        const countries = ['KE', 'TZ', 'UG']; // Example country codes
        product.prices = countries.map((country) => ({
          country_code: country,
          price: priceForAllCountries,
          stock_quantity: defaultStockQuantity,
        }));

        const productName = product['Description'] ? product['Description'].toLowerCase() : '';
        if (productName.includes('filter element')) {
          product.mainCategory = 'filterelement';
          product.subCategory = 'filterelement';
        } else {
          product.mainCategory = ''; // Default values if no match
          product.subCategory = '';
        }

        // Ensure image fields are empty
        product.image = '';
        product.thumb1 = '';
        product.thumb2 = '';

        return product;
      });

      console.log('Final products array:', parsedProducts);
      setProducts(parsedProducts);
      setIsFileLoaded(true);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    console.log(`Updating product at index ${index}, field ${name}:`, value);
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [name]: value } : product
    );
    setProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userEmail = currentUser ? currentUser.email : null;
  
   
    if (!userEmail) {
      console.error('User email not found in localStorage');
      toast.error('User email not found in localStorage');
      return;
    }
  
    if (!Array.isArray(products) || products.length === 0) {
      console.error('No products to add or data is not in correct format');
      toast.error('No products to add. Please upload a file first.');
      return;
    }
  
    // Log the data to be sent to the backend
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_LOCAL}/api/newproducts/batch`,
        { products },
        {
          headers: {
            'User-Email': userEmail,
            'Content-Type': 'application/json'
          },
        }
      );
      console.log('Response from API:', response.data);
      toast.success('Products added successfully');
      setProducts([]);
      setIsFileLoaded(false);
      setFileChosen(false);
      setIsTableVisible(true);
    } catch (error) {
      console.error('Error adding products:', error.response?.data || error.message);
      toast.error('Error adding products: You do not have the required permissions');
    }
  };
  
  const handleSingleProductSubmit = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userEmail = currentUser ? currentUser.email : null;

    if (!userEmail) {
      console.error('User email not found in localStorage');
      toast.error('User email not found in localStorage');
      return;
    }

    console.log('Single product to be added:', singleProduct);

    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL}/api/newproducts`, singleProduct, {
        headers: {
          'User-Email': userEmail,
        },
      });
      console.log('Response from API (single product):', response.data);
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
      console.error('Error adding product:', error);
      toast.error('Error adding products: You do not have the required permissions');
    }
  };

  const handleSingleProductChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating single product field ${name}:`, value);
    setSingleProduct({
      ...singleProduct,
      [name]: value,
    });
  };

  const handleSinglePriceChange = (index, e) => {
    const { name, value } = e.target;
    console.log(`Updating price at index ${index}, field ${name}:`, value);
    setSingleProduct({
      ...singleProduct,
      prices: singleProduct.prices.map((price, prIdx) =>
        prIdx === index ? { ...price, [name]: value } : price
      ),
    });
  };

  const handleAddSinglePrice = () => {
    console.log('Adding new price entry');
    setSingleProduct({
      ...singleProduct,
      prices: [...singleProduct.prices, { country_code: '', price: '' }],
    });
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
      <button
        onClick={() => setIsTableVisible(!isTableVisible)}
        className="table-toggle-button"
        disabled={!fileChosen}
      >
        {isTableVisible ? 'Hide Table' : 'Show Table'}
      </button>

      {isFileLoaded && isTableVisible && (
        <table className="product-data-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={header}>
                    <input
                      type="text"
                      value={product[header] || ''}
                      onChange={(e) => handleProductChange(index, e)}
                      name={header}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={handleSubmit}
        className="submit-button"
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
          <label>Thumbnail 1 URL:</label>
          <input
            type="text"
            name="thumb1"
            value={singleProduct.thumb1}
            onChange={handleSingleProductChange}
          />
        </div>
        <div className="form-group">
          <label>Thumbnail 2 URL:</label>
          <input
            type="text"
            name="thumb2"
            value={singleProduct.thumb2}
            onChange={handleSingleProductChange}
          />
        </div>
        <div className="form-group">
          <label>Stock Quantity:</label>
          <input
            type="number"
            name="stock"
            value={singleProduct.stock}
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
            {categories.map((category) => (
              <option key={category} value={category}>
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
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Prices:</label>
          {singleProduct.prices.map((price, index) => (
            <div key={index} className="price-entry">
              <input
                type="text"
                placeholder="Country Code"
                name="country_code"
                value={price.country_code}
                onChange={(e) => handleSinglePriceChange(index, e)}
              />
              <input
                type="text"
                placeholder="Price"
                name="price"
                value={price.price}
                onChange={(e) => handleSinglePriceChange(index, e)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddSinglePrice}>
            Add Price
          </button>
        </div>
        <button type="submit" className="submit-button">
          Add Single Product
        </button>
      </form>

      <AdminCategory/>
    </div>
  );
};

export default AddProduct;
