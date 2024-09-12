import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './financedashboard.css';
import { useAuth } from '../MainOpeningpage/AuthContext';
import { Bar, Line } from 'react-chartjs-2';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { Link } from 'react-router-dom';
import WeeklySalesChart from './WeeklySalesChart';
import FinanceCtegory from './FinanceCategory';
import MonthlySalesLineChart from './MonthlySalesLineChart';
import OrderStatsComparison from './OrderStatsComparison';
import OrderTransitCount from './OrderTransitCount';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement);

const FinanceDashboard = () => {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [orders, setOrders] = useState(null);
  const [sales, setSales] = useState(null);
  const [monthlySales, setMonthlySales] = useState(null); // State for monthly sales data
  const [error, setError] = useState(null);
  const [ordersList, setordersList] = useState(null);
  const { currentUser } = useAuth();

  // Fetch exchange rates
  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/exchange-rates`);
      setExchangeRates(response.data);
    } catch (err) {
      setError('Failed to fetch exchange rates');
      console.error(err);
    }
  };

  // Fetch orders
  
  // Fetch sales data
  const fetchSales = async () => {
    try {
      const salesResponse = await axios.get(`${process.env.REACT_APP_LOCAL}/api/finance-sales-by-month`, {
        params: { email: currentUser.email }
      });
      setSales(salesResponse.data);
    } catch (err) {
      setError('Failed to fetch sales data');
      console.error(err);
    }
  };

  // Fetch monthly sales data
  const fetchMonthlySales = async () => {
    try {
      const monthlySalesResponse = await axios.get(`${process.env.REACT_APP_LOCAL}/api/finance-sales-current-previous-month`, {
        params: { email: currentUser.email }
      });
      setMonthlySales(monthlySalesResponse.data);
    } catch (err) {
      setError('Failed to fetch monthly sales data');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (currentUser.email) {
      //fetchOrders();
      fetchSales();
      fetchMonthlySales();
      //fetchOrdersList();
    }
  }, [currentUser.email]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!exchangeRates || !sales || !monthlySales) {
    return <div className="loading">Loading...</div>;
  }

  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);

  const currentMonthSales = monthlySales.find(sale => sale.month === currentMonth)?.total_sales || 0;
  const previousMonthSales = monthlySales.find(sale => sale.month === previousMonth)?.total_sales || 0;

  // Calculate growth percentage
  const growth = previousMonthSales > 0 ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100 : 0;

  // Determine the color and icon for growth
  const growthColor = growth >= 0 ? 'green' : 'red';
  const growthIcon = growth >= 0 ? <FaArrowUp /> : <FaArrowDown />;

  const highestMonthSales = Math.max(...sales.map((sale) => sale.total_sales));
const highestMonth = sales.find(
  (sale) => parseFloat(sale.total_sales) === highestMonthSales
)?.month;
  // Prepare data for the Sales by Month graph
  const salesByMonth = sales.reduce((acc, sale) => {
    const saleMonth = new Date(`${sale.month}-01`).toLocaleString('default', { month: 'short', year: 'numeric' });
    acc[saleMonth] = (acc[saleMonth] || 0) + parseFloat(sale.total_sales);
    return acc;
  }, {});

  const lineData = {
    labels: ['Previous Month', 'Current Month', 'Highest Month'], // Add the highest month label
    datasets: [
      {
        label: 'Sales',
        data: [previousMonthSales, currentMonthSales, highestMonthSales],
        fill: false,
        borderColor: '#FF5733', // Color for the main sales line
        backgroundColor: '#FF5733',
        tension: 0.1,
        borderWidth: 3,
      },
      {
        label: 'Highest Sales Month',
        data: [null, null, highestMonthSales], // Show the highest sales month data
        fill: false,
        borderColor: '#00BFFF', // A different color for the highest month
        backgroundColor: '#00BFFF',
        borderDash: [5, 5], // Dashed line for clear distinction
        borderWidth: 2,
        pointStyle: 'star',
      },
    ],
  };
  
  // Updated line chart options for better display
  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales Amount ($)',
          font: { size: 14 },
          color: '#333',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          font: { size: 14 },
          color: '#333',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(2)}`, // Show sales in currency format
        },
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
      point: {
        radius: 6,
        hoverRadius: 8,
      },
    },
  };
  const salesBarData = {
    labels: Object.keys(salesByMonth),
    datasets: [
      {
        label: 'Sales by Month',
        data: Object.values(salesByMonth),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',   // Red
          'rgba(54, 162, 235, 0.6)',   // Blue
          'rgba(255, 206, 86, 0.6)',   // Yellow
          'rgba(75, 192, 192, 0.6)',   // Green
          'rgba(153, 102, 255, 0.6)',  // Purple
          'rgba(255, 159, 64, 0.6)',   // Orange
          'rgba(199, 199, 199, 0.6)',  // Grey
          'rgba(255, 105, 180, 0.6)',  // Pink
          'rgba(144, 238, 144, 0.6)',  // Light Green
          'rgba(30, 144, 255, 0.6)',   // Dodger Blue
          'rgba(221, 160, 221, 0.6)',  // Plum
          'rgba(245, 222, 179, 0.6)'   // Wheat
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
  return (
    <div>
<div className="finance-dashboard">
      <h1>Finance Dashboard</h1>
      <h1>Exchange Rates</h1>
      <div className="rate-container">
        <div className="rate-item">
          <img src="https://flagcdn.com/w20/tz.png" alt="Tanzania Flag" className="flag" />
          <span className="country">Tanzanian Shilling (TZS)</span>
          <span className="rate">{exchangeRates.TZS_USD.toFixed(2)}</span>
        </div>
        <div className="rate-item">
          <img src="https://flagcdn.com/w20/ug.png" alt="Uganda Flag" className="flag" />
          <span className="country">Ugandan Shilling (UGX)</span>
          <span className="rate">{exchangeRates.UGX_USD.toFixed(2)}</span>
        </div>
        <div className="rate-item">
          <img src="https://flagcdn.com/w20/ke.png" alt="Kenya Flag" className="flag" />
          <span className="country">Kenyan Shilling (KES)</span>
          <span className="rate">{exchangeRates.KES_USD.toFixed(2)}</span>
        </div>
      </div>


    <div className='chart_orders'>
    {/* New Section for Current Month Sales and Growth */}
      <div className='sales_order_container' >
           <div className="sales-summary">
      <h2>Sales Summary</h2>
      <div className="sales-detail">
        <div className="sales-item">
          <span className="label">Current Month Sales:</span>
          <span className="value">${currentMonthSales.toFixed(2)}</span>
        </div>
        <div className="sales-item">
          <span className="label">Previous Month Sales:</span>
          <span className="value">${previousMonthSales.toFixed(2)}</span>
        </div>
        <div className="sales-item">
          <span className="label">Growth:</span>
          <span className="value" style={{ color: growthColor }}>
            {growthIcon} {growth.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Line Graph */}
      <div className="line-graph">
        <h3>Sales Trend</h3>
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
   
      </div>  
<div className='chart_sales_month'>
      <h1>Sales by Month</h1>
      <Bar data={salesBarData} options={{ scales: { y: { beginAtZero: true } } }} />
</div>
    </div>

     
  <div className='chartsorder_container' >
  <WeeklySalesChart />
  <MonthlySalesLineChart />

  </div>

  <div className='order_transit_stats' > 
  <OrderStatsComparison />
  <OrderTransitCount/>
  </div>
  
    </div>
    <FinanceCtegory />
      </div>
    
  );
};

export default FinanceDashboard;
