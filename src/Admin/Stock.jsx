import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminCategory from './AdminCategory';
import './stock.css'; // Import the CSS file

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchZeroStockProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/products/near-completion`);
        setProducts(response.data);
      } catch (error) {
        setError('Error fetching products with zero stock.');
        console.error('Error fetching products with zero stock:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchZeroStockProducts();
  }, []);

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="stock-page">
      <h1>Products with Zero Stock</h1>
    
      <table className="stock-table">
        <thead>
          <tr>
            <th>Part Number</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.partnumber}</td>
              <td>{product.description}</td>
              <td>
                ${Number(product.price).toFixed(2)}
              </td>
              <td>{product.stock_quantity}</td>
              <td>{product.country_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AdminCategory />
    </div>
  );
};

export default Stock;
