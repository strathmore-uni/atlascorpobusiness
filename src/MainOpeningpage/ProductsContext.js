import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('KE'); 

  return (
    <ProductsContext.Provider value={{ 
      products, 
    
      selectedCountry, 
      setSelectedCountry,
    }}>
      {children}
    </ProductsContext.Provider>
  );
};