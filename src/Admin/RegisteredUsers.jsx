import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
import './users.css'; // Import the CSS file for styling
import AdminCategory from './AdminCategory';
import Adminnav from './Adminnav';
import { useAuth } from '../MainOpeningpage/AuthContext';

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(''); // State for selected country
  const [countries, setCountries] = useState([]); // State for country options
  const { currentUser } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser || !currentUser.email) {
        setError('No admin email provided');
        toast.error('No admin email provided');
        return;
      }

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
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/countries`);
        if (Array.isArray(response.data)) {
          setCountries(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast.error('Failed to fetch countries.');
      }
    };
  
    fetchCountries();
  }, []);

  const handleViewDetails = async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/registeredusers/${userId}`, {
        params: { email: currentUser.email }
      });
      setSelectedUser(response.data);
      toast.success('User details fetched successfully');
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details you dont have necessary permissions.');
    }
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const handleCountryChange = async (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
  
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/registeredusers`, {
        params: { email: currentUser.email, country }
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
      toast.success('Users filtered successfully');
    } catch (error) {
      console.error('Error fetching filtered users:', error);
      toast.error('Failed to filter users .');
    }
  };
  const handleSuspendUser = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend this user?')) {
      return;
    }
  
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/suspenduser`, {
        email: currentUser.email,
        userId
      });
      toast.success('User suspended successfully');
      // Optionally, you can refetch users to update the list
      fetchUsers();
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user.');
    }
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
  {/* Suspend Button */}
  <button
    onClick={() => handleSuspendUser(selectedUser.id)}
    className="suspend-button"
  >
    Suspend User
  </button>
</div>

        <AdminCategory />
        <ToastContainer /> {/* Include ToastContainer to display toasts */}
      </div>
    );
  }

  return (
    <div className="users-container">
      <h2>Registered Users</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Country Filter Dropdown */}
      {currentUser.email === 'superadmin@gmail.com' && (
      <div className="filter-container">
        <label htmlFor="country-select">Filter by Country:</label>
        <select
          id="country-select"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country.code} value={country.name}>{country.name}</option>
          ))}
        </select>
      </div>
      )}
      <ul className="user-list">
        {filteredUsers.map(user => (
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
      <ToastContainer /> {/* Include ToastContainer to display toasts */}
    </div>
  );
};

export default RegisteredUsers;
