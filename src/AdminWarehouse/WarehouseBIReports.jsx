import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiBarChart2, FiActivity, FiTrendingUp } from 'react-icons/fi';

const WarehouseBIReports = () => {
  const reports = [
    {
      title: 'Inventory Overview',
      description: 'Stock levels, turnover, and inventory value by category',
      icon: FiPackage,
      color: 'bg-yellow-500',
      link: '/warehouse/bireports/inventory',
      metrics: ['Stock by Category', 'Turnover', 'Inventory Value']
    },
    {
      title: 'Warehouse Performance',
      description: 'Order fulfillment rates, delays, and KPIs',
      icon: FiTrendingUp,
      color: 'bg-green-500',
      link: '/warehouse/bireports/performance',
      metrics: ['Fulfillment Rate', 'Avg Fulfillment Time', 'Delayed Orders']
    },
    {
      title: 'Fulfillment Analytics',
      description: 'Order processing times and bottleneck analysis',
      icon: FiTruck,
      color: 'bg-blue-500',
      link: '/warehouse/bireports/fulfillment',
      metrics: ['Processing Time', 'Bottlenecks', 'Order Flow']
    },
    {
      title: 'Warehouse Activity',
      description: 'Inbound/outbound shipments and warehouse utilization',
      icon: FiActivity,
      color: 'bg-indigo-500',
      link: '/warehouse/bireports/activity',
      metrics: ['Inbound Shipments', 'Outbound Shipments', 'Utilization']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/warehouse/dashboard" className="mr-4 p-2 rounded-xl bg-white shadow hover:bg-yellow-50 transition-colors">
              <FiPackage className="w-5 h-5 text-yellow-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiPackage className="w-8 h-8 text-yellow-600 mr-3" />
              Warehouse Business Intelligence
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Optimize warehouse operations with real-time analytics on inventory, fulfillment, and performance.
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
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                      {metric}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center text-yellow-600 font-medium">
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

export default WarehouseBIReports; 