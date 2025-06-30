import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiArrowLeft, FiDownload } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FinancePerformanceReport = () => {
  const [performanceData, setPerformanceData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/finance-performance`);
      setPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching finance performance data:', error);
      toast.error('Failed to fetch finance performance data');
      // Fallback data
      setPerformanceData({
        revenue: 2400000,
        profit: 588000,
        cashFlow: 1200000
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Revenue', `$${performanceData.revenue?.toLocaleString() || 0}`],
      ['Profit', `$${performanceData.profit?.toLocaleString() || 0}`],
      ['Cash Flow', `$${performanceData.cashFlow?.toLocaleString() || 0}`]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-performance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Finance performance report exported successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 ml-64">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/finance/bireports" className="mr-4 p-2 rounded-xl bg-white shadow hover:bg-green-50 transition-colors">
              <FiArrowLeft className="w-5 h-5 text-green-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiTrendingUp className="w-8 h-8 text-green-600 mr-2" /> Financial Performance
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading financial data...</span>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">
              ${performanceData.revenue?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Profit</h3>
            <p className="text-2xl font-bold text-green-600">
              ${performanceData.profit?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Cash Flow (30 days)</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${performanceData.cashFlow?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Profit Margin</h3>
              <p className="text-3xl font-bold text-green-600">
                {performanceData.revenue && performanceData.profit 
                  ? ((performanceData.profit / performanceData.revenue) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Cash Flow Ratio</h3>
              <p className="text-3xl font-bold text-blue-600">
                {performanceData.revenue && performanceData.cashFlow
                  ? ((performanceData.cashFlow / performanceData.revenue) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePerformanceReport; 