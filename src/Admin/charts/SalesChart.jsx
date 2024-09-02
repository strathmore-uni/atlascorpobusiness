import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

const SalesChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/daily-sales`);
        const { thisMonth, lastMonth } = response.data;

        if (!Array.isArray(thisMonth) || !Array.isArray(lastMonth)) {
          console.error('Sales data is not in the expected format.');
          return;
        }

        // Create labels for all days of the current month
        const labels = Array.from(
          { length: moment().endOf('month').date() },
          (_, i) => moment().startOf('month').add(i, 'days').format('YYYY-MM-DD')
        );

        // Create arrays for this month's and last month's data
        const thisMonthData = labels.map((date) => {
          const found = thisMonth.find((d) => moment(d.date).format('YYYY-MM-DD') === date);
          return found ? parseFloat(found.daily_sales) : 0;
        });

        const lastMonthData = labels.map((date) => {
          const lastMonthDate = moment(date).subtract(1, 'month').format('YYYY-MM-DD');
          const found = lastMonth.find((d) => moment(d.date).format('YYYY-MM-DD') === lastMonthDate);
          return found ? parseFloat(found.daily_sales) : 0;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'This Month',
              data: thisMonthData,
              borderColor: 'rgba(75, 192, 192, 0.8)',
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointBorderColor: 'rgba(255, 255, 255, 0.8)',
              pointHoverRadius: 6,
              fill: 'origin', // Fills the area beneath this line down to the x-axis
              backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light cyan fill
              tension: 0.4,
            },
            {
              label: 'Last Month',
              data: lastMonthData,
              borderColor: 'rgba(153, 102, 255, 0.8)',
              pointBackgroundColor: 'rgba(153, 102, 255, 1)',
              pointBorderColor: 'rgba(255, 255, 255, 0.8)',
              pointHoverRadius: 6,
              fill: '-1', // Fills the area between this line and the dataset above (creating a net effect)
              backgroundColor: 'rgba(153, 102, 255, 0.2)', // Light purple fill
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // Chart options for a dark theme
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff', // White color for text in legend
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for tooltips
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // Light grid lines
        },
      },
    },
  };

  return (
    <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: '#ffffff', textAlign: 'center', marginBottom: '20px' }}>
        Sales Comparison: This Month vs. Last Month
      </h2>
      {loading ? (
        <p style={{ color: '#ffffff', textAlign: 'center' }}>Loading chart data...</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default SalesChart;
