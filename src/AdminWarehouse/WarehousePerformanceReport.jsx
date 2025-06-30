import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiArrowLeft, FiDownload, FiCheckCircle, FiClock } from 'react-icons/fi';
import { Bar, Doughnut } from 'react-chartjs-2';
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

const WarehousePerformanceReport = () => {
  const [performanceData, setPerformanceData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/warehouse-performance`);
      setPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching warehouse performance data:', error);
      toast.error('Failed to fetch warehouse performance data');
      // Fallback data
      setPerformanceData({
        fulfillmentRate: 97.2,
        avgFulfillmentTime: 2.3,
        delayedOrders: 5,
        totalOrders: 320
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Fulfillment Rate', `${performanceData.fulfillmentRate || 0}%`],
      ['Average Fulfillment Time', `${performanceData.avgFulfillmentTime || 0} days`],
      ['Delayed Orders', performanceData.delayedOrders || 0],
      ['Total Orders', performanceData.totalOrders || 0]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `warehouse-performance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Warehouse performance report exported successfully');
  };

  // Chart data for fulfillment rate
  const fulfillmentData = {
    labels: ['Fulfilled', 'Delayed'],
    datasets: [
      {
        data: [
          performanceData.fulfillmentRate || 0,
          100 - (performanceData.fulfillmentRate || 0)
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 ml-64">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/warehouse/bireports" className="mr-4 p-2 rounded-xl bg-white shadow hover:bg-yellow-50 transition-colors">
              <FiArrowLeft className="w-5 h-5 text-yellow-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiTrendingUp className="w-8 h-8 text-yellow-600 mr-2" /> Warehouse Performance
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

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            <span className="ml-2 text-gray-600">Loading warehouse data...</span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Fulfillment Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {performanceData.fulfillmentRate || 0}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiClock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Fulfillment Time</p>
                <p className="text-2xl font-bold text-blue-600">
                  {performanceData.avgFulfillmentTime || 0} days
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiClock className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Delayed Orders</p>
                <p className="text-2xl font-bold text-red-600">
                  {performanceData.delayedOrders || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceData.totalOrders || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Fulfillment Rate</h2>
            <div className="h-64">
              <Doughnut data={fulfillmentData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.label}: ${context.parsed}%`;
                      },
                    },
                  },
                },
              }} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">On-Time Delivery</span>
                <span className="text-lg font-bold text-green-600">
                  {performanceData.fulfillmentRate || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Average Processing Time</span>
                <span className="text-lg font-bold text-blue-600">
                  {performanceData.avgFulfillmentTime || 0} days
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Delayed Orders</span>
                <span className="text-lg font-bold text-red-600">
                  {performanceData.delayedOrders || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Success Rate</h3>
              <p className="text-3xl font-bold text-green-600">
                {performanceData.fulfillmentRate || 0}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Orders fulfilled on time
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Efficiency Score</h3>
              <p className="text-3xl font-bold text-blue-600">
                {performanceData.avgFulfillmentTime ? (5 - performanceData.avgFulfillmentTime) * 20 : 0}%
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Based on processing time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehousePerformanceReport; 