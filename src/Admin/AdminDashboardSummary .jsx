import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../MainOpeningpage/AuthContext';
import './admincategory.css';
import './notificationspage.css';
import './admindashboard.css'
import '../Admin/charts/saleschartcountry.css'
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminCategory from './AdminCategory';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import MonthlyUserGrowthChart from './MonthlyUserGrowthChart ';
import { Doughnut } from 'react-chartjs-2';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import SalesByCountryChart from './charts/SalesByCountryChart';
import MonthlySalesTable from './charts/MonthlySalesTable';
import CompanyComparisonChart from './charts/CompanyComparisonChart';
import CountryWithMostLogins from './charts/CountryWithMostLogins';
import OrdersChart from './charts/OrdersChart';
import LoggedInUsers from './charts/LoggedInUsers';
import UserLoginsChart from './charts/UserLoginsChart';
import { FaUsers } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { FaCartArrowDown } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import OrderStatsComparison from '../AdminFinance/OrderStatsComparison';
import MonthlySalesLineChart from '../AdminFinance/MonthlySalesLineChart';
import OrderTransitCount from '../AdminFinance/OrderTransitCount';
import SalesChart from './charts/SalesChart';
import CompanySalesComparison from './charts/CompanySalesComparison ';
import ProfileTab from './ProfileTab';


ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
const AdminDashboardSummary = () => {
  const [summary, setSummary] = useState({
    orders: 0,
    products: 0,
    users: 0,
    users: 0,
    recentOrders: [],
    pendingOrders: [],
    groupedOrders: {},
    mostOrderedProducts: [],
    unreadNotificationsCount: 0,
    recentUsers: [],
    companyComparison: [],
  });
  const [loggedInUsersCount, setLoggedInUsersCount] = useState(0);
  const [monthlyUserGrowth, setMonthlyUserGrowth] = useState([]);
  const [expandedCountries, setExpandedCountries] = useState([]);
  const [orderCountsByCountry, setOrderCountsByCountry] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [
          ordersCount,
          productsCount,
          usersCount,
          loggedInUsersRes,
       
          groupedOrdersResponse,
          mostOrderedProductsResponse,
          notificationsCountResponse,
          recentUsersResponse,
          monthlyUserGrowthResponse,
          companyComparisonResponse, 
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/count`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/products/count`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/users/count`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/logins/count`),
        
         
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/groupedByCountry`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/mostOrderedProducts`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/notifications/count`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/newregisteredusers`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/monthlyusergrowth`, { params: { email: currentUser.email } }),
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/company-orders-count`, { params: { email: currentUser.email } }), // Fetch company comparison data
        ]);

        const sortByDateDescending = (a, b) => new Date(b.created_at) - new Date(a.created_at);

        setSummary({
          orders: ordersCount.data.count,
          products: productsCount.data.count,
          users: usersCount.data.count,

          
          groupedOrders: groupedOrdersResponse.data,
          mostOrderedProducts: mostOrderedProductsResponse.data,
          unreadNotificationsCount: notificationsCountResponse.data.count,
          recentUsers: recentUsersResponse.data,
          companyComparison: companyComparisonResponse.data,
        });
        setLoggedInUsersCount(loggedInUsersRes.data.count);
        // Set monthly user growth data
        setMonthlyUserGrowth(monthlyUserGrowthResponse.data);

      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
  }, [currentUser]);

  const handleExpandAll = (country) => {
    setExpandedCountries((prevExpandedCountries) => {
      if (prevExpandedCountries.includes(country)) {
        return prevExpandedCountries.filter((item) => item !== country);
      } else {
        return [...prevExpandedCountries, country];
      }
    });
  };

  const barData = {
    labels: ['Orders', 'Products', 'Users'],
    datasets: [
      {
        label: 'Count',
        data: [summary.orders, summary.products, summary.users],
        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineData = {
    labels: summary.mostOrderedProducts.map(product => product.partnumber),
    datasets: [
      {
        label: 'Total Quantity Ordered',
        data: summary.mostOrderedProducts.map(product => product.total_quantity),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
    ],
  };

  const lineOptions = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  const calculateUserGrowthPercentage = () => {
    if (monthlyUserGrowth.length < 2) return null; // Not enough data to compare

    const lastMonth = monthlyUserGrowth[monthlyUserGrowth.length - 1];
    const previousMonth = monthlyUserGrowth[monthlyUserGrowth.length - 2];

    const percentageChange = ((lastMonth.userCount - previousMonth.userCount) / previousMonth.userCount) * 100;

    return percentageChange;
  };
  const userGrowthPercentage = calculateUserGrowthPercentage();
  useEffect(() => {
    const fetchOrderCountsByCountry = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/country-counts`, {
          params: {
            email: currentUser.email,
          },
        });
  
        setOrderCountsByCountry(response.data);
      } catch (error) {
        console.error('Error fetching order counts by country:', error);
      }
    };
  
    fetchOrderCountsByCountry();
  }, [currentUser]);
  

  const doughnutData = {
    labels: orderCountsByCountry.map(order => order.country),
    datasets: [
      {
        data: orderCountsByCountry.map(order => order.orderCount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
            const value = tooltipItem.raw;
            const percentage = ((value / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(2);
          return `${percentage}%`;
        },
        color: '#fff',
        
        align: 'center',
      },
    },
  };
  const [monthlyOrderGrowth, setMonthlyOrderGrowth] = useState([]);

  const calculateOrderGrowthPercentage = () => {
    if (monthlyOrderGrowth.length < 2) return null; // Not enough data to compare
  
    const lastMonth = monthlyOrderGrowth[monthlyOrderGrowth.length - 1];
    const previousMonth = monthlyOrderGrowth[monthlyOrderGrowth.length - 2];
  
    const percentageChange = ((lastMonth.orderCount - previousMonth.orderCount) / previousMonth.orderCount) * 100;
  
    return percentageChange;
  };

  const orderGrowthPercentage = calculateOrderGrowthPercentage();
  
  const currentDate = new Date().toLocaleDateString(); // Customize format if needed
  const [sales, setSales] = useState([]);
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

  useEffect(() => {
    if (currentUser.email) {
      //fetchOrders();
      fetchSales();
   
    }
  }, [currentUser.email]);


  // Calculate sales by month, ensuring sales is an array
  const salesByMonth = sales.reduce((acc, sale) => {
    const saleMonth = new Date(`${sale.month}-01`).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });
    acc[saleMonth] = (acc[saleMonth] || 0) + parseFloat(sale.total_sales);
    return acc;
  }, {});
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
    console.error('No user data found in local storage.');
    return null;
  };
  const mycurrentUser = fetchCurrentUser();

  return (
    <div>
      <div className="maincontainer_admin">
      <ProfileTab />
        <h2>Dashboard</h2>
        <div className="quick-buttons">
      <Link to="/ordereditems/orders" className="quick-button">Orders</Link>
      <Link to="/registeredusers" className="quick-button">Users</Link>
      {mycurrentUser && mycurrentUser.isAdmin &&  (
        <Link to="/admin/create-admin" className="quick-button">Create Admin</Link>
      )}
      {mycurrentUser && mycurrentUser.isAdmin && (
 <Link to="/admin/settings" className="quick-button">Settings</Link>
      )}
     
     <div className='notification_date' >

     <div className="notification-bell-admin">
        <Link to="/notifications">
          <IoMdNotifications />
          {summary.unreadNotificationsCount > 0 && (
            <span className="notification-count-admin">{summary.unreadNotificationsCount}</span>
          )}
        </Link>
      </div>
      <div className="current-date">
        <p>{currentDate}</p>
      </div>
     </div>
     
    </div>

        <div className="admin-dashboard-summary-counts">
        <div className="summary-item-counts">
        
        <div className='admin_icons'>
          <FiShoppingBag />
        </div>
  <h3>Total Orders</h3>
  <CountUp end={summary.orders} duration={2} />

  {orderGrowthPercentage !== null && (
    <div
      className={`percentage-change ${
        orderGrowthPercentage > 0 ? 'increase' : 'decrease'
      }`}
    >
      {orderGrowthPercentage > 0 ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon-up"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon-down"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      )}
      <span>{Math.abs(orderGrowthPercentage.toFixed(2))}%</span>
    </div>
  )}
</div>

  <div className="summary-item-counts">
    <div className='admin_icons'>
    <FaCartArrowDown />
    </div>
 
    <h3>Total Products</h3>
    <CountUp end={summary.products} duration={2} />
  </div>
  <div className="summary-item-counts">
    <div className='admin_icons'>
       <FaUsers /> 
    </div>

    <h3>Total Users</h3>
    <CountUp end={summary.users} duration={2} />
    {userGrowthPercentage !== null && (
      <div
        className={`growth-indicator ${
          userGrowthPercentage >= 0 ? "positive" : "negative"
        }`}
      >
        {userGrowthPercentage >= 0 ? <FaArrowUp /> : <FaArrowDown />}
        <span>{userGrowthPercentage.toFixed(2)}%</span>
      </div>
    )}
  
  </div>
  <div className="summary-item-counts">
  <div className='admin_icons'>
       <FaUsers /> 
    </div>
        <h3>Logged-in Users</h3>
        <CountUp end={loggedInUsersCount} duration={2} />
    
    
      </div>

    
      

</div>


        <div className="admin-dashboard-summary">
          <div className="summary-item-chart">
            <h3>Orders, Products, Users</h3>
            <Bar data={barData} options={barOptions} />
          </div>

          <div className="summary-item-chart">
            <h3>Most Ordered Products</h3>
            <Line data={lineData} options={lineOptions} />
          </div>




        </div>


       

       
<div className='recentusers_container'>
   <div className="recent-users">
          <h3>New Users</h3>
          <ul>
            {summary.recentUsers.map(user => (
              <li key={user.email}>
                <div className="user-profile-pic">
                  {/* User profile picture or initials */}
                </div>
                <div className="user-info">
                  <span>{user.name}</span>
                  <span>{user.email}</span>
                  <span>{user.registration_date}</span>
                </div>
              </li>
            ))}
          </ul>

        </div>
        <div className="monthly-users-chart">
    <h3>Monthly User Growth</h3>
    {userGrowthPercentage !== null && (
    <div
      style={{
        color: userGrowthPercentage >= 0 ? 'green' : 'red',
        display: 'flex',
        alignItems: 'center',
        marginTop: '5px'
      }}
    >
      {userGrowthPercentage >= 0 ? <FaArrowUp /> : <FaArrowDown />}
      <span style={{ marginLeft: '5px' }}>
        {userGrowthPercentage.toFixed(2)}%
      </span>
    </div>
  )}
    <MonthlyUserGrowthChart adminEmail={currentUser.email} />
</div>
</div>
     
        
   
<div className='order_counts_country'>
    
      <div  className='orders_country_chart' >
       <OrdersChart />
      </div>
       <div className="total-sales-chart">

<SalesByCountryChart />

</div>
    </div>
    <div className='order_transit_stats' >
  
  <OrderStatsComparison />
  <OrderTransitCount />
  </div>
 
 {/** 
<div className="admin-dashboard-summary-orders">
          <div className="summary-item-recent">
            <h3>Recent Orders (Last 7 Days)</h3>
            <div className="recent-orders-list">
              <ul>
                {summary.recentOrders.map(order => (
                  <Link to={`/orderdetails/${order.id}`} className="order-link" key={order.id}>
                    <li>
                      Order Number: {order.ordernumber} Email: {order.email}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>

          <div className="summary-item-pending">
            <h3>Pending Orders</h3>
            <div className="pending-orders-list">
              <ul>
                {summary.pendingOrders.map(order => (
                  <Link to={`/orderdetails/${order.id}`} className="order-link" key={order.id}>
                    <li>
                      Order Number: {order.ordernumber} Email: {order.email}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
       */} 

        <div className="company-comparison">
        <h3>Company Comparison</h3>
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Orders</th>
              <th>Sales</th>
            </tr>
          </thead>
          <tbody>
            {summary.companyComparison.map((company, index) => (
              <tr key={index}>
                <td>{company.company_name}</td>
                <td>{company.order_count}</td>
                <td>${company.total_sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='companycomparisonchart' >
      <CompanyComparisonChart adminEmail={currentUser.email} />

      </div>
    
      </div>
      <div>
  <CompanySalesComparison />
</div>
      <div className='country_comparison_container' >

</div>

<div  className='monthly_order_comparison' >

<div className='monthlysales_container'>
  <MonthlySalesLineChart />
</div>

<SalesChart />
</div>
<div className='admin-chart_sales_month'>
      <h1>Sales by Month</h1>
      <Bar data={salesBarData} options={{ scales: { y: { beginAtZero: true } } }} />
</div>

<div className='logins_container' >
<div>
        <CountryWithMostLogins />
      </div>

<div className='userloginschart'>
  <UserLoginsChart />
</div>


</div>
      


      </div>
     
      <AdminCategory />
    </div>
  );
};

export default AdminDashboardSummary;
