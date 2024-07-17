import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './mainadmin.css'; // Import the CSS file
import AdminCategory from './AdminCategory';
import Adminnav from './Adminnav';

const Ordereditems = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffcc00'; 
      case 'approved':
        return '#00cc00'; 
      case 'declined':
        return '#ff3300'; 
      default:
        return '#666'; 
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = (order.orderNumber && order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (order.email && order.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-container">
      <h2>Orders</h2>
      <div className="filter-dropdown">
        <label htmlFor="filter">Filter by status: </label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="declined">Declined</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="Search by order number or email"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input-orderitems"
      />
      {loading ? (
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
      ) : filteredOrders.length === 0 ? (
        <p className="p_no_orders_found">No orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer Email</th>
              <th>Status</th>
              <th>Items</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td data-label="Order Number">
                  <Link to={`/orderdetails/${order.id}`}>{order.orderNumber}</Link>
                </td>
                <td data-label="Customer Email">{order.email}</td>
                <td data-label="Status" style={{ color: getStatusColor(order.status) }}>
                  {order.status}
                </td>
                <td data-label="Items">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.description} - {item.quantity} x ${item.price}
                    </div>
                  ))}
                </td>
                <td data-label="Total Price">${order.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AdminCategory />
   
    </div>
  );
};

export default Ordereditems;
