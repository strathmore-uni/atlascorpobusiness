import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiArrowLeft, FiDownload } from 'react-icons/fi';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const RevenueReport = () => {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch revenue data from backend
  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/revenue-report`, {
        params: {
          from: dateRange.from,
          to: dateRange.to,
        }
      });
      
      if (response.data) {
        setRevenueData(response.data.monthlyRevenue || []);
        setCategoryData(response.data.categoryRevenue || []);
        setTableData(response.data.detailedRevenue || []);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      toast.error('Failed to fetch revenue data');
      // Use placeholder data if API fails
      setRevenueData([
        { month: 'Jan', revenue: 12000 },
        { month: 'Feb', revenue: 15000 },
        { month: 'Mar', revenue: 18000 },
        { month: 'Apr', revenue: 14000 },
        { month: 'May', revenue: 20000 },
      ]);
      setCategoryData([
        { category: 'Compressors', value: 40000 },
        { category: 'Parts', value: 20000 },
        { category: 'Services', value: 10000 },
      ]);
      setTableData([
        { date: '2024-05-01', product: 'Compressor X', amount: 5000 },
        { date: '2024-05-02', product: 'Part Y', amount: 2000 },
        { date: '2024-05-03', product: 'Service Z', amount: 1500 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [dateRange]);

  // Line chart configuration
  const lineChartData = {
    labels: revenueData.map(item => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map(item => item.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Revenue Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  // Pie chart configuration
  const pieChartData = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        data: categoryData.map(item => item.value),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Revenue by Category',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Export functionality
  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Product', 'Amount'],
      ...tableData.map(row => [row.date, row.product, `$${row.amount}`])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Revenue report exported successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 ml-64">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/admin/bireports" className="mr-4 p-2 rounded-xl bg-white shadow hover:bg-blue-50 transition-colors">
              <FiArrowLeft className="w-5 h-5 text-blue-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiBarChart2 className="w-8 h-8 text-blue-600 mr-2" /> Revenue Report
            </h1>
          </div>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row md:items-center md:space-x-6">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <label className="text-gray-700 font-medium">From:</label>
            <input 
              type="date" 
              className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={dateRange.from} 
              onChange={e => setDateRange({ ...dateRange, from: e.target.value })} 
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-gray-700 font-medium">To:</label>
            <input 
              type="date" 
              className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={dateRange.to} 
              onChange={e => setDateRange({ ...dateRange, to: e.target.value })} 
            />
          </div>
          {loading && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Loading...
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h2>
            <div className="h-64">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h2>
            <div className="h-64">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Average Monthly Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${revenueData.length > 0 ? (revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.length).toLocaleString() : 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Top Category</h3>
            <p className="text-2xl font-bold text-gray-900">
              {categoryData.length > 0 ? categoryData[0].category : 'N/A'}
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detailed Revenue Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${row.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReport; 