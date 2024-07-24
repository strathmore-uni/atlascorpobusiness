import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './notificationspage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/notifications`);
        setNotifications(response.data);
      } catch (error) {
        setError("Error fetching notifications");
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_LOCAL}/api/admin/notifications/${id}/read`);
      // Update the local state to reflect the change
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, status: 'read' } : notification
      ));
    } catch (error) {
      setError("Error marking notification as read");
      console.error("Error marking notification as read:", error);
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
