import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './settings.css';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);
  const [countries, setCountries] = useState([]);
  const [newCountryCode, setNewCountryCode] = useState('');
  const [newCountryName, setNewCountryName] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/settings/countries`);
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleThemeChange = (e) => setTheme(e.target.value);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleNotificationsToggle = () => setNotifications(prev => !prev);

  const handleSave = async () => {
    try {
      await axios.post('/api/settings', { theme, language, notifications });
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleAddCountry = async () => {
    try {
      await axios.post('/api/countries', { code: newCountryCode, name: newCountryName });
      setCountries(prev => [...prev, { code: newCountryCode, name: newCountryName }]);
      setNewCountryCode('');
      setNewCountryName('');
    } catch (error) {
      console.error('Error adding country:', error);
    }
  };

  const handleRemoveCountry = async (code) => {
    try {
      await axios.delete(`/api/countries/${code}`);
      setCountries(prev => prev.filter(c => c.code !== code));
    } catch (error) {
      console.error('Error removing country:', error);
    }
  };

  return (
    <div className="settings">
      <h2>Settings</h2>

      {/* Theme Selection */}
      <div className="settings-section">
        <h3>Appearance</h3>
        <label>
          Theme:
          <select value={theme} onChange={handleThemeChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>

      {/* Language Selection */}
      <div className="settings-section">
        <h3>Language</h3>
        <label>
          Language:
          <select value={language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            {/* Add more languages as needed */}
          </select>
        </label>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <h3>Notifications</h3>
        <label>
          Enable Notifications:
          <input
            type="checkbox"
            checked={notifications}
            onChange={handleNotificationsToggle}
          />
        </label>
      </div>

      {/* Manage Countries */}
      <div className="settings-section">
        <h3>Manage Countries</h3>
        <input
          type="text"
          value={newCountryCode}
          onChange={(e) => setNewCountryCode(e.target.value)}
          placeholder="Country Code"
        />
        <input
          type="text"
          value={newCountryName}
          onChange={(e) => setNewCountryName(e.target.value)}
          placeholder="Country Name"
        />
        <button onClick={handleAddCountry}>Add Country</button>

        <ul>
          {countries.map((country) => (
            <li key={country.code}>
              {country.name} ({country.code})
              <button onClick={() => handleRemoveCountry(country.code)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Save Settings */}
      <button onClick={handleSave}>Save Settings</button>

      {/* Additional Settings */}
      <div className="settings-section">
        <h3>Profile Settings</h3>
        {/* Add profile settings components here */}
      </div>

      <div className="settings-section">
        <h3>Account Security</h3>
        {/* Add account security components here */}
      </div>
      
      <div className="settings-section">
        <h3>Privacy Settings</h3>
        {/* Add privacy settings components here */}
      </div>
    </div>
  );
};

export default Settings;
