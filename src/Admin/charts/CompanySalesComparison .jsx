import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { useAuth } from '../../MainOpeningpage/AuthContext';
import './CompanySalesComparisonStyles.css'; // Import the updated CSS file

const CompanySalesComparison = ({ adminEmail }) => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();
  const country = localStorage.getItem('country');

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/company-sales-comparison`, {
          params: { email: currentUser.email },
        });
        setSalesData(response.data);
      } catch (error) {
        console.error('Error fetching company sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [adminEmail]);

  // Prepare data for the bar chart
  const chartData = {
    labels: salesData.map((sale) => sale.company_name),
    datasets: [
      {
        label: 'Total Sales',
        data: salesData.map((sale) => parseFloat(sale.total_sales)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',  // Red
          'rgba(54, 162, 235, 0.7)',  // Blue
          'rgba(255, 206, 86, 0.7)',  // Yellow
          'rgba(75, 192, 192, 0.7)',  // Green
          'rgba(153, 102, 255, 0.7)', // Purple
          'rgba(255, 159, 64, 0.7)',  // Orange
          'rgba(199, 199, 199, 0.7)', // Grey
          'rgba(255, 105, 180, 0.7)', // Pink
          'rgba(144, 238, 144, 0.7)', // Light Green
          'rgba(30, 144, 255, 0.7)',  // Dodger Blue
          'rgba(221, 160, 221, 0.7)', // Plum
          'rgba(245, 222, 179, 0.7)'  // Wheat
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', 
          'rgba(54, 162, 235, 1)', 
          'rgba(255, 206, 86, 1)', 
          'rgba(75, 192, 192, 1)', 
          'rgba(153, 102, 255, 1)', 
          'rgba(255, 159, 64, 1)', 
          'rgba(199, 199, 199, 1)', 
          'rgba(255, 105, 180, 1)', 
          'rgba(144, 238, 144, 1)', 
          'rgba(30, 144, 255, 1)', 
          'rgba(221, 160, 221, 1)', 
          'rgba(245, 222, 179, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Sales (in currency)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Company Name',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="unique-chart-container">
      <h2 className="unique-chart-title">Company Sales Comparison in {country}</h2>
      {salesData.length > 0 ? (
        <div className="unique-chart-graph">
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <p className="unique-chart-description">No sales data available for the selected country.</p>
      )}
    </div>
  );
};

export default CompanySalesComparison;
