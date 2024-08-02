import React, { useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import './CreateAdmin.css';
import AdminCategory from './AdminCategory';

const CreateAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');

  const countryOptions = [
    { label: 'Kenya (KE)', value: 'KE' },
    { label: 'Uganda (UG)', value: 'UG' },
    { label: 'Tanzania (TZ)', value: 'TZ' },
    { label: 'United States (USA)', value: 'USA' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/admin/create-admin`, { email, password, country });
      alert('Admin created successfully');
    } catch (error) {
      setError('Failed to create admin');
    }
  };

  return (
    <div>
        <h2>Admin Registration</h2>
        <form className='createadmin_form' onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className={classNames('form-control', { 'is-invalid': !email && error })}
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className={classNames('form-control', { 'is-invalid': !password && error })}
        />
      </div>
      <div className="form-group">
        <label>Country:</label>
        <select 
          value={country} 
          onChange={(e) => setCountry(e.target.value)} 
          required 
          className={classNames('form-control', { 'is-invalid': !country && error })}
        >
          <option value="" disabled>Select a country</option>
          {countryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="btn-submit">Create Admin</button>
    </form>
    <AdminCategory />
    </div>
  
  );
};

export default CreateAdmin;
