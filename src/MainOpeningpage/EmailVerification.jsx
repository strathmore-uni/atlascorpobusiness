import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const returnUrl = params.get('returnUrl');

    if (email) {
      // Add a small delay to display the "Loading..." message
      setTimeout(() => {
        axios.get(`/verify-email?email=${email}&returnUrl=${returnUrl}`)
          .then(response => {
            setMessage(response.data.message);
            setLoading(false);
            if (response.data.redirectUrl) {
              setTimeout(() => {
                navigate(response.data.redirectUrl);
              }, 3000); // Adjust delay as needed
            }
          })
          .catch(error => {
            setMessage('Error verifying email.');
            setLoading(false);
            console.error('Error verifying email:', error);
          });
      }, 500); // Adjust delay as needed
    } else {
      setMessage('Invalid verification link.');
      setLoading(false);
    }
  }, [location, navigate]);

  return (
    <div>
      {loading ? <p>Loading...</p> : <p>{message}</p>}
    </div>
  );
};

export default VerifyEmail;