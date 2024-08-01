import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './settings.css'
const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    // Fetch user settings from the server or local storage when the component mounts
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/settings`); // Adjust the endpoint as needed
        const { theme, language, notifications } = response.data;
        setTheme(theme);
        setLanguage(language);
        setNotifications(notifications);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleThemeChange = (e) => setTheme(e.target.value);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleNotificationsToggle = () => setNotifications(prev => !prev);

  const handleSave = async () => {
    try {
      await axios.post('/api/settings', { theme, language, notifications }); // Adjust the endpoint as needed
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
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

      <button onClick={handleSave}>Save Settings</button>
    </div>
  );
};

export default Settings;
