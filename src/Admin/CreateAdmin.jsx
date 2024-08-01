import React, { useState } from 'react';
import axios from 'axios';

const CreateAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState(''); // Added country state
  const [error, setError] = useState('');

  // Define a list of country options
  const countryOptions = [
    { label: 'Kenya (KE)', value: 'KE' },
    { label: 'Uganda (UG)', value: 'UG' },
    { label: 'Tanzania (TZ)', value: 'TZ' },
    { label: 'United States (USA)', value: 'USA' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include country in the POST request
      await axios.post( `${process.env.REACT_APP_LOCAL}/api/admin/create-admin`, { email, password, country });
      alert('Admin created successfully');
    } catch (error) {
      setError('Failed to create admin');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div>
        <label>Country:</label>
        <select value={country} onChange={(e) => setCountry(e.target.value)} required>
          <option value="" disabled>Select a country</option>
          {countryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p>{error}</p>}
      <button type="submit">Create Admin</button>
    </form>
  );
};

export default CreateAdmin;
