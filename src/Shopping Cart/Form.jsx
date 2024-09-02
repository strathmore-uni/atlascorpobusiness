import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css'; // Updated CSS file name
import axios from 'axios';
import emailjs from 'emailjs-com';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    firstName: '',
    secondName: '',
    address1: '',
    address2: '',
    city: '',
    zip: '',
    phone: '',
    email: '',
    password: '',
    confpassword: '',
    country: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [failureNotification, setFailureNotification] = useState('');

  const navigate = useNavigate();

  const handleFormDataChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  }, []);

  const validatePassword = (password) => {
    const minLength = /.{6,}/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      minLength.test(password) &&
      hasUpperCase.test(password) &&
      hasLowerCase.test(password) &&
      hasNumber.test(password) &&
      hasSpecialChar.test(password)
    );
  };

  const validateFormData = (formData) => {
    const errors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== 'address2') { // Address2 is optional
        errors[key] = `${key} is required`;
      }
    });

    if (formData.title && !['Mr', 'Mrs', 'Ms'].includes(formData.title)) {
      errors.title = 'Invalid title';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    return errors;
  };

  const sendEmailConfirmation = async (formData, returnUrl) => {
    try {
      const verificationLink = `https://localhost:3001/verify-email?email=${encodeURIComponent(formData.email)}&returnUrl=${encodeURIComponent(returnUrl)}`;
      const templateParams = {
        from_name: formData.firstName,
        to_email: formData.email,
        message: 'Thank you for registering with us!',
        reply_to: 'support@example.com',
        verification_link: verificationLink
      };

      await emailjs.send('service_ie3g4m5', 'template_igi5iov', templateParams, 'HSw7Ydql4N9nzAoVn');
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleTabSwitch = (step) => {
    // Validate the current step before switching
    if (validateCurrentStep()) {
      setCurrentStep(step);
    }
  };

  const validateCurrentStep = () => {
    let stepSpecificFormData = {};

    if (currentStep === 1) {
      stepSpecificFormData = {
        email: formData.email,
        password: formData.password,
        confpassword: formData.confpassword,
      };
    } else if (currentStep === 2) {
      stepSpecificFormData = {
        title: formData.title,
        firstName: formData.firstName,
        secondName: formData.secondName,
        phone: formData.phone,
      };
    } else if (currentStep === 3) {
      stepSpecificFormData = {
        address1: formData.address1,
        city: formData.city,
        zip: formData.zip,
        country: formData.country,
      };
    } else if (currentStep === 4) {
      stepSpecificFormData = {
        companyName: formData.companyName,
      };
    }

    const errors = validateFormData(stepSpecificFormData);

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return false;
    }

    if (currentStep === 1 && formData.password !== formData.confpassword) {
      setErrors({ confpassword: 'Passwords do not match' });
      return false;
    }

    if (currentStep === 1 && !validatePassword(formData.password)) {
      setErrors({ password: 'Password does not meet the requirements' });
      return false;
    }

    return true;
  };

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
  
    if (!validateCurrentStep()) {
      return;
    }
  
    const errors = validateFormData(formData);
  
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
  
    if (!validatePassword(formData.password)) {
      setErrors({ password: 'Password does not meet the requirements' });
      return;
    }
  
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/register`, formData);
  
      const returnUrl = 'https://localhost:3000/verify-email';
      await sendEmailConfirmation(formData, returnUrl);
  
      setSuccessMessage('Registration successful! Please check your email for verification.');
      navigate('/signin');
    } catch (error) {
      // Extract error message from the backend response
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    }
  }, [formData, navigate]);
  

  return (
    <div className="registration-form-container">
      <div className="tabs-container">
        <div
          className={`tab ${currentStep === 1 ? 'tab-active' : 'tab-inactive'}`}
          onClick={() => handleTabSwitch(1)}
        >
          Personal Information
        </div>
        <div
          className={`tab ${currentStep === 2 ? 'tab-active' : 'tab-inactive'}`}
          onClick={() => handleTabSwitch(2)}
        >
          Contact Information
        </div>
        <div
          className={`tab ${currentStep === 3 ? 'tab-active' : 'tab-inactive'}`}
          onClick={() => handleTabSwitch(3)}
        >
          Address
        </div>
        <div
          className={`tab ${currentStep === 4 ? 'tab-active' : 'tab-inactive'}`}
          onClick={() => handleTabSwitch(4)}
        >
          Company Info
        </div>
      </div>

      {currentStep === 1 && (
        <div className="form-step">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleFormDataChange}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}

          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleFormDataChange}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}

          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="confpassword"
            className="form-input"
            value={formData.confpassword}
            onChange={handleFormDataChange}
          />
          {errors.confpassword && <div className="error-message">{errors.confpassword}</div>}
        </div>
      )}

      {currentStep === 2 && (
        <div className="form-step">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-input"
            value={formData.title}
            onChange={handleFormDataChange}
          />
          {errors.title && <div className="error-message">{errors.title}</div>}

          <label className="form-label">First Name</label>
          <input
            type="text"
            name="firstName"
            className="form-input"
            value={formData.firstName}
            onChange={handleFormDataChange}
          />
          {errors.firstName && <div className="error-message">{errors.firstName}</div>}

          <label className="form-label">Second Name</label>
          <input
            type="text"
            name="secondName"
            className="form-input"
            value={formData.secondName}
            onChange={handleFormDataChange}
          />
          {errors.secondName && <div className="error-message">{errors.secondName}</div>}

          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleFormDataChange}
          />
          {errors.phone && <div className="error-message">{errors.phone}</div>}
        </div>
      )}

      {currentStep === 3 && (
        <div className="form-step">
          <label className="form-label">Address 1</label>
          <input
            type="text"
            name="address1"
            className="form-input"
            value={formData.address1}
            onChange={handleFormDataChange}
          />
          {errors.address2 && <div className="error-message">{errors.address2}</div>}
          <label className="form-label">Address 2</label>
          <input
            type="text"
            name="address2"
            className="form-input"
            value={formData.address2}
            onChange={handleFormDataChange}
          />
          {errors.address2 && <div className="error-message">{errors.address2}</div>}


          <label className="form-label">City</label>
          <input
            type="text"
            name="city"
            className="form-input"
            value={formData.city}
            onChange={handleFormDataChange}
          />
          {errors.city && <div className="error-message">{errors.city}</div>}

          <label className="form-label">Zip Code</label>
          <input
            type="text"
            name="zip"
            className="form-input"
            value={formData.zip}
            onChange={handleFormDataChange}
          />
          {errors.zip && <div className="error-message">{errors.zip}</div>}

          <label className="form-label">Country</label>
          <input
            type="text"
            name="country"
            className="form-input"
            value={formData.country}
            onChange={handleFormDataChange}
          />
          {errors.country && <div className="error-message">{errors.country}</div>}
        </div>
      )}

      {currentStep === 4 && (
        <div className="form-step">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            name="companyName"
            className="form-input"
            value={formData.companyName}
            onChange={handleFormDataChange}
          />
          {errors.companyName && <div className="error-message">{errors.companyName}</div>}
        </div>
      )}

      {errorMessage && <div className="error-message">{typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage}</div>}
      {successMessage && <div className="success-message">{typeof successMessage === 'object' ? JSON.stringify(successMessage) : successMessage}</div>}
      {notificationMessage && <div className="notification-message">{typeof notificationMessage === 'object' ? JSON.stringify(notificationMessage) : notificationMessage}</div>}
      {failureNotification && <div className="error-message">{typeof failureNotification === 'object' ? JSON.stringify(failureNotification) : failureNotification}</div>}

      <div className="button-group">
        {currentStep > 1 && (
          <button type="button" onClick={() => handleTabSwitch(currentStep - 1)}>
            Previous
          </button>
        )}
        {currentStep < 4 ? (
          <button type="button" onClick={() => handleTabSwitch(currentStep + 1)}>
            Next
          </button>
        ) : (
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        )}

      </div>
     

    </div>
  );
}
