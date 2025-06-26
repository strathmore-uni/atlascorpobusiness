import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './users.css';
import { IoChevronBackOutline } from "react-icons/io5";
import { useAuth } from '../MainOpeningpage/AuthContext';
import { useLoading } from '../General Components/LoadingProvider';
import LoadingSpinner from '../General Components/LoadingSpinner';

import AdminCategory from './AdminCategory';

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('details'); // State for active tab
  const { currentUser } = useAuth();
  const { setLoading, getLoadingState } = useLoading();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser || !currentUser.email) {
        setError('No admin email provided');
        toast.error('No admin email provided');
        return;
      }

      setLoading('users', true, 'Loading users...');
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/registeredusers`, {
          params: { email: currentUser.email }
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
        toast.success('Users fetched successfully');
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users.');
        toast.error('Failed to fetch users.');
      } finally {
        setLoading('users', false);
      }
    };

    fetchUsers();
  }, [currentUser, setLoading]);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading('countries', true, 'Loading countries...');
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/countries`);
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast.error('Failed to fetch countries.');
      } finally {
        setLoading('countries', false);
      }
    };

    fetchCountries();
  }, [setLoading]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setActiveTab('details');
    
    if (user.email) {
      setLoading('orderHistory', true, 'Loading order history...');
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/orders`, {
          params: { email: user.email }
        });
        setOrderHistory(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
        toast.error('Failed to fetch order history.');
      } finally {
        setLoading('orderHistory', false);
      }
    }
  };

  const handleCountryChange = async (event) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);
  
    // Debug log to check the selected country
    console.log(`Selected Country: ${selectedCountry}`);
  
    setLoading('filterUsers', true, 'Filtering users...');
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/registeredusers`, {
        params: { email: currentUser.email, country: selectedCountry || undefined },
      });
  
      // Debug log to check the response
      console.log('Filtered Users Response:', response.data);
      setFilteredUsers(response.data);
      toast.success('Users filtered successfully');
    } catch (error) {
      console.error('Error fetching filtered users:', error);
      toast.error('Failed to filter users.');
    } finally {
      setLoading('filterUsers', false);
    }
  };
  
  const handleSuspendUser = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend this user?')) {
      return;
    }

    setLoading('suspendUser', true, 'Suspending user...');
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/suspenduser`, {
        email: currentUser.email,
        userId
      });
      toast.success('User suspended successfully');
      // Refresh user list after suspension
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/registeredusers`, {
        params: { email: currentUser.email }
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user.');
    } finally {
      setLoading('suspendUser', false);
    }
  };

  const usersLoading = getLoadingState('users');
  const countriesLoading = getLoadingState('countries');
  const orderHistoryLoading = getLoadingState('orderHistory');
  const filterUsersLoading = getLoadingState('filterUsers');
  const suspendUserLoading = getLoadingState('suspendUser');

  if (usersLoading.isLoading) {
    return (
      <LoadingSpinner
        type="dots"
        size="large"
        color="blue"
        text="Loading users..."
        fullScreen={true}
      />
    );
  }

  if (error) {
    return (
      <div className="users-container">
        <AdminCategory />
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <AdminCategory />
      <div className="users-content">
        <div className="users-header">
          <h2>Registered Users</h2>
          <div className="filter-section">
            <label htmlFor="country-select">Filter by Country:</label>
            <select
              id="country-select"
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={countriesLoading.isLoading}
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>{country.name}</option>
              ))}
            </select>
            {countriesLoading.isLoading && (
              <LoadingSpinner type="ring" size="small" color="blue" text="" />
            )}
          </div>
        </div>

        <div className="users-list">
          {filterUsersLoading.isLoading ? (
            <LoadingSpinner
              type="wave"
              size="medium"
              color="blue"
              text="Filtering users..."
            />
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="user-card" onClick={() => handleUserClick(user)}>
                <div className="user-details-info">
                  <strong>Name:</strong> {user.name || 'N/A'}<br />
                  <strong>Email:</strong> {user.email}<br />
                  <strong>Country:</strong> {user.country || 'N/A'}<br />
                  <strong>Phone:</strong> {user.phone || 'N/A'}<br />
                  <strong>Status:</strong> {user.status || 'Active'}
                </div>
                <button
                  className="view-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserClick(user);
                  }}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>

        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>User Details</h3>
                <button
                  className="close-button"
                  onClick={() => setSelectedUser(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-tabs">
                <button
                  className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button
                  className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  Order History
                </button>
              </div>

              <div className="modal-body">
                {activeTab === 'details' && (
                  <div className="user-details">
                    <p><strong>Name:</strong> {selectedUser.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Country:</strong> {selectedUser.country || 'N/A'}</p>
                    <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                    <p><strong>Status:</strong> {selectedUser.status || 'Active'}</p>
                    <p><strong>Registration Date:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="order-history">
                    {orderHistoryLoading.isLoading ? (
                      <LoadingSpinner
                        type="bounce"
                        size="medium"
                        color="blue"
                        text="Loading order history..."
                      />
                    ) : orderHistory.length > 0 ? (
                      <div className="orders-list">
                        {orderHistory.map((order) => (
                          <div key={order.id} className="order-item">
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Total:</strong> ${order.total}</p>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No order history found for this user.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="modal-button"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
                <button
                  className="modal-button suspend-button"
                  onClick={() => handleSuspendUser(selectedUser.id)}
                  disabled={suspendUserLoading.isLoading}
                >
                  {suspendUserLoading.isLoading ? (
                    <LoadingSpinner type="ring" size="small" color="white" text="" />
                  ) : (
                    'Suspend User'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisteredUsers;
