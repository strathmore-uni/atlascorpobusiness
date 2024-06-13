import React, { useState, useContext, useEffect } from 'react';
import './productcategories.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProductsContext } from '../MainOpeningpage/ProductsContext';

export default function ProductCategories({setProducts}) {
  const handlePriceRangeChange = async (range) => {
    const [min, max] = range.split('-').map(Number);
    const category = 'servkit'; // Replace with actual category or dynamically set
    
    try {
      const response = await axios.get(`http://localhost:3001/api/products/range/${category}/${min}/${max}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products by price range and category:', error);
    }
  };
  
  return (
    <div className='container_productcategories'>
      <h3>Product Categories</h3>
      <div className='price-filters'>
        <button onClick={() => handlePriceRangeChange('1-100')}>$1 - $100</button>
        <button onClick={() => handlePriceRangeChange('100-200')}>$100 - $200</button>
        <button onClick={() => handlePriceRangeChange('200-300')}>$200 - $300</button>
        {/* Add more ranges as needed */}
      </div>
    </div>
  );
}
