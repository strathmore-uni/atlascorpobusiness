import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Default styles
import './datepicker.css'; // Custom styles

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserLoginsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchLoginData = async (date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/logins/hourly`, {
        params: { date: formattedDate },
      });
      const data = response.data;

      const labels = data.map((item) => `${item.hour}:00`);
      const counts = data.map((item) => item.count);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'User Logins by Hour',
            data: counts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching login data:', error);
    }
  };

  useEffect(() => {
    fetchLoginData(selectedDate);
  }, [selectedDate]);

  return (
    <div>
      <h2>User Logins by Hour</h2>
      <div className="date-picker-container">
        <label className="date-picker-label">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="custom-datepicker-input"
        />
      </div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Number of User Logins by Hour',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Hour of the Day',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Number of Logins',
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default UserLoginsChart;
