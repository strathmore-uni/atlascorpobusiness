import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiArrowLeft, FiDownload } from 'react-icons/fi';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CustomerReport = () => {
  const [segment, setSegment] = useState('All');
  const [demographicsData, setDemographicsData] = useState([]);
  const [purchasingPatterns, setPurchasingPatterns] = useState([]);
  const [segmentationData, setSegmentationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [segments] = useState(['All', 'High Value', 'New', 'At Risk']);

  // Fetch customer data from backend
  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/customer-report`, {
        params: {
          segment: segment === 'All' ? undefined : segment,
        }
      });
      
      if (response.data) {
        setDemographicsData(response.data.demographics || []);
        setPurchasingPatterns(response.data.purchasingPatterns || []);
        setSegmentationData(response.data.segmentation || []);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast.error('Failed to fetch customer data');
      // Use placeholder data if API fails
      setDemographicsData([
        { group: '18-25', value: 30 },
        { group: '26-35', value: 40 },
        { group: '36-50', value: 20 },
        { group: '50+', value: 10 },
      ]);
      setPurchasingPatterns([
        { month: 'Jan', orders: 50 },
        { month: 'Feb', orders: 60 },
        { month: 'Mar', orders: 80 },
      ]);
      setSegmentationData([
        { segment: 'High Value', count: 20 },
        { segment: 'New', count: 50 },
        { segment: 'At Risk', count: 10 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [segment]);

  // Pie chart configuration for demographics
  const pieChartData = {
    labels: demographicsData.map(item => item.group),
    datasets: [
      {
        data: demographicsData.map(item => item.value),
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
        text: 'Customer Demographics',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Bar chart configuration for purchasing patterns
  const barChartData = {
    labels: purchasingPatterns.map(item => item.month),
    datasets: [
      {
        label: 'Orders',
        data: purchasingPatterns.map(item => item.orders),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Purchasing Patterns',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Orders',
        },
      },
    },
  };

  // Export functionality
  const exportToCSV = () => {
    const csvContent = [
      ['Segment', 'Count', 'Percentage'],
      ...segmentationData.map(item => {
        const total = segmentationData.reduce((sum, seg) => sum + seg.count, 0);
        const percentage = ((item.count / total) * 100).toFixed(1);
        return [item.segment, item.count, `${percentage}%`];
      })
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Customer report exported successfully');
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
              <FiUsers className="w-8 h-8 text-indigo-600 mr-2" /> Customer Report
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

        {/* Segment Filter */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-medium">Segment:</label>
            <select 
              className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              value={segment} 
              onChange={e => setSegment(e.target.value)}
            >
              {segments.map(seg => (
                <option key={seg} value={seg}>{seg}</option>
              ))}
            </select>
          </div>
          {loading && (
            <div className="flex items-center text-indigo-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
              Loading...
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Customers</h3>
            <p className="text-2xl font-bold text-gray-900">
              {segmentationData.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">High Value</h3>
            <p className="text-2xl font-bold text-green-600">
              {segmentationData.find(item => item.segment === 'High Value')?.count || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">New Customers</h3>
            <p className="text-2xl font-bold text-blue-600">
              {segmentationData.find(item => item.segment === 'New')?.count || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">At Risk</h3>
            <p className="text-2xl font-bold text-red-600">
              {segmentationData.find(item => item.segment === 'At Risk')?.count || 0}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Demographics</h2>
            <div className="h-64">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Purchasing Patterns</h2>
            <div className="h-64">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Segmentation Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Segmentation</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {segmentationData.map((row, idx) => {
                  const total = segmentationData.reduce((sum, item) => sum + item.count, 0);
                  const percentage = ((row.count / total) * 100).toFixed(1);
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.segment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{percentage}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          row.segment === 'High Value' ? 'bg-green-100 text-green-800' :
                          row.segment === 'New' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {row.segment === 'High Value' ? 'Premium' :
                           row.segment === 'New' ? 'Active' : 'At Risk'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReport; 