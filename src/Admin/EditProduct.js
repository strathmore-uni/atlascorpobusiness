// EditProduct.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    partnumber: '',
    description: '',
    image: '',
    thumb1: '',
    thumb2: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/viewproducts/${id}`);
        // Set the state with the fetched product data
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]); // Dependency array ensures this effect runs when `id` changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
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
    <div>
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
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
