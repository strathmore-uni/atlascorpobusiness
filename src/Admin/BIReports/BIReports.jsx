import React from 'react';
import { FiBarChart2, FiBox, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const reports = [
  {
    title: 'Revenue Reports',
    icon: <FiBarChart2 className="w-8 h-8 text-blue-600" />,
    description: 'Detailed financial reports and revenue projections.',
    link: '/admin/bireports/revenue',
  },
  {
    title: 'Inventory Reports',
    icon: <FiBox className="w-8 h-8 text-green-600" />,
    description: 'Stock levels, reorder points, and supplier performance.',
    link: '/admin/bireports/inventory',
  },
  {
    title: 'Customer Reports',
    icon: <FiUsers className="w-8 h-8 text-indigo-600" />,
    description: 'Demographics, purchasing patterns, and segmentation.',
    link: '/admin/bireports/customers',
  },
  {
    title: 'Marketing Reports',
    icon: <FiTrendingUp className="w-8 h-8 text-pink-600" />,
    description: 'Campaign performance, conversion rates, and ROI.',
    link: '/admin/bireports/marketing',
  },
];

const BIReports = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Business Intelligence Reports</h1>
          <p className="text-lg text-gray-600">Gain insights into your business with detailed analytics and reports</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reports.map((report) => (
            <div key={report.title} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition-all duration-300">
              <div className="mb-4">{report.icon}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{report.title}</h2>
              <p className="text-gray-600 mb-6 text-center">{report.description}</p>
              <Link
                to={report.link}
                className="inline-block px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                View Report
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BIReports; 