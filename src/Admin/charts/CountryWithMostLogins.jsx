import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import './countrylogins.css'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Country to flag URL mapping
const flagUrls = {
  'US': 'https://www.countryflags.com/wp-content/uploads/usa-flag-png-large.png',
  'KE': 'https://www.countryflags.com/wp-content/uploads/kenya-flag-png-large.png',
  'UG': 'https://www.countryflags.com/wp-content/uploads/uganda-flag-png-large.png',
  'TZ': 'https://www.countryflags.com/wp-content/uploads/tanzania-flag-png-large.png',
  // Add more country codes and flags as needed
};

const CountryWithMostLogins = () => {
  const [countryData, setCountryData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/country-logins`);
        
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setCountryData(response.data);

          // Prepare data for chart
          const labels = response.data.map(item => item.country);
          const data = response.data.map(item => item.login_count);

          setChartData({
            labels,
            datasets: [{
              label: 'Login Counts by Country',
              data,
              backgroundColor: labels.map(country => flagUrls[country] ? `url(${flagUrls[country]})` : 'rgba(75, 192, 192, 0.6)'),
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }],
          });
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching country logins:", error);
      }
    };

    fetchCountryData();
  }, []);

  return (
    <div className="country-logins-container">
      <h3>Country Logins</h3>
      <div className="country-logins-cards">
        {countryData.length > 0 ? (
          countryData.map((item) => (
            <div key={item.country} className="country-card">
              <img
                src={flagUrls[item.country] || 'https://www.countryflags.com/wp-content/uploads/blank-flag.png'}
                alt={`Flag of ${item.country}`}
                className="country-flag"
              />
              <div className="country-info">
                <strong>{item.country}</strong>
                <p>Logins: {item.login_count}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No data available or loading...</p>
        )}
      </div>
      <div className="chart-container">
        {chartData.labels.length > 0 ? (
          <Bar data={chartData} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default CountryWithMostLogins;
