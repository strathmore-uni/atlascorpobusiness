// src/pages/FinanceOrderViewPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './financeorderviewage.css'; // Import the CSS file

const FinanceOrderViewPage = () => {
  const { orderId } = useParams(); // Get orderId from URL params
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Fetch order details from API
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleClearOrder = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_LOCAL}/api/orders/${orderId}`);
      alert('Order cleared successfully!');
      // Redirect or update the UI as needed
    } catch (error) {
      console.error("Error clearing order:", error);
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="finance-order-view">
      <h2 className="order-title">Order Details</h2>
      <div className="order-summary">
        <p><strong>Order Number:</strong> {order.ordernumber}</p>
        <p><strong>Email:</strong> {order.email}</p>
    
        <div className="order-items-list">
          <h3 className="items-title">Items:</h3>
          {order.items.map(item => (
            <div key={item.id} className="order-item-detail">
              <p>{item.description} - {item.quantity} x ${item.price ? item.price : 'N/A'}</p>
            </div>
          ))}
        </div>
        <div className="order-total">
          <p><span>Total Price:</span> ${order.totalprice ? order.totalprice: 'N/A'}</p>
        </div>
      </div>
      <button onClick={handleClearOrder} className="clear-order-btn">
        Clear Order
      </button>
    </div>
  );
};

export default FinanceOrderViewPage;
