import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

import './addproduct.css'; // Import the CSS file
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles
import AdminCategory from './AdminCategory';

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isFileLoaded, setIsFileLoaded] = useState(false);
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
  const [fileChosen, setFileChosen] = useState(false);

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
        console.error('Error fetching categories:', error);
        toast.error('Error fetching categories');
      }
    };
    fetchCategories();
  }, []);
  

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileChosen(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const [headerRow, ...rows] = jsonData;
      setHeaders(headerRow);

      const parsedProducts = rows.map((row) =>
        headerRow.reduce((acc, header, index) => {
          acc[header] = row[index] || '';
          return acc;
        }, {})
      );

      setProducts(parsedProducts);
      setIsFileLoaded(true);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
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
      toast.error('User email not found in localStorage');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/newproducts/batch`, products, {
        headers: {
          'User-Email': userEmail,
        },
      });
      toast.success('Products added successfully');
      setProducts([]);
      setIsFileLoaded(false);
      setFileChosen(false);
      setIsTableVisible(true);
    } catch (error) {
      console.error('Error adding products:', error);
      toast.error('Error adding products you do not have the required permissions');
    }
  };

  const handleSingleProductSubmit = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const userEmail = currentUser ? currentUser.email : null;
    if (!userEmail) {
      toast.error('User email not found in localStorage');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/newproducts`, singleProduct, {
        headers: {
          'User-Email': userEmail,
        },
      });
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
      toast.error('Error adding products you do not have the required permissions');
    }
  };

  const handleSingleProductChange = (e) => {
    const { name, value } = e.target;
    setSingleProduct({
      ...singleProduct,
      [name]: value,
    });
  };

  const handleSinglePriceChange = (index, e) => {
    const { name, value } = e.target;
    setSingleProduct({
      ...singleProduct,
      prices: singleProduct.prices.map((price, prIdx) =>
        prIdx === index ? { ...price, [name]: value } : price
      ),
    });
  };

  const handleAddSinglePrice = () => {
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
                      name={header}
                      value={product[header]}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isFileLoaded && (
        <button onClick={handleSubmit} className="submit-bulk-products">
          Add Products
        </button>
      )}

      <div className="single-product-section">
        <h3>Add Single Product</h3>
        <form onSubmit={handleSingleProductSubmit}>
          <label>Part Number</label>
          <input
            type="text"
            name="partnumber"
            value={singleProduct.partnumber}
            onChange={handleSingleProductChange}
            required
          />
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={singleProduct.description}
            onChange={handleSingleProductChange}
            required
          />
          <label>Image URL</label>
          <input
            type="text"
            name="image"
            value={singleProduct.image}
            onChange={handleSingleProductChange}
            required
          />
          <label>Thumbnail 1 URL</label>
          <input
            type="text"
            name="thumb1"
            value={singleProduct.thumb1}
            onChange={handleSingleProductChange}
          />
          <label>Thumbnail 2 URL</label>
          <input
            type="text"
            name="thumb2"
            value={singleProduct.thumb2}
            onChange={handleSingleProductChange}
          />
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={singleProduct.stock}
            onChange={handleSingleProductChange}
            required
          />
          <label>Main Category</label>
          <select
            name="mainCategory"
            value={singleProduct.mainCategory}
            onChange={handleSingleProductChange}
            required
          >
            <option value="">Select Main Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <label>Sub Category</label>
          <select
            name="subCategory"
            value={singleProduct.subCategory}
            onChange={handleSingleProductChange}
            required
          >
            <option value="">Select Sub Category</option>
            {subcategories
              .filter(
                (subcategory) =>
                  subcategory.mainCategory === singleProduct.mainCategory
              )
              .map((subcategory, index) => (
                <option key={index} value={subcategory.subCategory}>
                  {subcategory.subCategory}
                </option>
              ))}
          </select>
        
          {singleProduct.prices.map((price, index) => (
            <div key={index}>
              <label>Country Code</label>
              <input
                type="text"
                name="country_code"
                value={price.country_code}
                onChange={(e) => handleSinglePriceChange(index, e)}
                required
              />
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={price.price}
                onChange={(e) => handleSinglePriceChange(index, e)}
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSinglePrice}
            className="add-price-button"
          >
            Add Another Price
          </button>
          <button type="submit" className="submit-single-product">
            Add Product
          </button>
        </form>
      </div>
      <ToastContainer />
      <AdminCategory />
    </div>
  );
};

export default AddProduct;
