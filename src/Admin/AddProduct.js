import React, { useState } from 'react';
import axios from 'axios';
import './adminproducts.css'; // Import the CSS file
import AdminCategory from './AdminCategory';
import Adminnav from './Adminnav';

const AddProduct = () => {
  const [productDetails, setProductDetails] = useState({
    partnumber: '',
    description: '',
    image: '',
    thumb1: '',
    thumb2: '',
    prices: [{ country_code: '', price: '' }],
    stock: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePriceChange = (index, e) => {
    const { name, value } = e.target;
    const newPrices = productDetails.prices.map((price, i) => (
      i === index ? { ...price, [name]: value } : price
    ));
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
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/newproducts`, productDetails); // Ensure this points to your backend
      alert('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
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
        {productDetails.prices.map((price, index) => (
          <div key={index} className="price-field">
            <input type="text" name="country_code" placeholder="Country Code" value={price.country_code} onChange={(e) => handlePriceChange(index, e)} required />
            <input type="number" name="price" placeholder="Price" value={price.price} onChange={(e) => handlePriceChange(index, e)} required />
          </div>
        ))}
        <button type="button" className="add-price-button" onClick={addPriceField}>Add Price</button>
        <button type="submit" className="submit-button">Add Product</button>
      </form>
     
      <Adminnav />
      <AdminCategory />
    </div>
  );
};

export default AddProduct;
