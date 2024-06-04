import React, { useState, useEffect } from 'react';
import './countryselectormodal.css';

export default function CountrySelectorModal({ onSelectCountry }) {
  const countries = [
    { value: 'KE', label: 'Kenya' },
    { value: 'US', label: 'United States' },
    { value: 'UG', label: 'Uganda' },
    { value: 'TZ', label: 'Tanzania' },
  ];

  const [selectedCountry, setSelectedCountry] = useState('');
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const storedCountry = localStorage.getItem("selectedCountry");
    if (storedCountry) {
      setSelectedCountry(storedCountry);
      setShowModal(false);
    }
  }, []);

  const handleSelectCountry = (country) => {
    if (country && country !== selectedCountry) {
      localStorage.setItem("selectedCountry", country);
      setSelectedCountry(country);
      setShowModal(false);
      onSelectCountry(country);
    }
  };

  return (
    <div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select Your Country</h2>
            <select 
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="" disabled>Select a country</option>
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
            <button onClick={() => handleSelectCountry(selectedCountry)}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
}