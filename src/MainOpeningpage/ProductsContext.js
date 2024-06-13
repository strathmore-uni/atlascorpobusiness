import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('KE');

  const fetchProducts = async (country) => {
    
    try {
      const response = await axios.get(`http://localhost:3001/api/Countryproducts/${country}`);
       
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCountry);
  }, [selectedCountry]);

  return (
    <ProductsContext.Provider value={{ 
      products, 
      selectedCountry, 
      setSelectedCountry,
      fetchProducts, 
    }}>
      {children}
    </ProductsContext.Provider>
  );
};
