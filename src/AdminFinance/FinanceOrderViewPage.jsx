import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
import './financeorderviewage.css'; // Import the CSS file
import { useAuth } from '../MainOpeningpage/AuthContext';

const FinanceOrderViewPage = () => {
  const { orderId } = useParams(); // Get orderId from URL params
  const { currentUser } = useAuth(); // Get currentUser from useAuth
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order details from API
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleClearOrder = async () => {
    if (!currentUser) {
      toast.error('User is not logged in.');
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_LOCAL}/api/clearedorders/${orderId}`, {
        userEmail: currentUser.email, // Include user's email in the request body
      });
      toast.success('Order cleared successfully!');
      // Update order state to reflect the new status
      setOrder(prevOrder => ({ ...prevOrder, status: 'Cleared' }));
    } catch (error) {
      
      toast.error('Error clearing order, you do not have the necessary permissions.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="finance-order-view">
      <ToastContainer /> {/* Add ToastContainer to your component */}
      <h2 className="order-title">Order Details</h2>
      <div className="order-summary">
        <p><strong>Order Number:</strong> {order.ordernumber}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Status:</strong> {order.status || 'N/A'}</p> {/* Display status */}
    
        <div className="order-items-list">
          <h3 className="items-title">Items:</h3>
          {order.items && order.items.map(item => (
            <div key={item.description} className="order-item-detail">
              <p>{item.description} - {item.quantity} x ${item.price ? item.price : 'N/A'}</p>
            </div>
          ))}
        </div>
        <div className="order-total">
          <p><span>Total Price:</span> ${order.totalprice ? order.totalprice : 'N/A'}</p>
        </div>
      </div>
      <button onClick={handleClearOrder} className="clear-order-btn">
        Clear Order
      </button>
    </div>
  );
};

export default FinanceOrderViewPage;
