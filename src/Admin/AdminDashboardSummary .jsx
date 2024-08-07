import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './admincategory.css';
import './notificationspage.css';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminCategory from './AdminCategory';
import { useAuth } from '../MainOpeningpage/AuthContext';
import CountUp from 'react-countup';

const AdminDashboardSummary = () => {
  const [summary, setSummary] = useState({
    orders: 0,
    products: 0,
    users: 0,
    recentOrders: [],
    pendingOrders: [],
    groupedOrders: {},
    mostOrderedProducts: [],
    unreadNotificationsCount: 0
  });
  const [expandedCountries, setExpandedCountries] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [
          ordersCount,
          productsCount,
          usersCount,
          recentOrdersResponse,
          pendingOrdersResponse,
          groupedOrdersResponse,
          mostOrderedProductsResponse,
          notificationsCountResponse
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/count`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/products/count`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/users/count`, { params: { email: currentUser.email } }),
    
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/recent`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/pending`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/groupedByCountry`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/mostOrderedProducts`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/notifications/count`, { params: { email: currentUser.email } })
        ]);

        const sortByDateDescending = (a, b) => new Date(b.created_at) - new Date(a.created_at);

        setSummary({
          orders: ordersCount.data.count,
          products: productsCount.data.count,
          users: usersCount.data.count,
          
          recentOrders: recentOrdersResponse.data.sort(sortByDateDescending),
          pendingOrders: pendingOrdersResponse.data.sort(sortByDateDescending),
          groupedOrders: groupedOrdersResponse.data,
          mostOrderedProducts: mostOrderedProductsResponse.data,
          unreadNotificationsCount: notificationsCountResponse.data.count
        });
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
  }, [currentUser]);

  const handleExpandAll = (country) => {
    setExpandedCountries((prevExpandedCountries) => {
      if (prevExpandedCountries.includes(country)) {
        return prevExpandedCountries.filter((item) => item !== country);
      } else {
        return [...prevExpandedCountries, country];
      }
    });
  };

  const barData = {
    labels: ['Orders', 'Products', 'Users'],
    datasets: [
      {
        label: 'Count',
        data: [summary.orders, summary.products, summary.users],
        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineData = {
    labels: summary.mostOrderedProducts.map(product => product.partnumber),
    datasets: [
      {
        label: 'Total Quantity Ordered',
        data: summary.mostOrderedProducts.map(product => product.total_quantity),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
    ],
  };

  const lineOptions = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <div className="maincontainer_admin">
        <h2>Dashboard</h2>
        <div className="quick-buttons">
          <Link to="/ordereditems/orders" className="quick-button">Orders</Link>
          <Link to="/registeredusers" className="quick-button">Users</Link>
          {currentUser.email === 'superadmin@gmail.com' && (
            <Link to="/admin/create-admin" className="quick-button">Create Admin</Link>
          )}
          <Link to="/admin/settings" className="quick-button">Settings</Link>
          <div className="notification-bell">
            <Link to="/notifications">
              <span className="bell-icon">&#128276;</span>
              {summary.unreadNotificationsCount > 0 && (
                <span className="notification-count">{summary.unreadNotificationsCount}</span>
              )}
            </Link>
          </div>
        </div>

        <div className="admin-dashboard-summary">
          <div className="summary-item">
            <h3>Total Orders</h3>
            <CountUp end={summary.orders} duration={2} />
          </div>
          <div className="summary-item">
            <h3>Total Products</h3>
            <CountUp end={summary.products} duration={2} />
          </div>
          <div className="summary-item">
            <h3>Total Users</h3>
            <CountUp end={summary.users} duration={2} />
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

        <div className="admin-dashboard-orders-grouped">
          <h3>Orders Grouped by Country</h3>
          {Object.entries(summary.groupedOrders).map(([country, count]) => (
            <div key={country} className="order-country-group">
              <h4>
                <button onClick={() => handleExpandAll(country)}>
                  {expandedCountries.includes(country) ? 'Collapse' : 'Expand'} {country}
                </button>
              </h4>
              {expandedCountries.includes(country) && (
                <ul>
                  {count.map(order => (
                    <li key={order.id}>
                      Order Number: {order.ordernumber} Email: {order.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="charts-container">
          <div className="bar-chart-container">
            <h3>Overview</h3>
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="most-ordered-products">
          <h3>Most Ordered Products</h3>
          <ul>
            {summary.mostOrderedProducts.map(product => (
              <li key={product.partnumber}>
                <div className="info">
                  <span className="label">Part Number:</span>
                  <span className="partnumber">{product.partnumber}</span>
                </div>
                <div className="info">
                  <span className="label">Description:</span>
                  <span className="description">{product.description}</span>
                </div>
                <div className="info">
                  <span className="label">Total Quantity Ordered:</span>
                  <span className="total-quantity">{product.total_quantity}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

          <div className="line-chart-container">
            <h3>Most Ordered Products (Quantity Ordered)</h3>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>
      </div>
      <AdminCategory />
    </div>
  );
};

export default AdminDashboardSummary;
