import React, { useState } from 'react';
import './ProfileTab.css'; // Ensure this CSS file is linked

// Sample profile picture URL for demonstration; replace with actual profile image source.
const sampleProfilePicture = "https://images.pexels.com/photos/3760373/pexels-photo-3760373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

// Fetch current user details; replace this with actual data fetching logic as needed.
const fetchCurrentUser = () => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing user data from local storage:', error);
    }
  }
  return { name: 'Admin', role: 'Super Admin' }; // Fallback user details
};

const ProfileTab = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const currentUser = fetchCurrentUser();

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="profile-tab">
      <div className="profile-info" onClick={toggleDropdown}>
        <img
          src={sampleProfilePicture} // Replace with actual admin image URL
          alt="Profile"
          className="profile-picture"
        />
       
        <div className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`}>▼</div>
      </div>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="profile-dropdown">
          <ul>
            <li onClick={() => alert('Change Name functionality')}>
              Change Name
            </li>
            <li onClick={() => alert('Change Password functionality')}>
              Change Password
            </li>
            <li onClick={() => alert('View Profile functionality')}>
              View Profile
            </li>
            <li onClick={() => alert('Logout functionality')}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
