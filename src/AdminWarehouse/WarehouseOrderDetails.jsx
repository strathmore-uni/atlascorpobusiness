import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './WarehouseOrderDetails.css'; // Make sure this path matches your actual CSS file path
import WarehouseCategory from './WarehouseCategory';

const WarehouseOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({}); // Object to store checked state of items

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

  const handleCheckboxChange = (itemId) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const completeOrder = async () => {
    try {
      const allItemsChecked = Object.keys(checkedItems).length === order.items.length &&
        Object.values(checkedItems).every(Boolean);

      if (!allItemsChecked) {
        alert('Please verify all items before completing the order.');
        return;
      }

      await axios.patch(`${process.env.REACT_APP_LOCAL}/api/admin/orders/${orderId}/status`, { status: 'Finished Packing' }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      alert('Order status updated to Finished Packing');
      setOrder((prevOrder) => ({ ...prevOrder, status: 'Finished Packing' }));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

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

  // Determine if the button should be disabled
  const allItemsChecked = order.items.length > 0 && 
    Object.keys(checkedItems).length === order.items.length &&
    Object.values(checkedItems).every(Boolean);
  const isCompleteButtonDisabled = order.Status !== 'Approved' || !allItemsChecked;

  return (
    <div>
      <div className="order-details-container">
        <h2>Order Details - Warehouse</h2>
        <div className="order-details-content">
          <div className="order-info">
            <p><span>Order Number:</span> {order.ordernumber}</p>
            <p><span>Customer Email:</span> {order.email}</p>
          </div>
          <div className="order-items">
            <h3>Items:</h3>
            {order.items.map(item => (
              <div key={item.id} className="order-item">
                <input
                  type="checkbox"
                  checked={checkedItems[item.id] || false}
                  onChange={() => handleCheckboxChange(item.id)}
                  id={`item-${item.id}`}
                />
                <label htmlFor={`item-${item.id}`}>
                  {item.description} - {item.quantity} x ${item.price ? item.price.toFixed(2) : 'N/A'}
                </label>
              </div>
            ))}
          </div>
          <div className="total-price">
            <p><span>Total Price:</span> ${order.totalprice ? order.totalprice : 'N/A'}</p>
          </div>
          <div className="order-status">
            <p><span>Current Status:</span> {order.Status}</p>
          </div>
          <button
            onClick={completeOrder}
            className="complete-btn"
            disabled={isCompleteButtonDisabled}
          >
            Complete
          </button>
        </div>
        <Link to="/warehouse/orders" className="go-back-btn">Go Back</Link>
      </div>
      <WarehouseCategory />
    </div>
  );
};

export default WarehouseOrderDetails;
