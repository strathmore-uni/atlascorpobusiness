import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AdminOrderHistory = () => {
  const { email } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log(`Attempting to fetch orders for: ${email}`); // Debug log
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/order-history/${email}`);
        console.log('API Response:', response.data); // Debug log
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
        console.log('Fetch completed'); // Debug log
      }
    };
  
    fetchOrders();
  }, [email]);
  

  if (loading) return <p>Loading...</p>;

  if (orders.length === 0) return <p>No orders found for {email}.</p>; // Handle case when no orders are returned

  return (
    <div>
      <h2>Order History for {email}</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <p>Order Number: {order.ordernumber}</p>
            <p>Total Price: ${order.totalprice}</p>
            <p>Status: {order.status}</p> {/* Ensure 'status' matches the correct case */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrderHistory;
