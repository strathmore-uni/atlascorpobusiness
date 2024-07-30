import React, { useState, useEffect, useCallback } from 'react';
import '../users.css'; // Import the CSS file for styling
import MinAdminCategory from './MiniAdminCategory';
import { useAuth } from '../../MainOpeningpage/AuthContext';

const MiniAdminRegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // State for the selected user
  const { currentUser } = useAuth();
  const [error, setError] = useState(null); // State for error handling

  const fetchRegisteredUsers = useCallback(async () => {
    if (!currentUser || !currentUser.email) {
      setError('No admin email provided');
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_LOCAL}/api/miniadmin/registeredusers?email=${currentUser.email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch registered users.');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching registered users:', error);
      setError('Failed to fetch registered users.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);
  
  useEffect(() => {
    fetchRegisteredUsers();
  }, [fetchRegisteredUsers]);

  const handleViewDetails = async (userId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_LOCAL}/api/registeredusers/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details.');
      }
      const data = await response.json();
      setSelectedUser(data); // Set the selected user details
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
        <MinAdminCategory />
      </div>
    );
  }

  return (
    <div className="users-container">
      <h2>Registered Users</h2>
      {error && <p className="error-message">{error}</p>}
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
      <MinAdminCategory/>
    </div>
  );
};

export default MiniAdminRegisteredUsers;
