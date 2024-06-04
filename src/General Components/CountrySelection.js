import React, { useState } from 'react';

const CountrySelection = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
 
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedCountry) {
      // Redirect user or proceed based on selected country
 
      window.location.href = './';
      // Your code to proceed after country selection
    }
  };

  const countries = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'FR', label: 'France' },
  ];

  return (
    <div className="country-selection">
      <h1>Please select your country:</h1>
      <select value={selectedCountry} onChange={handleCountryChange}>
        <option value="">-- Select a Country --</option>
        {countries.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </select>
      <button disabled={!selectedCountry} onClick={handleSubmit}>
        Continue
      </button>
    </div>
  );
};

export default CountrySelection;
