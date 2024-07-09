import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './emailconfirmationpage.css';

const EmailConfirmation = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email');

  const handleVerifyEmail = async () => {
    setLoading(true); // Start loading state
    try {
      console.log('Verifying email:', email); // Debugging statement
      const response = await axios.get(`https://localhost:3001/verify-email?email=${email}`);
      console.log('Response:', response); // Debugging statement
      if (response.status === 200 && response.data.message === 'Email verified successfully') {
        setMessage('Email verified successfully. Redirecting to sign in...');
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } else {
        setMessage('There was an error verifying your email.');
      }
    } catch (error) {
      console.error('Error verifying email:', error); // Debugging statement
      setMessage('There was an error verifying your email.');
    } finally {
      setLoading(false); // Stop loading state regardless of success or failure
    }
  };

  return (
    <div className="email-confirmation-container">
      <h1>Email Confirmation</h1>
      <p>Please click the button below to verify your email.</p>
      <button onClick={handleVerifyEmail} disabled={loading}>
        Verify Email
      </button>
      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmailConfirmation;
