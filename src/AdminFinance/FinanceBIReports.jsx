import React from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiTrendingUp, FiBarChart2, FiPieChart, FiUsers, FiPackage, FiActivity } from 'react-icons/fi';

const FinanceBIReports = () => {
  const reports = [
    {
      title: 'Financial Performance',
      description: 'Revenue trends, profit margins, and financial KPIs',
      icon: FiTrendingUp,
      color: 'bg-green-500',
      link: '/finance/bireports/performance',
      metrics: ['Revenue Growth', 'Profit Margins', 'Cash Flow']
    },
    {
      title: 'Sales Analytics',
      description: 'Detailed sales breakdown by product, region, and time',
      icon: FiBarChart2,
      color: 'bg-blue-500',
      link: '/finance/bireports/sales',
      metrics: ['Sales by Product', 'Regional Performance', 'Seasonal Trends']
    },
    {
      title: 'Customer Financial Insights',
      description: 'Customer profitability and payment behavior analysis',
      icon: FiUsers,
      color: 'bg-purple-500',
      link: '/finance/bireports/customers',
      metrics: ['Customer Profitability', 'Payment Patterns', 'Credit Risk']
    },
    {
      title: 'Cost Analysis',
      description: 'Cost breakdown and expense optimization insights',
      icon: FiPieChart,
      color: 'bg-red-500',
      link: '/finance/bireports/costs',
      metrics: ['Cost Breakdown', 'Expense Trends', 'Budget Variance']
    },
    {
      title: 'Inventory Financial Impact',
      description: 'Inventory valuation and financial implications',
      icon: FiPackage,
      color: 'bg-yellow-500',
      link: '/finance/bireports/inventory',
      metrics: ['Inventory Value', 'Carrying Costs', 'Stock Turnover']
    },
    {
      title: 'Financial Forecasting',
      description: 'Predictive analytics and financial projections',
      icon: FiActivity,
      color: 'bg-indigo-500',
      link: '/finance/bireports/forecasting',
      metrics: ['Revenue Forecast', 'Cash Flow Projection', 'Risk Assessment']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/finance/dashboard" className="mr-4 p-2 rounded-xl bg-white shadow hover:bg-green-50 transition-colors">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiDollarSign className="w-8 h-8 text-green-600 mr-3" />
              Finance Business Intelligence
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Comprehensive financial analytics and insights to drive business decisions. 
            Monitor performance, analyze trends, and optimize financial operations.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$2.4M</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiBarChart2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Profit Margin</p>
                <p className="text-2xl font-bold text-gray-900">24.5%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiPackage className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">$890K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <Link
              key={index}
              to={report.link}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-xl ${report.color} bg-opacity-10`}>
                    <report.icon className={`w-6 h-6 ${report.color.replace('bg-', 'text-')}`} />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">{report.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{report.description}</p>
                <div className="space-y-2">
                  {report.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      {metric}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center text-green-600 font-medium">
                  View Report
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
              <FiActivity className="w-4 h-4 mr-2" />
              Generate Monthly Report
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">
              <FiTrendingUp className="w-4 h-4 mr-2" />
              Export Financial Data
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors">
              <FiBarChart2 className="w-4 h-4 mr-2" />
              Schedule Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceBIReports; 