import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userprofile.css';
import '../Shopping Cart/checkout.css'
import Notification from '../General Components/Notification';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { useAuth } from '../MainOpeningpage/AuthContext';
import NavigationBar from '../General Components/NavigationBar';
export default function Userprofile() {
  const [userData, setUserData] = useState({});
  const [editing, setEditing] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  // State variables for editable fields
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/?email=${currentUser.email}`);
        const userData = response.data;
        setUserData(userData);

        // Initialize editable fields with current data
        setCompanyName(userData.companyName);
        setTitle(userData.title);
        setFirstName(userData.firstName);
        setSecondName(userData.secondName);
        setAddress1(userData.address1);
        setAddress2(userData.address2);
        setCity(userData.city);
        setZip(userData.zip);
        setPhone(userData.phone);
        setCountry(userData.country);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset editable fields to current data
    setCompanyName(userData.companyName);
    setTitle(userData.title);
    setFirstName(userData.firstName);
    setSecondName(userData.secondName);
    setAddress1(userData.address1);
    setAddress2(userData.address2);
    setCity(userData.city);
    setZip(userData.zip);
    setPhone(userData.phone);
    setCountry(userData.country);
    setEditing(false);
  };

  const handleUpdate = async () => {
    try {
      const updatedUserData = {
        companyName,
        title,
        firstName,
        secondName,
        address1,
        address2,
        city,
        zip,
        phone,
        country,
        email: userData.email // Include the email for identification in the backend
      };

      const response = await axios.put(`${process.env.REACT_APP_LOCAL}/api/user/update`, updatedUserData);
      console.log('Update successful:', response.data);
      

      // Update local state with new data
      setUserData(updatedUserData);
      setNotificationMessage('User Information Updated');
      setTimeout(() => {
        setNotificationMessage('');
      }, 3000
  );

      // Exit edit mode
      setEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  

  return (
    <div>
    <div className='userprofile_container'>
           <Link to='/shop' className='backtoform'>
          <p><IoIosArrowBack className='arrowbackReview' />Back</p>
        </Link>
       {loading ? (
        <p>Loading...</p>
      ) : editing ? (
        <>
          <div className='form-group'>
            <label htmlFor='companyName'>Company Name:</label>
            <input
              type='text'
              id='companyName'
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='title'>Title:</label>
            <input type='text' id='title' value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className='form-group'>
            <label htmlFor='firstName'>First Name:</label>
            <input
              type='text'
              id='firstName'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='secondName'>Second Name:</label>
            <input
              type='text'
              id='secondName'
              value={secondName}
              onChange={(e) => setSecondName(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='address1'>Address 1:</label>
            <input
              type='text'
              id='address1'
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='address2'>Address 2:</label>
            <input
              type='text'
              id='address2'
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='city'>City:</label>
            <input type='text' id='city' value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className='form-group'>
            <label htmlFor='zip'>Zip Code:</label>
            <input type='text' id='zip' value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
          <div className='form-group'>
            <label htmlFor='phone'>Phone:</label>
            <input type='text' id='phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
          <label htmlFor='country' className='country'>
            Country
          </label>
          <select
            id="country"
            value={country}
            name='country'
            onChange={(e) => setCountry(e.target.value)}
            className='country'
          >
            <option value="">Country</option>
            <option value="KE">Kenya</option>
            <option value="UG">Uganda</option>
            <option value="TZ">Tanzania</option>
            <option value="USA">United States of America</option>
            <option value="UK">United Kingdom</option>
            <option value="CH">China</option>
          </select>
         
        </div>

          <div className='button-group'>
            <button className='btn' onClick={handleUpdate}>
              Update
            </button>
            <button className='btn' onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className='info-group'>
            <p><strong>Company Name:</strong> {userData.companyName}</p>
            <p><strong>Title:</strong> {userData.title}</p>
            <p><strong>First Name:</strong> {userData.firstName}</p>
            <p><strong>Second Name:</strong> {userData.secondName}</p>
            <p><strong>Address 1:</strong> {userData.address1}</p>
            <p><strong>Address 2:</strong> {userData.address2}</p>
            <p><strong>City:</strong> {userData.city}</p>
            <p><strong>Zip Code:</strong> {userData.zip}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Country</strong> {userData.country}</p>
          </div>

          <button className='btn' onClick={handleEdit}>
            Edit
          </button>
        </>
      )}
        {notificationMessage && <Notification message={notificationMessage} />}
    </div>
    <NavigationBar />
    </div>
  );
}
