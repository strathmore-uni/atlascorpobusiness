import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../MainOpeningpage/AuthContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/orders', { params: { userId: currentUser } });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  return (
    <div>
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>No past orders found</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id}>
              <h2>Order Number: {order.orderNumber}</h2>
              <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p>Total: ${order.newPrice.toFixed(2)}</p>
              <h3>Items:</h3>
              <ul>
                {JSON.parse(order.cartItems).map(item => (
                  <li key={item.id}>
                    {item.Description} - {item.quantity} x ${item.Price}
                  </li>
                ))}
              </ul>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
