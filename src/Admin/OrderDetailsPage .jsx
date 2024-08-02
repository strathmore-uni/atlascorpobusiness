import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './OrderDetailsPage.css';
import AdminCategory from './AdminCategory';

const OrderDetailsPage = () => {
  const { category } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]); // State for countries
  const [selectedCountry, setSelectedCountry] = useState(''); // State for selected country

  const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Fetch current user from localStorage
  const adminEmail = currentUser.email; // Extract email from currentUser

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/countries`);
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/${category}`, {
          params: { email: adminEmail, country: selectedCountry }
        });
        const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by date descending
        setOrders(sortedOrders);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please log in as an admin.');
        } else {
          setError('Error fetching orders.');
        }
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [category, adminEmail, selectedCountry]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const filteredOrders = orders.filter(order =>
    (order.ordernumber && order.ordernumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.status && order.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.items && order.items.some(item => item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );

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

  if (orders.length === 0) {
    return <div>No orders found for {category}.</div>;
  }

  return (
    <div className="order-details-page">
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Orders</h1>
      {currentUser.email === 'superadmin@gmail.com' && (
      <div className="filter-container">
        <label htmlFor="country-select">Filter by Country:</label>
        <select
          id="country-select"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country.code} value={country.code}>{country.name}</option>
          ))}
        </select>
      </div>)}
      <input
        type="text"
        placeholder="Search orders"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <ul>
        {filteredOrders.map(order => (
          <li key={order.id}>
            <Link to={`/orderdetails/${order.id}`} className="order-details-link">
              <div>Order Number: {order.ordernumber || 'N/A'}</div>
            </Link>
            <div>Status: {order.status || 'N/A'}</div>
            <div>Items:</div>
            <ul>
              {order.items && order.items.map((item, index) => (
                <li key={index}>
                  <div>Description: {item.description || 'N/A'}</div>
                  <div>Quantity: {item.quantity || 'N/A'}</div>
                  <div>
                    Price: ${item.price !== null && item.price !== undefined ? item.price.toFixed(2) : 'N/A'}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <AdminCategory />
    </div>
  );
};

export default OrderDetailsPage;
