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
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(15); // Number of orders per page

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const adminEmail = currentUser.email;

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
          params: { 
            email: adminEmail, 
            country: selectedCountry, 
            startDate, 
            endDate,
            page: currentPage,
            limit: ordersPerPage
          }
        });
        const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
  }, [category, adminEmail, selectedCountry, startDate, endDate, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredOrders = orders.filter(order =>
    (order.ordernumber && order.ordernumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.status && order.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.items && order.items.some(item => item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
    <div className="order-details-page">
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Orders</h1>
      <div className="filter-section">
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
          </div>
        )}

        
        <div className="date-filter-container">
          <label htmlFor="start-date">Start Date:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={handleStartDateChange}
          />
          <label htmlFor="end-date">End Date:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
      <input
        type="text"
        placeholder="Search orders"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      {orders.length === 0 && !loading && (
        <div className="no-orders-message">
          <p>No orders found for {category}.</p>
        </div>
      )}
      <ul>
        {filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage).map(order => (
          <li key={order.id}>
            <Link to={`/orderdetails/${order.id}`} className="order-details-link">
              <div>Order Number: {order.ordernumber || 'N/A'}</div>
            </Link>
            <div>Status: {order.status || 'N/A'}</div>
          </li>
        ))}
      </ul>
      <div className="pagination-controls">
  <button 
    className="pagination-button" 
    onClick={() => handlePageChange(currentPage - 1)} 
    disabled={currentPage === 1}
  >
    &laquo; Previous
  </button>
  <span className="pagination-info">Page {currentPage} of {totalPages}</span>
  <button 
    className="pagination-button" 
    onClick={() => handlePageChange(currentPage + 1)} 
    disabled={currentPage === totalPages}
  >
    Next &raquo;
  </button>
</div>

      <AdminCategory />
    </div>
  );
};

export default OrderDetailsPage;
