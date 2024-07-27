import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminCategory from '../AdminCategory';

const MiniAdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserCount = async () => {
      const token = localStorage.getItem('token');
      const country = localStorage.getItem('country');
      if (!token || !country) {
        setError('User not authenticated');
        return;
      }
  
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/minadmin/users/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Country: country
          }
        });
        setUserCount(response.data.count);
      } catch (error) {
        console.error('Error fetching user count:', error);
        setError('Failed to fetch user count.');
      }
    };
  
    fetchUserCount();
  }, []);

  return (
    <div>
      <div className="maincontainer_admin">
        <h2>Dashboard</h2>
        <div className="notification-bell">
          <Link to="/notifications">
            <span className="bell-icon">&#128276;</span>
          </Link>
        </div>
        <div className="admin-dashboard-summary">
          <div className="summary-item">
            <h3>Total Users</h3>
            {error ? <p>{error}</p> : <p>{userCount}</p>}
          </div>
        </div>
      </div>
      <AdminCategory />
    </div>
  );
};

export default MiniAdminDashboard;
