import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import './adminproducts.css'; // Ensure this path is correct
import AdminCategory from './AdminCategory';
import { useAuth } from '../MainOpeningpage/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal'; // Ensure you have react-modal installed

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState('');
  const { currentUser } = useAuth();

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
      await axios.patch(`${process.env.REACT_APP_LOCAL}/api/admin/orders/${orderId}/status`, { 
        status, 
        userEmail: currentUser.email 
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setOrder((prevOrder) => ({
        ...prevOrder,
        Status: status
      }));
      
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status.');
    }
  };

  const generatePDF = () => {
    if (!order) return;

    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('Invoice', 14, 22); 

    pdf.setFontSize(12);
    pdf.text(`Company: Atlas Copco Limited`, 14, 32); 
    pdf.text(`Order Number: ${order.ordernumber}`, 14, 42); 
    pdf.text(`Customer Email: ${order.email}`, 14, 52); 

    pdf.text('', 14, 62); 

    pdf.text('Items', 14, 72);
    pdf.text('Quantity', 100, 72);
    pdf.text('Price', 140, 72);

    let y = 82;
    order.items.forEach(item => {
      pdf.text(item.description, 14, y);
      pdf.text(`${item.quantity}`, 100, y);
      pdf.text(`$${item.price ? item.price.toFixed(2) : 'N/A'}`, 140, y);
      y += 10;
    });

    y += 10;
    pdf.text('', 14, y);

    pdf.text(`Total Price: $${order.totalprice ? order.totalprice : 'N/A'}`, 14, y + 10);

    pdf.save(`Invoice for order ${order.ordernumber}.pdf`);
  };

  const orderSteps = [
    'Received',
    'Approved',
    'Being Processed',
    'Released from Warehouse',
    'On Transit',
    'Cleared'
  ];

  const getStatusIndex = (status) => {
    return orderSteps.indexOf(status);
  };

  const progressPercentage = (status) => {
    return (getStatusIndex(status) + 1) / orderSteps.length * 100;
  };

  const isCleared = order && order.Status === 'Cleared';

  const handleAction = (action) => {
    setActionType(action);
    setShowConfirmation(true);
  };

  const confirmAction = async () => {
    await updateOrderStatus(actionType);
    setShowConfirmation(false);
  };

  const cancelAction = () => setShowConfirmation(false);

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

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <div className="order-details-container">
      <h2>Order Details</h2>
      <div className="order-details-content">
        <div className="order-info">
          <p><span>Order Number:</span> {order.ordernumber}</p>
          <p><span>Customer Email:</span> {order.email}</p>
          <p><span>Order Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
          <p><span>Shipping Address:</span> {order.city || 'N/A'}</p>
        </div>
        <div className="order-items">
          <h3>Items:</h3>
          {order.items.map(item => (
            <div key={item.id} className="order-item">
              <img src={item.image || 'placeholder.jpg'} alt={item.description} className="item-image" />
              <p>{item.description} - {item.quantity} x ${item.price ? item.price.toFixed(2) : 'N/A'}</p>
            </div>
          ))}
        </div>
        <div className="total-price">
          <p><span>Total Price:</span> ${order.totalprice ? order.totalprice : 'N/A'}</p>
        </div>
        <div className="order-status-buttons">
          <button onClick={() => handleAction('Cleared')} className="clear-btn">
            Cleared
          </button>
          <button onClick={() => handleAction('Approved')} className="approve-btn" disabled={!isCleared}>
            Approve
          </button>
          <button onClick={() => handleAction('Pending')} className="pending-btn" disabled={!isCleared}>
            Pending
          </button>
          <button onClick={() => handleAction('Declined')} className="decline-btn" disabled={!isCleared}>
            Decline
          </button>
          <button onClick={() => handleAction('Released from Warehouse')} className="complete-btn" disabled={!isCleared}>
            Complete
          </button>
        </div>
      </div>
     
      <button onClick={generatePDF} className="generate-pdf-btn" disabled={!isCleared}>
        Generate PDF
      </button>
     
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage(order.Status)}%` }}></div>
          <div className="progress-step-container">
            {orderSteps.map((step, index) => (
              <div key={index} className={`progress-step ${getStatusIndex(order.Status) >= index ? 'completed' : ''}`}>
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
      
      <Link to={`/order-history/${order.email}`} className="order-history-link">
        View Customer Order History
      </Link>
      
      <AdminCategory />
      <ToastContainer />
      
      <Modal
        isOpen={showConfirmation}
        onRequestClose={cancelAction}
        contentLabel="Confirm Action"
        className="modal"
        overlayClassName="overlay"
      >
        <h3>Are you sure you want to {actionType} this order?</h3>
        <button onClick={confirmAction}>Yes</button>
        <button onClick={cancelAction}>No</button>
      </Modal>
    </div>
  );
};

export default OrderDetails;
