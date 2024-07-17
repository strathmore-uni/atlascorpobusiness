import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './users.css'; // Import the CSS file for styling
import AdminCategory from './AdminCategory';
import Adminnav from './Adminnav';

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/registeredusers`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

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
              {/* Add other relevant user information */}
            </div>
            <button className="view-button">View Details</button>
          </li>
        ))}
      </ul>
      
      <AdminCategory />
    </div>
  );
};

export default RegisteredUsers;
