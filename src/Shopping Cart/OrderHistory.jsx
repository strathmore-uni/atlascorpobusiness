import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './orderhistory.css'; 
import { IoIosArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../MainOpeningpage/AuthContext';
import NavigationBar from '../General Components/NavigationBar';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receivedStatus, setReceivedStatus] = useState({});
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const orderSteps = [
    'Received',
    'Approved',
    'Being Processed',
    'Finished Packing',
    'On Transit',
    'Completed'  // Added Completed status
  ];

  const getStatusIndex = (status) => {
    return orderSteps.indexOf(status);
  };

  const progressPercentage = (status) => {
    return (getStatusIndex(status) + 1) / orderSteps.length * 100;
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/orders/history?email=${currentUser.email}`);
        setOrders(response.data);
      } catch (error) {
        setError('Error fetching order history');
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrderHistory();
      const intervalId = setInterval(fetchOrderHistory, 60000); // Poll every 60 seconds

      return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  const handleAddOrderItemsToCart = async (orderId) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL}/api/cart`, {
        userEmail: currentUser.email,
        orderId: orderId
      });
      console.log(response.data.message); // Log success message
    } catch (error) {
      console.error('Error adding order items to cart:', error);
    }
  };

  const handleReceivedClick = async (orderId) => {
    try {
      // Optimistically update UI
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: 'Completed' }
            : order
        )
      );
      setReceivedStatus(prevStatus => ({ ...prevStatus, [orderId]: true }));

      // Update on the server
      await axios.patch(`${process.env.REACT_APP_LOCAL}/api/admin/orders/${orderId}/status`, { status: 'Completed' }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      // Revert optimistic update in case of error
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: 'On Transit' } // Revert to previous status if needed
            : order
        )
      );
      setReceivedStatus(prevStatus => ({ ...prevStatus, [orderId]: false }));
    }
  };

  return (
    <div>
      <div className="order-history-container">
        <h1>Order History</h1>
        <Link to='/shop' className='backtoform'>
          <p><IoIosArrowBack className='arrowbackReview' />Back</p>
        </Link>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : orders.length === 0 ? (
          <p>No past orders found</p>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <h2 className="order-number">Order Number: {order.ordernumber}</h2>
                <p className="order-date">Order Date: {new Date(order.created_at).toLocaleDateString()}</p>
                <p className="order-total">Total: ${order.total}</p>
                <p className="order-status">Status: {order.status}</p>
                
                {/* Progress Bar */}
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${progressPercentage(order.status)}%` }}></div>
                    <div className="progress-step-container">
                      {orderSteps.map((step, index) => (
                        <div key={index} className={`progress-step ${getStatusIndex(order.status) >= index ? 'completed' : ''}`}>
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="progress-step-labels">
                    {orderSteps.map((step, index) => (
                      <div key={index} className="progress-step-label">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* "Received the Items" Button */}
                {getStatusIndex(order.status) === 4 && !receivedStatus[order.id] && (
                  <button 
                    className="received-button"
                    onClick={() => handleReceivedClick(order.id)}
                  >
                    Received the Items
                  </button>
                )}
                {receivedStatus[order.id] && (
                  <button 
                    className="received-button disabled"
                    disabled
                  >
                    Received the Items
                  </button>
                )}

                <h3>Items:</h3>
                <ul className="items-list">
                  {order.items.map(item => (
                    <li key={item.id} className="item">
                      <span className="item-description">{item.description}</span> -{' '}
                      <span className="item-quantity">{item.quantity} x ${item.price?.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <button className="add-to-cart-button" onClick={() => handleAddOrderItemsToCart(order.id)}>
                  Add to Cart
                </button>
                <hr className="hr" />
              </div>
            ))}
          </div>
        )}
      </div>
      <NavigationBar />
    </div>
  );
};

export default OrderHistory;
