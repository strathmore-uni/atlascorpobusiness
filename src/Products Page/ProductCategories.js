import React, { useState, useContext, useEffect } from 'react';
import './productcategories.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProductsContext } from '../MainOpeningpage/ProductsContext';

export default function ProductCategories() {
  const { selectedCountry, setProducts } = useContext(ProductsContext);
  const [priceRange, setPriceRange] = useState('');
  const navigate = useNavigate();
  const location = useLocation();



  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    const [min, max] = range.split('-').map(Number);
    fetchProductsByPrice(min, max);
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
