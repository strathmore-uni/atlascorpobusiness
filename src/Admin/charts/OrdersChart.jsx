import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { DatePicker } from 'antd';
import 'antd/dist/reset.css';
import { useAuth } from '../../MainOpeningpage/AuthContext';
import './saleschartcountry.css';

ChartJS.register(Title, Tooltip, Legend, ArcElement);
const fetchCurrentUser = () => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
   
      return parsedUser;
    } catch (error) {
      console.error('Error parsing user data from local storage:', error);
      return null;
    }
  }
  
  return null;
};
const currentUser = fetchCurrentUser();

const admin = currentUser;

const OrdersChart = () => {
  const [doughnutData, setDoughnutData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Add more colors as needed
    }],
  });
  const [doughnutOptions, setDoughnutOptions] = useState({});
  const [filterType, setFilterType] = useState('weekly');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrderCounts = async () => {
      try {
        let params = { email: currentUser.email, filterType };
  
        if (filterType === 'custom' && startDate && endDate) {
          params.startDate = startDate.toISOString();
          params.endDate = endDate.toISOString();
        }
  
        let apiUrl = admin
          ? `${process.env.REACT_APP_LOCAL}/api/admin/orders/orders-by-city`
          : `${process.env.REACT_APP_LOCAL}/api/admin/orders/orders-by-country`;
  
        const response = await axios.get(apiUrl, { params });
  
        const data = response.data || []; // Default to an empty array if data is undefined
  
        // Ensure data is in the correct format
        if (!Array.isArray(data)) {
          throw new Error('Unexpected data format');
        }
  
        // Process the data into the format required by the chart
        const formattedData = data.map(item => ({
          country: item.country,
          city: item.city,
          orderCount: item.total_orders, // Update key to match the new API response
        }));
  
        // Update chart data and options
        setDoughnutData({
          labels: formattedData.map(item =>admin ? item.city : item.country),
          datasets: [{
            data: formattedData.map(item => item.orderCount),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Add more colors as needed
          }],
        });
  
        setDoughnutOptions({
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                },
              },
            },
          },
        });
      } catch (error) {
        console.error('Error fetching order counts:', error);
        setDoughnutData({
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          }],
        });
      }
    };
  
    fetchOrderCounts();
  }, [filterType, startDate, endDate, currentUser]); // No need for a second useEffect

  return (
    <div>  
      
      
      <div className='orders_country_chart'>
      <h3>Order Sales by {admin ? 'City' : 'Country'}</h3>
        {/* Filter options within the chart section */}
        <div>
          <button onClick={() => setFilterType('weekly')}>Weekly</button>
          <button onClick={() => setFilterType('monthly')}>Monthly</button>
          <button onClick={() => {
            setFilterType('custom');
          }}>Custom Range</button>
        </div>

        {filterType === 'custom' && (
          <div>
            <DatePicker
              onChange={(date) => setStartDate(date ? date : null)}
              placeholder="Start Date"
            />
            <DatePicker
              onChange={(date) => setEndDate(date ? date : null)}
              placeholder="End Date"
            />
          </div>
        )}

        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
};

export default OrdersChart;
