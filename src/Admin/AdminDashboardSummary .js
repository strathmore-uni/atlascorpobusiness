import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook for navigation
import AdminCategory from './AdminCategory';
import './admincategory.css';

const AdminDashboardSummary = () => {
  const history = useNavigate();

  const [summary, setSummary] = useState({
    orders: 0,
    products: 0,
    users: 0,
    recentOrders: [],
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Fetch total counts
        const ordersCount = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/count`);
        const productsCount = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/products/count`);
        const usersCount = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/users/count`);

        // Fetch recent orders
        const recentOrdersResponse = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/recent`);
        const recentOrders = recentOrdersResponse.data;

        setSummary({
          orders: ordersCount.data.count,
          products: productsCount.data.count,
          users: usersCount.data.count,
          recentOrders: recentOrders.map(order => ({
            orderNumber: order.ordernumber,
            email: order.email,
          })),
        });
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
  }, []);

  const handleOrderClick = (orderId) => {
    // Navigate to OrderDetails page with orderId
    history(`/orderdetails/${orderId}`);
  };

  return (
    <div>
      <div className="maincontainer_admin">
        <h3>Dashboard</h3>
        <div className="admin-dashboard-summary">
          <div className="summary-item">
            <h3>Total Orders</h3>
            <p>{summary.orders}</p>
          </div>
          <div className="summary-item">
            <h3>Total Products</h3>
            <p>{summary.products}</p>
          </div>
          <div className="summary-item">
            <h3>Total Users</h3>
            <p>{summary.users}</p>
          </div>
        </div>

        <div className="summary-item-recent">
          <h3>Recent Orders (Last 7 Days)</h3>
           {summary.recentOrders.map(order => (
          <div className="recent-orders-list">
            <ul>
                <li key={order.orderNumber} onClick={() => handleOrderClick(order.orderNumber)}>
                  Order Number: {order.orderNumber}  Email: {order.email}
                </li>
             
            </ul>
          </div>
           ))}
        </div>
      </div>
      <AdminCategory />
    </div>
  );
};

export default AdminDashboardSummary;
