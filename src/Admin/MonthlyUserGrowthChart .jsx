import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { useAuth } from '../MainOpeningpage/AuthContext';
import 'chart.js/auto';

const MonthlyUserGrowthChart = () => {
  const [monthlyUserGrowth, setMonthlyUserGrowth] = useState([]);
  const { currentUser } = useAuth(); // Use the currentUser context for authentication

  useEffect(() => {
    const fetchMonthlyUserGrowth = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/monthlyusergrowth`, {
          params: { email: currentUser.email },
          
        });
        
        setMonthlyUserGrowth(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized access. Please log in again.');
        } else {
          console.error('Error fetching monthly user growth data:', error);
        }
      }
    };

    fetchMonthlyUserGrowth();
  }, [currentUser]);

  const data = {
    labels: monthlyUserGrowth.map(item => item.month),
    datasets: [
      {
        label: 'Monthly User Growth',
        data: monthlyUserGrowth.map(item => item.userCount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default MonthlyUserGrowthChart;
