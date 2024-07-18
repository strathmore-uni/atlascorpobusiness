import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminCategory from './AdminCategory';
import './admincategory.css';

const AdminDashboardSummary = () => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    orders: 0,
    products: 0,
    users: 0,
    recentOrders: [],
    pendingOrders: [],
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [ordersCount, productsCount, usersCount, recentOrdersResponse, pendingOrdersResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/count`),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/products/count`),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/users/count`),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/recent`),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/pending`)
        ]);

        setSummary({
          orders: ordersCount.data.count,
          products: productsCount.data.count,
          users: usersCount.data.count,
          recentOrders: recentOrdersResponse.data,
          pendingOrders: pendingOrdersResponse.data,
        });
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
  }, []);

  const handleOrderClick = (orderNumber) => {
    navigate(`/orderdetails/${orderNumber}`);
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

        <div className="admin-dashboard-summary">
          <div className="summary-item-recent">
            <h3>Recent Orders (Last 7 Days)</h3>
            <div className="recent-orders-list">
              <ul>
                {summary.recentOrders.map(order => (
                  <li key={order.ordernumber} onClick={() => handleOrderClick(order.ordernumber)}>
                    Order Number: {order.ordernumber}  Email: {order.email}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="summary-item-pending">
            <h3>Pending Orders</h3>
            <div className="pending-orders-list">
              <ul>
                {summary.pendingOrders.map(order => (
                  <li key={order.ordernumber} onClick={() => handleOrderClick(order.ordernumber)}>
                    Order Number: {order.ordernumber}  Email: {order.email}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <AdminCategory />
    </div>
  );
};

export default AdminDashboardSummary;
