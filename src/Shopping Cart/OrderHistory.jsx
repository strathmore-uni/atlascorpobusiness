import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './orderhistory.css'; 
import { IoIosArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../MainOpeningpage/AuthContext';
import NavigationBar from '../General Components/NavigationBar';

const OrderHistory = ({ handleAddHistoryProduct }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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
    }
  }, [currentUser]);

  const handleAddOrderItemsToCart = async (orderId) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    console.log('User Email:', currentUser.email); // Debugging
    console.log('Order ID:', orderId); // Debugging

    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCAL}/api/cart`, {
        userEmail: currentUser.email,
        orderId: orderId
      });
      console.log(response.data.message); // Log success message
      // Optionally, fetch updated cart items here
    } catch (error) {
      console.error('Error adding order items to cart:', error);
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
                <p className="order-status">Status: {order.status}</p> {/* Display order status */}
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
