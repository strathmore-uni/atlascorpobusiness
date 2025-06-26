import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 md:ml-32 lg:ml-48">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
          {category.charAt(0).toUpperCase() + category.slice(1)} Orders
        </h1>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          {currentUser.email === 'superadmin@gmail.com' && (
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <label htmlFor="country-select" className="font-medium text-gray-700">Country:</label>
              <select
                id="country-select"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <label htmlFor="start-date" className="font-medium text-gray-700">Start Date:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={handleStartDateChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label htmlFor="end-date" className="font-medium text-gray-700">End Date:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={handleEndDateChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Search orders"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {orders.length === 0 && !loading && (
          <div className="bg-white rounded shadow p-6 text-center text-gray-500">
            <p>No orders found for {category}.</p>
          </div>
        )}
        <ul className="space-y-4">
          {filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage).map(order => (
            <li key={order.id} className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:shadow-lg transition">
              <Link to={`/orderdetails/${order.id}`} className="text-blue-600 font-semibold hover:underline">
                Order Number: {order.ordernumber || 'N/A'}
              </Link>
              <div className="text-gray-700">Status: <span className="font-medium">{order.status || 'N/A'}</span></div>
            </li>
          ))}
        </ul>
        {/* Pagination Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo; Previous
          </button>
          <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </div>
        <div className="mt-10">
          <AdminCategory />
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
