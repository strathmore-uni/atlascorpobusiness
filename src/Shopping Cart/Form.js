import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css'
import axios from 'axios';

export default function Form() {
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

  const [errors, setErrors] = useState({});

  const handleFormDataChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  }, []);

  const navigate = useNavigate();

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

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
      }
    });

    if (!validatePassword(formData.password)) {
      newErrors.password =
        'Password must be at least 6 characters long and include upper and lower case letters, a number, and a special character';
    }

    if (formData.password !== formData.confpassword) {
      newErrors.confpassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // navigate('/review-order', { state: { formData } });

    try {
      const response = await axios.post('https://104.154.57.31:3001/api/register', formData, {
       
      });

      console.log('Registration successful:', response.data);
      // Handle success, e.g., show a success message to the user
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error, e.g., show an error message to the user
    }
  
  }, [formData, navigate]);
 
  


  return (
    <div>
      <form onSubmit={handleSubmit} className="form-container-registration">
        <div className="form-group">
          <label htmlFor='company_name'>
            Company Name
          </label>
          <input
            type='text'
            placeholder='Company Name'
            id='company_name'
            className='inputs'
            name='companyName'
            value={formData.companyName}
            onChange={handleFormDataChange}
          />
          {errors.companyName && <div className="error">{errors.companyName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor='title' className='titleForm'>
            Title
          </label>
          <select
            id="titleForm"
            value={formData.title}
            name='title'
            onChange={handleFormDataChange}
            className='input_title'
          >
            <option value="">Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
          </select>
          {errors.title && <div className="error">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor='country' className='country'>
            Country
          </label>
          <select
            id="country"
            value={formData.country}
            name='country'
            onChange={handleFormDataChange}
            className='country'
          >
            <option value="">Country</option>
            <option value="Kenya">Kenya</option>
            <option value="Uganda">Uganda</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Usa">United States of America</option>
            <option value="Uk">United Kingdom</option>
            <option value="China">China</option>
          </select>
          {errors.country && <div className="error">{errors.country}</div>}
        </div>

        <div className="form-group">
          <label htmlFor='fname' className='fname'>
            First Name
          </label>
          <input
            id='fname'
            className='fnameinput'
            placeholder='First Name'
            name="firstName"
            value={formData.firstName}
            onChange={handleFormDataChange}
          />
          {errors.firstName && <div className="error">{errors.firstName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor='sname' className='sname'>
            Second Name
          </label>
          <input
            id='sname'
            className='snameinput'
            placeholder='Second Name'
            name="secondName"
            value={formData.secondName}
            onChange={handleFormDataChange}
          />
          {errors.secondName && <div className="error">{errors.secondName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor='firstaddress' className='streetaddresslabel'>
            Address 1
          </label>
          <input
            id='firstaddress'
            className='streetaddressinput'
            placeholder='Street Address'
            name="address1"
            value={formData.address1}
            onChange={handleFormDataChange}
          />
          {errors.address1 && <div className="error">{errors.address1}</div>}
        </div>

        <div className="form-group">
          <label htmlFor='secondaddress' className='streetaddress2label'>
            Address 2
          </label>
          <input
            id='secondaddress'
            className='streetaddress2input'
            placeholder='Street Address 2'
            name="address2"
            value={formData.address2}
            onChange={handleFormDataChange}
          />
          {errors.address2 && <div className="error">{errors.address2}</div>}
        </div>

        <div className="form-group">
          <label htmlFor='city' className='citylabel'>
            City
          </label>
          <input
            id='city'
            className='cityinput'
            placeholder='City'
            name='city'
            value={formData.city}
            onChange={handleFormDataChange}
          />
          {errors.city && <div className="error">{errors.city}</div>}
        </div>

        <div className="form-group">
          <label htmlFor='zip' className='ziplabel'>
            Zip Code
          </label>
          <input
            className='zipinput'
            placeholder='Postal Code/Zip'
            id='zip'
            name='zip'
            value={formData.zip}
            onChange={handleFormDataChange}
          />
          {errors.zip && <div className="error">{errors.zip}</div>}
        </div>

        <div className="form-group">
          <label htmlFor='phone' className='phonelabel'>
            Phone
          </label>
          <input
            type='number'
            id='phone'
            className='phoneinput'
            placeholder='+25471234567'
            name='phone'
            value={formData.phone}
            onChange={handleFormDataChange}
          />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label htmlFor='email' className='emaillabel'>
            Email
          </label>
          <input
            id='email'
            className='emailinput'
            placeholder='1234@gmail.com'
            name='email'
            value={formData.email}
            onChange={handleFormDataChange}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor='password' className='password'>
            Password
          </label>
          <input
            type='password'
            id='Password'
            className='passwordinput'
            placeholder='Password'
            name='password'
            value={formData.password}
            onChange={handleFormDataChange}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <div className="form-group">
          <label htmlFor='confirm password' className='password'>
            Confirm Password
          </label>
          <input
            type='password'
            id='confPassword'
            className='confpasswordinput'
            placeholder='Confirm password'
            name='confpassword'
            value={formData.confpassword}
            onChange={handleFormDataChange}
          />
          {errors.confpassword && <div className="error">{errors.confpassword}</div>}
        </div>
    

        <button type='submit' className='btn_continue'>Continue</button>
      </form>
    </div>
  );
}
