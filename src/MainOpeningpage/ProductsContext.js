import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('KE'); 
  const fetchProducts = async ( minPrice = 0, maxPrice = 10000) => {
    try {
      const response = await axios.get('/api/products', {
        params: { country: selectedCountry, minPrice, maxPrice },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [selectedCountry]);

  return (
    <ProductsContext.Provider value={{ 
      products, 
      fetchProducts, 
      selectedCountry, 
      setSelectedCountry,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};