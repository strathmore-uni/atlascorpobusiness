import React from 'react';
import { Link } from 'react-router-dom';
import { FiBox, FiBarChart2, FiTrendingUp, FiPieChart, FiActivity } from 'react-icons/fi';

const ProductBIReports = () => {
  const reports = [
    {
      title: 'Product Performance',
      description: 'Bestsellers, slow movers, and product revenue',
      icon: FiTrendingUp,
      color: 'bg-green-500',
      link: '/admin/bireports/product-performance',
      metrics: ['Bestsellers', 'Slow Movers', 'Revenue']
    },
    {
      title: 'Stock Analytics',
      description: 'Stock levels, out-of-stock rates, and reorder needs',
      icon: FiBox,
      color: 'bg-yellow-500',
      link: '/admin/bireports/product-stock',
      metrics: ['Stock Levels', 'Out-of-Stock', 'Reorder Needs']
    },
    {
      title: 'Product Trends',
      description: 'Sales trends and product lifecycle analytics',
      icon: FiBarChart2,
      color: 'bg-blue-500',
      link: '/admin/bireports/product-trends',
      metrics: ['Sales Trends', 'Lifecycle', 'Demand Forecast']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/mainadmin" className="mr-4 p-2 rounded-xl bg-white shadow hover:bg-yellow-50 transition-colors">
              <FiBox className="w-5 h-5 text-green-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiBox className="w-8 h-8 text-green-600 mr-3" />
              Product Analytics Business Intelligence
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Analyze product performance, stock, and trends to optimize your catalog and inventory.
          </p>
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
      </div>
    </div>
  );
};

export default ProductBIReports; 