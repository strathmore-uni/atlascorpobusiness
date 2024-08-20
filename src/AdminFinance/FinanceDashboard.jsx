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
  const fetchOrders = async () => {
    try {
      const ordersResponse = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/orders`, {
        params: { email: currentUser.email }
      });
      setOrders(ordersResponse.data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    }
  };

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
  const fetchOrdersList = async () => {
    try {
      const ordersListResponse = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/orders`, {
        params: { email: currentUser.email }
      });
      setordersList(ordersListResponse.data);
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
      fetchOrders();
      fetchSales();
      fetchMonthlySales();
      fetchOrdersList();
    }
  }, [currentUser.email]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!exchangeRates || !orders || !sales || !monthlySales) {
    return <div className="loading">Loading...</div>;
  }

  // Prepare data for the Orders by Month graph
  const ordersByMonth = orders.reduce((acc, order) => {
    const orderMonth = new Date(order.created_at).toLocaleString('default', { month: 'short' });
    acc[orderMonth] = (acc[orderMonth] || 0) + 1;
    return acc;
  }, {});

  const ordersBarData = {
    labels: Object.keys(ordersByMonth),
    datasets: [
      {
        label: 'Orders by Month',
        data: Object.values(ordersByMonth),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);

  const currentMonthSales = monthlySales.find(sale => sale.month === currentMonth)?.total_sales || 0;
  const previousMonthSales = monthlySales.find(sale => sale.month === previousMonth)?.total_sales || 0;

  // Calculate growth percentage
  const growth = previousMonthSales > 0 ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100 : 0;

  // Determine the color and icon for growth
  const growthColor = growth >= 0 ? 'green' : 'red';
  const growthIcon = growth >= 0 ? <FaArrowUp /> : <FaArrowDown />;

  // Prepare data for the Sales by Month graph
  const salesByMonth = sales.reduce((acc, sale) => {
    const saleMonth = new Date(`${sale.month}-01`).toLocaleString('default', { month: 'short', year: 'numeric' });
    acc[saleMonth] = (acc[saleMonth] || 0) + parseFloat(sale.total_sales);
    return acc;
  }, {});

  const salesBarData = {
    labels: Object.keys(salesByMonth),
    datasets: [
      {
        label: 'Sales by Month',
        data: Object.values(salesByMonth),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the Line graph
  const lineData = {
    labels: ['Previous Month', 'Current Month'],
    datasets: [
      {
        label: 'Sales',
        data: [previousMonthSales, currentMonthSales],
        fill: false,
        borderColor: '#FF5733',
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
      point: {
        radius: 5,
      },
    },
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
      <div className='chart_order_month'>
<h1>Orders by Month</h1>
      <Bar data={ordersBarData} options={{ scales: { y: { beginAtZero: true } } }} />

</div>
<div className='chart_sales_month'>
      <h1>Sales by Month</h1>
      <Bar data={salesBarData} options={{ scales: { y: { beginAtZero: true } } }} />
</div>
    </div>

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
    <div className="orders-summary-list">
            <h3>Recent Orders </h3>
            <div className="recent-orders-list">
              <ul>
                {ordersList.map(order => (
                  <Link to={`/finaceordertails/${order.id}`} className="order-link" key={order.id}>
                    <li>
                      Order Number: {order.ordernumber} Email: {order.email}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
      </div>
  
  <WeeklySalesChart />
  <MonthlySalesLineChart />
    </div>
    <FinanceCtegory />
      </div>
    
  );
};

export default FinanceDashboard;
