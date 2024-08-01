import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './notificationspage.css';
import { useAuth } from '../MainOpeningpage/AuthContext';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser || !currentUser.email) {
        setError("User email is required for fetching notifications");
        console.error("Current user or email is missing:", currentUser); // Log currentUser details
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/notifications`, {
          params: { email: currentUser.email }
        });
        setNotifications(response.data);
      } catch (error) {
        setError("Error fetching notifications");
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_LOCAL}/api/admin/notifications/${id}`, {
        data: { email: currentUser.email } // Include currentUser.email in the request body
      });
      // Update the local state to reflect the change
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      setError("Error deleting notification");
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="notifications-container">
      <h1 className="notifications-title">Notifications</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div className="notification-card" key={notification.id}>
              <h2 className="notification-title">{notification.title || "Notification Title"}</h2>
              <p className="notification-details">{notification.message}</p>
              <p className="notification-timestamp">{new Date(notification.created_at).toLocaleString()}</p>
              <button
                className="notification-mark-read"
                onClick={() => markAsRead(notification.id)}
                disabled={notification.status === 'read'}
              >
                Mark as Read
              </button>
            </div>
          ))
        ) : (
          <p>No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
