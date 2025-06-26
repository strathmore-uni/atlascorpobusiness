import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../MainOpeningpage/AuthContext';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminCategory from './AdminCategory';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import MonthlyUserGrowthChart from './MonthlyUserGrowthChart ';
import { Doughnut } from 'react-chartjs-2';
import { FaArrowUp, FaArrowDown, FaUsers } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';
import { FaCartArrowDown } from 'react-icons/fa6';
import { IoMdNotifications } from 'react-icons/io';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import SalesByCountryChart from './charts/SalesByCountryChart';
import MonthlySalesTable from './charts/MonthlySalesTable';
import CompanyComparisonChart from './charts/CompanyComparisonChart';
import CountryWithMostLogins from './charts/CountryWithMostLogins';
import OrdersChart from './charts/OrdersChart';
import LoggedInUsers from './charts/LoggedInUsers';
import UserLoginsChart from './charts/UserLoginsChart';
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
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 md:ml-32 lg:ml-48">
      <div className="max-w-7xl mx-auto">
        <ProfileTab />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Admin Dashboard</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <Link to="/ordereditems/orders" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Orders</Link>
            <Link to="/registeredusers" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Users</Link>
            {mycurrentUser && mycurrentUser.isAdmin && (
              <Link to="/admin/create-admin" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Create Admin</Link>
            )}
            {mycurrentUser && mycurrentUser.isAdmin && (
              <Link to="/admin/settings" className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition">Settings</Link>
            )}
            <div className="flex items-center gap-2 bg-white rounded shadow px-3 py-2">
              <Link to="/notifications" className="relative">
                <IoMdNotifications className="text-2xl text-yellow-500" />
                {summary.unreadNotificationsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{summary.unreadNotificationsCount}</span>
                )}
              </Link>
              <span className="text-gray-500 text-sm">{currentDate}</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Orders */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-2"><FiShoppingBag className="text-2xl text-blue-600" /></div>
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <CountUp end={summary.orders} duration={2} className="text-2xl font-bold text-gray-900" />
            {orderGrowthPercentage !== null && (
              <div className={`flex items-center mt-2 text-sm font-medium ${orderGrowthPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {orderGrowthPercentage > 0 ? (
                  <FaArrowUp className="mr-1" />
                ) : (
                  <FaArrowDown className="mr-1" />
                )}
                <span>{Math.abs(orderGrowthPercentage.toFixed(2))}%</span>
              </div>
            )}
          </div>
          {/* Products */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-2"><FaCartArrowDown className="text-2xl text-green-600" /></div>
            <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
            <CountUp end={summary.products} duration={2} className="text-2xl font-bold text-gray-900" />
          </div>
          {/* Users */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="bg-yellow-100 p-3 rounded-full mb-2"><FaUsers className="text-2xl text-yellow-600" /></div>
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <CountUp end={summary.users} duration={2} className="text-2xl font-bold text-gray-900" />
            {userGrowthPercentage !== null && (
              <div className={`flex items-center mt-2 text-sm font-medium ${userGrowthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {userGrowthPercentage >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                <span>{userGrowthPercentage.toFixed(2)}%</span>
              </div>
            )}
          </div>
          {/* Logged-in Users */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <div className="bg-indigo-100 p-3 rounded-full mb-2"><FaUsers className="text-2xl text-indigo-600" /></div>
            <h3 className="text-lg font-semibold text-gray-700">Logged-in Users</h3>
            <CountUp end={loggedInUsersCount} duration={2} className="text-2xl font-bold text-gray-900" />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Orders, Products, Users</h3>
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Most Ordered Products</h3>
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* New Users & Monthly Growth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">New Users</h3>
            <ul className="divide-y divide-gray-200">
              {summary.recentUsers.map(user => (
                <li key={user.email} className="flex items-center py-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-600 mr-4">
                    {user.name ? user.name[0] : user.email[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-gray-500 text-sm">{user.email}</div>
                    <div className="text-gray-400 text-xs">{user.registration_date}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly User Growth</h3>
            {userGrowthPercentage !== null && (
              <div className={`flex items-center mb-2 text-sm font-medium ${userGrowthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {userGrowthPercentage >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                <span>{userGrowthPercentage.toFixed(2)}%</span>
              </div>
            )}
            <MonthlyUserGrowthChart adminEmail={currentUser.email} />
          </div>
        </div>

        {/* Orders by Country & Sales by Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Orders by Country</h3>
            <OrdersChart />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Sales by Country</h3>
            <SalesByCountryChart />
          </div>
        </div>

        {/* Order Stats & Transit Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <OrderStatsComparison />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <OrderTransitCount />
          </div>
        </div>

        {/* Company Comparison */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Company Comparison</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.companyComparison.map((company, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">{company.company_name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{company.order_count}</td>
                    <td className="px-4 py-2 whitespace-nowrap">${company.total_sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6"><CompanyComparisonChart adminEmail={currentUser.email} /></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <CompanySalesComparison />
        </div>

        {/* Monthly Sales & Sales Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <MonthlySalesLineChart />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <SalesChart />
          </div>
        </div>

        {/* Sales by Month Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Sales by Month</h3>
          <Bar data={salesBarData} options={{ scales: { y: { beginAtZero: true } } }} />
        </div>

        {/* Logins by Country & User Logins Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <CountryWithMostLogins />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <UserLoginsChart />
          </div>
        </div>

        <AdminCategory />
      </div>
    </div>
  );
};

export default AdminDashboardSummary;
