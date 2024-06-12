import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('KE');

  useEffect(() => {
    fetchProducts(selectedCountry);
  }, [selectedCountry]);

  const fetchProducts = async (country) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products?country=${country}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      selectedCountry, 
      setSelectedCountry,
      fetchProducts, // Include fetchProducts in the context
    }}>
      {children}
    </ProductsContext.Provider>
  );
};
