import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../MainOpeningpage/AuthContext';
import './saleschartcountry.css';

ChartJS.register(ArcElement, Tooltip, Legend);
const fetchCurrentUser = () => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      console.log('Fetched User:', parsedUser);
      return parsedUser;
    } catch (error) {
      console.error('Error parsing user data from local storage:', error);
      return null;
    }
  }
  console.error('No user data found in local storage.');
  return null;
};
const currentUser = fetchCurrentUser();

const admin = currentUser.isMiniAdmin;
console.log(admin)
const SalesByCountryChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [filterType, setFilterType] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        let params = { email: currentUser.email, filterType };

        if (filterType === 'custom' && startDate && endDate) {
          params.startDate = startDate;
          params.endDate = endDate;
        }
       
        let apiUrl = admin
          ? `${process.env.REACT_APP_LOCAL}/api/admin/orders/sales-by-city`
          : `${process.env.REACT_APP_LOCAL}/api/admin/orders/sales-by-country`;

        const response = await axios.get(apiUrl, { params });
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [filterType, startDate, endDate, currentUser]);

  const doughnutData = {
    labels: salesData.map(sale =>admin ? sale.city : sale.country),
    datasets: [
      {
        label: 'Total Sales',
        data: salesData.map(sale => parseFloat(sale.total_sales)),
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container-country">
      <div className="chart-header">
        <h3>Sales by {admin ? 'City' : 'Country'}</h3>
      </div>
      <div className="filter-container">
        <div className="filter-buttons">
          <button
            onClick={() => setFilterType('weekly')}
            className={filterType === 'weekly' ? 'active' : ''}
          >
            Weekly
          </button>
          <button
            onClick={() => setFilterType('monthly')}
            className={filterType === 'monthly' ? 'active' : ''}
          >
            Monthly
          </button>
          <button
            onClick={() => setFilterType('custom')}
            className={filterType === 'custom' ? 'active' : ''}
          >
            Custom Range
          </button>
        </div>
        {filterType === 'custom' && (
          <div className="date-range">
            <input
              type="date"
              id="startDate"
              placeholder='Start Date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              id="endDate"
              placeholder='End Date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="doughnut-chart">
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
};

export default SalesByCountryChart;
