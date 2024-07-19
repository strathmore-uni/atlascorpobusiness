import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './users.css'; 
import AdminCategory from './AdminCategory';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/viewproducts`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); 
      }
    };
    fetchProducts();
  }, []); 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const partnumber = product.partnumber || ''; // Default to empty string if null or undefined
    const description = product.Description || ''; // Default to empty string if null or undefined

    return (
      partnumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="products-container">
      <h2>Products List</h2>
  
      <input
        type="text"
        placeholder="Search by part number or description"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input-orderlist"
      />
      {loading ? (
        <div className="dot-spinner">
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
        </div>
      ) : (
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.id}>
              <span>{product.partnumber || 'N/A'} - {product.Description || 'N/A'}</span>
              <Link to={`/editproduct/${product.id}`}>Edit</Link>
            </li>
          ))}
        </ul>
      )}
      <AdminCategory />
    </div>
  );
};

export default ProductsList;
