import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminCategory from './AdminCategory';
import './admincategory.css';

const AdminDashboardSummary = () => {
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

        // Sort recent orders and pending orders from newest to oldest
        const sortByDateDescending = (a, b) => new Date(b.created_at) - new Date(a.created_at);

        setSummary({
          orders: ordersCount.data.count,
          products: productsCount.data.count,
          users: usersCount.data.count,
          recentOrders: recentOrdersResponse.data.sort(sortByDateDescending),
          pendingOrders: pendingOrdersResponse.data.sort(sortByDateDescending),
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
