import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './admincategory.css';
import './notificationspage.css';
import AdminCategory from './AdminCategory';

const AdminDashboardSummary = () => {
  const [summary, setSummary] = useState({
    orders: 0,
    products: 0,
    users: 0,
    recentOrders: [],
    pendingOrders: [],
    unreadNotificationsCount: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [ordersCount, productsCount, usersCount, recentOrdersResponse, pendingOrdersResponse, notificationsCountResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/count`),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/products/count`),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/users/count`),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/recent`),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/pending`),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/notifications/count`),
        ]);

        const sortByDateDescending = (a, b) => new Date(b.created_at) - new Date(a.created_at);

        setSummary({
          orders: ordersCount.data.count,
          products: productsCount.data.count,
          users: usersCount.data.count,
          recentOrders: recentOrdersResponse.data.sort(sortByDateDescending),
          pendingOrders: pendingOrdersResponse.data.sort(sortByDateDescending),
          unreadNotificationsCount: notificationsCountResponse.data.count,
        });
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div>
      <div className="maincontainer_admin">
        <h2>Dashboard</h2>
        <div className="notification-bell">
          <Link to="/notifications">
            <span className="bell-icon">&#128276;</span>
            {summary.unreadNotificationsCount > 0 && (
              <span className="notification-count">{summary.unreadNotificationsCount}</span>
            )}
          </Link>
        </div>
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
                  <Link to={`/orderdetails/${order.id}`} className="order-link" key={order.id}>
                    <li>
                      Order Number: {order.ordernumber} Email: {order.email}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>

          <div className="summary-item-pending">
            <h3>Pending Orders</h3>
            <div className="pending-orders-list">
              <ul>
                {summary.pendingOrders.map(order => (
                  <Link to={`/orderdetails/${order.id}`} className="order-link" key={order.id}>
                    <li>
                      Order Number: {order.ordernumber} Email: {order.email}
                    </li>
                  </Link>
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
