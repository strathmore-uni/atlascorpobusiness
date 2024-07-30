import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './admincategory.css';
import './notificationspage.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminCategory from './AdminCategory';
import { useAuth } from '../MainOpeningpage/AuthContext';

const AdminDashboardSummary = () => {
  const [summary, setSummary] = useState({
    orders: 0,
    products: 0,
    users: 0,
    recentOrders: [],
    pendingOrders: [],
    groupedOrders: {},
  });
  const [expandedCountries, setExpandedCountries] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [ordersCount, productsCount, usersCount, recentOrdersResponse, pendingOrdersResponse, groupedOrdersResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/count`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/products/count`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/users/count`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/recent`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/pending`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/groupedByCountry`, { params: { email: currentUser.email } }),
        ]);

        const sortByDateDescending = (a, b) => new Date(b.created_at) - new Date(a.created_at);

        setSummary({
          orders: ordersCount.data.count,
          products: productsCount.data.count,
          users: usersCount.data.count,
          recentOrders: recentOrdersResponse.data.sort(sortByDateDescending),
          pendingOrders: pendingOrdersResponse.data.sort(sortByDateDescending),
          groupedOrders: groupedOrdersResponse.data,
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
  const data = {
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

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
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

        <div className="admin-dashboard-orders-grouped">
          {Object.keys(summary.groupedOrders).map(country => (
            <div key={country} className="country-orders">
              <h3>Orders for {country}</h3>
              <button onClick={() => handleExpandAll(country)}>
                {expandedCountries.includes(country) ? 'Collapse All' : 'Expand All'}
              </button>
              <ul className={expandedCountries.includes(country) ? 'expanded' : 'collapsed'}>
                {summary.groupedOrders[country].map(order => (
                  <Link to={`/orderdetails/${order.id}`} className="order-link" key={order.id}>
                    <li>
                      Order Number: {order.ordernumber} Email: {order.email} Date: {new Date(order.created_at).toLocaleDateString()}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
      </div>
      <AdminCategory />
    </div>
  );
};

export default AdminDashboardSummary;
