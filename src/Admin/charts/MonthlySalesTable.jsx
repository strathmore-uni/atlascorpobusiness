import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const SalesComparisonChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('/api/admin/orders/sales-by-country-comparison', {
          params: {
            email: 'superadmin@gmail.com', // Replace with the actual admin email
          },
        });

        const data = response.data;

        const groupedByCountry = data.reduce((acc, { country, month, total_sales }) => {
          if (!acc[country]) {
            acc[country] = { months: [], sales: [] };
          }
          acc[country].months.push(month);
          acc[country].sales.push(total_sales);
          return acc;
        }, {});

        // Ensure that groupedByCountry has data before proceeding
        if (Object.keys(groupedByCountry).length > 0) {
          const firstCountry = Object.keys(groupedByCountry)[0];

          setChartData({
            labels: groupedByCountry[firstCountry]?.months || [],
            datasets: Object.keys(groupedByCountry).map((country) => ({
              label: `${country} Sales`,
              data: groupedByCountry[country]?.sales || [],
              fill: false,
              borderColor: getRandomColor(),
            })),
          });
        } else {
          // Handle case where no data is available
          setChartData(null);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            title: { text: 'Sales Comparison (Last 3 Months)', display: true },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      ) : (
        <p>No sales data available.</p>
      )}
    </div>
  );
};

export default SalesComparisonChart;
