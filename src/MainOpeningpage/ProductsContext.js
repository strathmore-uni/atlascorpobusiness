import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('KE'); // Default country

  const fetchProducts = async (searchTerm = '') => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products`, {
        params: { searchTerm, country: selectedCountry }
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
