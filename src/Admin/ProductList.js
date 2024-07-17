import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './users.css'; // Import CSS file
import AdminCategory from './AdminCategory';


const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/viewproducts`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Always set loading to false after trying to fetch products
      }
    };
    fetchProducts();
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) => 
    product.partnumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.Description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <span>{product.partnumber} - {product.Description}</span>
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
