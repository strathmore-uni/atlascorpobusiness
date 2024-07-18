// EditProduct.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './editproduct.css'; // Import the CSS file
import AdminCategory from './AdminCategory';
import Adminnav from './Adminnav';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    partnumber: '',
    description: '',
    image: '',
    thumb1: '',
    thumb2: '',
    prices: [] // Initialize prices as an empty array
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/viewproducts/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePriceChange = (index, field, value) => {
    const updatedPrices = product.prices.map((price, i) =>
      i === index ? { ...price, [field]: value } : price
    );
    setProduct(prevState => ({
      ...prevState,
      prices: updatedPrices
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_LOCAL}/api/viewproducts/${id}`, product);
      alert('Product updated successfully');
      // Optionally, redirect to products list or perform other actions
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Part Number:
          <input type="text" name="partnumber" value={product.partnumber} onChange={handleChange} />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name="description" value={product.description} onChange={handleChange} />
        </label>
        <br />
        <label>
          Image URL:
          <input type="text" name="image" value={product.image} onChange={handleChange} />
        </label>
        <br />
        <label>
          Thumbnail 1 URL:
          <input type="text" name="thumb1" value={product.thumb1} onChange={handleChange} />
        </label>
        <br />
        <label>
          Thumbnail 2 URL:
          <input type="text" name="thumb2" value={product.thumb2} onChange={handleChange} />
        </label>
        <br />
        <div className="prices-section">
          <h3>Prices and Stock</h3>
          {product.prices && product.prices.map((price, index) => (
            <div key={index} className="price-item">
              <label>
                Country:
                <input
                  type="text"
                  value={price.country_code}
                  readOnly
                />
              </label>
              <br />
              <label>
                Price:
                <input
                  type="text"
                  value={price.Price}
                  onChange={(e) => handlePriceChange(index, 'Price', e.target.value)}
                />
              </label>
              <br />
              <label>
                Stock Quantity:
                <input
                  type="text"
                  name="stock_quantity"
                  value={price.stock_quantity || ''} // Display stock quantity from prices if exists
                  onChange={(e) => handlePriceChange(index, 'stock_quantity', e.target.value)}
                />
              </label>
              <br />
            </div>
          ))}
        </div>
        <button type="submit" className='editproduct_button'>Update Product</button>
      </form>
      <AdminCategory />
      <Adminnav />
    </div>
  );
};

export default EditProduct;
