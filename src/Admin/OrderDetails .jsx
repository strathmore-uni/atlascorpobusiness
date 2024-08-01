import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import './adminproducts.css'; // Make sure this path matches your actual CSS file path
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

  const generatePDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('Invoice', 14, 22); // Title

    pdf.setFontSize(12);
    pdf.text(`Company: Atlas Copco Limited`, 14, 32); // Company Name
    pdf.text(`Order Number: ${order.ordernumber}`, 14, 42); // Order Number
    pdf.text(`Customer Email: ${order.email}`, 14, 52); // Customer Email

    // Line break
    pdf.text('', 14, 62);

    // Header
    pdf.text('Items', 14, 72);
    pdf.text('Quantity', 100, 72);
    pdf.text('Price', 140, 72);

    // Items
    let y = 82;
    order.items.forEach(item => {
      pdf.text(item.description, 14, y);
      pdf.text(`${item.quantity}`, 100, y);
      pdf.text(`$${item.price ? item.price.toFixed(2) : 'N/A'}`, 140, y);
      y += 10;
    });

    // Line break
    y += 10;
    pdf.text('', 14, y);

    // Total Price
    pdf.text(`Total Price: $${order.totalprice ? order.totalprice : 'N/A'}`, 14, y + 10);

    pdf.save(`Invoice for order ${order.ordernumber}.pdf`);
  };

  const orderSteps = [
    'Received',
    'Approved',
    'Being Processed',
    'Released from Warehouse',
    'On Transit'
  ];

  const getStatusIndex = (status) => {
    return orderSteps.indexOf(status);
  };

  const progressPercentage = (getStatusIndex(order?.status) + 1) / orderSteps.length * 100;

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
      <div className="order-details-content">
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
          <p><span>Total Price:</span> ${order.totalprice ? order.totalprice : 'N/A'}</p>
        </div>
        <div className="order-status-buttons">
          <button onClick={() => updateOrderStatus('Approved')} className="approve-btn">Approve</button>
          <button onClick={() => updateOrderStatus('Pending')} className="pending-btn">Pending</button>
          <button onClick={() => updateOrderStatus('Declined')} className="decline-btn">Decline</button>
        </div>
      </div>
   
      <button onClick={generatePDF} className="generate-pdf-btn">Generate PDF</button>
      <Link to="/ordereditems" className="go-back-btn">Go Back</Link>
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
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
      <AdminCategory />
    </div>
  );
};

export default OrderDetails;
