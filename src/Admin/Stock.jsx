import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminCategory from './AdminCategory';
import './stock.css'; // Import the CSS file
import { useAuth } from '../MainOpeningpage/AuthContext';


const Stock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Use the custom hook to get current user's email
  const { currentUser } = useAuth(); // Adjust based on how `useAuth` provides the user data

  useEffect(() => {
    const fetchZeroStockProducts = async () => {
      if (!currentUser || !currentUser.email) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/products/near-completion`, {
          params: { email: currentUser.email }
        });

        setProducts(response.data);
      } catch (error) {
        setError('Error fetching products near completion.');
        console.error('Error fetching products near completion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchZeroStockProducts();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="center-spinner">
            <div className="user-spinner"></div>
          </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="stock-page">
      <h1>Products with Near Completion Stock</h1>
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
            <tr key={product.partnumber}>
              <td>{product.partnumber}</td>
              <td>{product.description}</td>
              <td>${Number(product.price).toFixed(2)}</td>
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
