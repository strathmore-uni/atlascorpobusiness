import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './adminproducts.css'; // Make sure this path matches your actual CSS file path
import Adminnav from './Adminnav';
import AdminCategory from './AdminCategory';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/${orderId}`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const updateOrderStatus = async (status) => {
    try {
      await axios.patch(`${process.env.REACT_APP_LOCAL}/api/admin/orders/${orderId}/status`, { status }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      alert(`Order status updated to ${status}`);
      setOrder((prevOrder) => ({ ...prevOrder, status }));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return <div className="dot-spinner">
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
      <div className="dot-spinner__dot"></div>
    </div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>
      <div className="order-info">
        <p><span>Order Number:</span> {order.ordernumber}</p>
        <p><span>Customer Email:</span> {order.email}</p>
      </div>
      <div className="order-items">
        <h3>Items:</h3>
        {order.items.map(item => (
          <div key={item.id} className="order-item">
            <p>{item.description} - {item.quantity} x ${item.price ? item.price.toFixed(2) : 'N/A'}</p>
          </div>
        ))}
      </div>
      <div className="total-price">
        <p><span>Total Price:</span> ${order.totalPrice ? order.totalPrice.toFixed(2) : 'N/A'}</p>
      </div>
      <div className="order-status-buttons">
        <button onClick={() => updateOrderStatus('Approved')} className="approve-btn">Approve</button>
        <button onClick={() => updateOrderStatus('Pending')} className="pending-btn">Pending</button>
        <button onClick={() => updateOrderStatus('Declined')} className="decline-btn">Decline</button>
      </div>
      <Link to="/ordereditems" className="go-back-btn">Go Back</Link>
      <AdminCategory />
      <Adminnav />
    </div>
  );
};

export default OrderDetails;
