import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AdminCategory from '../AdminCategory';
import { useAuth } from '../../MainOpeningpage/AuthContext';
import MiniAdminCategory from './MiniAdminCategory';

const MiniAdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchUserCount = useCallback(async () => {
    if (!currentUser || !currentUser.email) {
      setError('No user email provided');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/minadmin/users/count?email=${currentUser.email}`);
      setUserCount(response.data.count);
    } catch (error) {
      console.error('Error fetching user count:', error);
      setError('Failed to fetch user count.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const fetchProductCount = useCallback(async () => {
    if (!currentUser || !currentUser.email) {
      setError('No user email provided');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/products/count?email=${currentUser.email}`);
      setProductCount(response.data.count);
    } catch (error) {
      console.error('Error fetching product count:', error);
      setError('Failed to fetch product count.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const fetchOrderCount = useCallback(async () => {
    if (!currentUser || !currentUser.email) {
      setError('No user email provided');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/count?email=${currentUser.email}`);
      setOrderCount(response.data.count);
    } catch (error) {
      console.error('Error fetching order count:', error);
      setError('Failed to fetch order count.');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserCount();
    fetchProductCount();
    fetchOrderCount();
  }, [fetchUserCount, fetchProductCount, fetchOrderCount]);

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
            {isLoading ? <p>Loading...</p> : error ? <p>{error}</p> : <p>{userCount}</p>}
          </div>
          <div className="summary-item">
            <h3>Total Products</h3>
            {isLoading ? <p>Loading...</p> : error ? <p>{error}</p> : <p>{productCount}</p>}
          </div>
          <div className="summary-item">
            <h3>Total Orders</h3>
            {isLoading ? <p>Loading...</p> : error ? <p>{error}</p> : <p>{orderCount}</p>}
          </div>
        </div>
      </div>
      <MiniAdminCategory />
    </div>
  );
};

export default MiniAdminDashboard;
