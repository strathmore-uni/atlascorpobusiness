import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminproducts.css'; // Import the CSS file

import AdminCategory from './AdminCategory';

const AddProduct = () => {
  const [productDetails, setProductDetails] = useState({
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

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/categories`);
        setCategories(response.data.categories);
        setSubcategories(response.data.subcategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePriceChange = (index, e) => {
    const { name, value } = e.target;
    const newPrices = productDetails.prices.map((price, i) =>
      i === index ? { ...price, [name]: value } : price
    );
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      prices: newPrices,
    }));
  };

  const addPriceField = () => {
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      prices: [...prevDetails.prices, { country_code: '', price: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/newproducts`, productDetails);
      alert('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  const handleAddCategory = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/categories`, { category: newCategory });
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleAddSubcategory = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/categories`, { subcategory: newSubcategory });
      setSubcategories((prevSubcategories) => [...prevSubcategories, newSubcategory]);
      setNewSubcategory('');
    } catch (error) {
      console.error('Error adding subcategory:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="partnumber" placeholder="Part Number" value={productDetails.partnumber} onChange={handleInputChange} required />
        <input type="text" name="description" placeholder="Description" value={productDetails.description} onChange={handleInputChange} required />
        <input type="text" name="image" placeholder="Image URL" value={productDetails.image} onChange={handleInputChange} required />
        <input type="text" name="thumb1" placeholder="Thumbnail 1 URL" value={productDetails.thumb1} onChange={handleInputChange} required />
        <input type="text" name="thumb2" placeholder="Thumbnail 2 URL" value={productDetails.thumb2} onChange={handleInputChange} required />
        <input type="number" name="stock" placeholder="Stock" value={productDetails.stock} onChange={handleInputChange} required />

        <select name="mainCategory" value={productDetails.mainCategory} onChange={handleInputChange} required>
          <option value="">Select Main Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New Main Category" />
        <button type="button" className="add-category-button" onClick={handleAddCategory}>Add Category</button>

        <select name="subCategory" value={productDetails.subCategory} onChange={handleInputChange} required>
          <option value="">Select Subcategory</option>
          {subcategories.map((subcat, index) => (
            <option key={index} value={subcat}>{subcat}</option>
          ))}
        </select>
        <input type="text" value={newSubcategory} onChange={(e) => setNewSubcategory(e.target.value)} placeholder="New Subcategory" />
        <button type="button" className="add-subcategory-button" onClick={handleAddSubcategory}>Add Subcategory</button>

        {productDetails.prices.map((price, index) => (
          <div key={index} className="price-field">
            <input type="text" name="country_code" placeholder="Country Code" value={price.country_code} onChange={(e) => handlePriceChange(index, e)} required />
            <input type="number" name="price" placeholder="Price" value={price.price} onChange={(e) => handlePriceChange(index, e)} required />
          </div>
        ))}
        <button type="button" className="add-price-button" onClick={addPriceField}>Add Price</button>
        <button type="submit" className="submit-button">Add Product</button>
      </form>
      <AdminCategory />
    </div>
  );
};

export default AddProduct;
