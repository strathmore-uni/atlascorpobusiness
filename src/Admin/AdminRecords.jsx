import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './adminrecordspage.css'; // Import the CSS file
import { useAuth } from '../MainOpeningpage/AuthContext';

const AdminRecords = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('orders'); // Track active section
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const adminEmail = currentUser.email;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assume `currentUser.email` is available
        const [ordersResponse, usersResponse, productsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders`, {
            params: { email: adminEmail,  } // Use query parameters if needed
          }),
        
        ]);
        setOrders(ordersResponse.data);
        setUsers(usersResponse.data);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data only if currentUser.email is available
    if (currentUser.email) {
      fetchData();
    }
  }, [currentUser.email, activeSection]);


  return (
    <div className="admin-records-container">
      <div className="sidebar">
        <h2>Categories</h2>
        <ul>
          <li onClick={() => setActiveSection('orders')} className={activeSection === 'orders' ? 'active' : ''}>Orders</li>
          <li onClick={() => setActiveSection('users')} className={activeSection === 'users' ? 'active' : ''}>Users</li>
          <li onClick={() => setActiveSection('products')} className={activeSection === 'products' ? 'active' : ''}>Products</li>
        </ul>
      </div>
      <div className="main-content">
        {activeSection === 'orders' && (
          <div className="records-section">
            <h2>Orders</h2>
            <table className="records-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Email</th>
                  <th>Country</th>
                  <th>Status</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.email}</td>
                    <td>{order.country}</td>
                    <td>{order.status}</td>
                    <td>${order.totalprice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'users' && (
          <div className="records-section">
            <h2>Users</h2>
            <table className="records-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                    <td>{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'products' && (
          <div className="records-section">
            <h2>Products</h2>
            <table className="records-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Stock Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stockQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecords;
