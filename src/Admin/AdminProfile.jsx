// AdminProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './AdminProfile.css'; // Link to your CSS file for styling

// Dummy profile picture and user data - replace with actual data fetch logic as needed
const sampleProfilePicture = "https://via.placeholder.com/100";

const fetchCurrentUser = () => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing user data from local storage:', error);
    }
  }
  return { name: 'Admin', role: 'Super Admin', email: 'admin@example.com' }; // Fallback user details
};

const AdminProfile = () => {
  const [user, setUser] = useState(fetchCurrentUser());
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ name: '', email: '' });
  const navigate = useNavigate(); // Initialize useNavigate for routing

  useEffect(() => {
    if (user) {
      setUpdatedUser({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleEditToggle = () => setEditMode(!editMode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Update the user details here, e.g., API call to save changes
    setUser(updatedUser);
    setEditMode(false);
  };

  const handlePasswordChange = () => {
    navigate('/change-password'); // Navigate to change password page
  };

  const handleAccountSettings = () => {
    navigate('/account-settings'); // Navigate to account settings page
  };

  const handleActivityLog = () => {
    navigate('/activity-log'); // Navigate to activity log page
  };

  const handleLogout = () => {
    // Logic to handle logout (clear session, etc.)
    alert('Logging out...');
  };

  return (
    <div className="admin-profile">
      <div className="profile-header">
        <img src={sampleProfilePicture} alt="Profile" className="profile-image" />
        <div className="profile-info">
          {!editMode ? (
            <>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-role">{user.role}</p>
              <button className="edit-button" onClick={handleEditToggle}>
                Edit Profile
              </button>
            </>
          ) : (
            <div className="edit-fields">
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleChange}
                placeholder="Update Name"
                className="input-field"
              />
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleChange}
                placeholder="Update Email"
                className="input-field"
              />
              <button className="save-button" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={handleEditToggle}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-actions">
        <button className="action-button" onClick={handlePasswordChange}>
          Change Password
        </button>
        <button className="action-button" onClick={handleAccountSettings}>
          Account Settings
        </button>
        <button className="action-button" onClick={handleActivityLog}>
          View Activity Log
        </button>
        <button className="action-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
