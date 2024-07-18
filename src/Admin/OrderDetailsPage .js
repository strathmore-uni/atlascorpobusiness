import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './OrderDetailsPage.css';
import AdminCategory from './AdminCategory';

const OrderDetailsPage = () => {
  const { category } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/${category}`);
        setOrders(response.data);
      } catch (error) {
        setError('Error fetching orders.');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [category]);

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
  </div>;;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found for {category}.</div>;
  }

  return (
    <div className="order-details-page">
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Orders</h1>
      <ul>

        {orders.map(order => (
                 
          <li key={order.id}>
          <Link to={`/orderdetails/${order.id}`} className="order-details-link">   <div>Order Number: {order.ordernumber}</div></Link>
            <div>Status: {order.status}</div>
            <div>Items:</div>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  <div>Description: {item.description}</div>
                  <div>Quantity: {item.quantity}</div>
                  <div>Price: ${item.price.toFixed(2)}</div>
                 
                </li>
              ))}
            </ul>
          </li>
          
        ))}

    </ul>
    <AdminCategory />
    </div>
  );
};

export default OrderDetailsPage;
