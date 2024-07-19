import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './users.css'; // Import the CSS file for styling
import AdminCategory from './AdminCategory';
import Adminnav from './Adminnav';

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // State for the selected user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/registeredusers`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewDetails = async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/registeredusers/${userId}`);
      setSelectedUser(response.data); // Set the selected user details
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleBackToList = () => {
    setSelectedUser(null); // Reset selected user to return to list view
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

  if (selectedUser) {
    return (
      <div className="user-details-container">
        <button onClick={handleBackToList} className="back-button">Back to List</button>
        <h2>User Details</h2>
        <div className="user-details-info">
          <strong>Email:</strong> {selectedUser.email}<br />
          <strong>Name:</strong> {selectedUser.firstName} {selectedUser.secondName}<br />
          <strong>Company:</strong> {selectedUser.companyName}<br />
          <strong>Address 1:</strong> {selectedUser.address1}<br />
          <strong>Address 2:</strong> {selectedUser.address2}<br />
          <strong>Phone:</strong> {selectedUser.phone}<br />
          <strong>City:</strong> {selectedUser.city}<br />
          <strong>Zip Code:</strong> {selectedUser.zip}<br />
          <strong>Country:</strong> {selectedUser.country}<br />
          {/* Add more details as needed */}
        </div>
        <AdminCategory />
      </div>
    );
  }

  return (
    <div className="users-container">
      <h2>Registered Users</h2>
      <ul className="user-list">
        {users.map(user => (
          <li key={user.id} className="user-card">
            <div className="user-details">
              <strong>Email:</strong> {user.email}<br />
              <strong>Name:</strong> {user.firstName} {user.secondName}<br />
              <strong>Company:</strong> {user.companyName}<br />
            </div>
            <button
              className="view-button"
              onClick={() => handleViewDetails(user.id)}
            >
              View Details
            </button>
          </li>
        ))}
      </ul>
      <AdminCategory />
    </div>
  );
};

export default RegisteredUsers;
