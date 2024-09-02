import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './forgotpassword.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendResetEmail = (event) => {
    event.preventDefault();

    const templateParams = {
      email: email,
      resetLink: `https://localhost:3000/reset-password?email=${email}`
    };

    emailjs.send(
      'service_bmvwx28', 
      'template_ye9c297', 
      templateParams,
      'KeePPXIGkpTcoiTBJ' 
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      setMessage('Password reset email sent. Please check your inbox.');
      setError('');
    })
    .catch((error) => {
      console.error('FAILED...', error);
      setError('Error sending password reset email. Please try again.');
      setMessage('');
    });
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={sendResetEmail}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Password Reset Email</button>
      </form>
      
    </div>
  );
};

export default ForgotPasswordPage;
