import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../MainOpeningpage/AuthContext';
import './usernotificationpage.css'; // Ensure this CSS file is imported

export default function UserNotificationPage() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!currentUser) return;

        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/notifications`, {
          params: { email: currentUser.email }
        });

        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id} className={notification.read ? "" : "unread"}>
            <div className="notification-message">
              {notification.orderNumber && (
                <span className="order-number">Order {notification.orderNumber}</span>
              )}
              <span className="notification-text">: {notification.message}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
