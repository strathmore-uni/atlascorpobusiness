import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBarChart2, FiPieChart, FiActivity, FiTrendingUp } from 'react-icons/fi';

const UserBIReports = () => {
  const reports = [
    {
      title: 'User Growth',
      description: 'Monthly registrations, churn, and user base trends',
      icon: FiTrendingUp,
      color: 'bg-green-500',
      link: '/admin/bireports/user-growth',
      metrics: ['Monthly Growth', 'Churned Users', 'Active Users']
    },
    {
      title: 'User Segmentation',
      description: 'Breakdown by user type, country, and activity',
      icon: FiPieChart,
      color: 'bg-blue-500',
      link: '/admin/bireports/user-segmentation',
      metrics: ['By Role', 'By Country', 'By Activity']
    },
    {
      title: 'User Activity',
      description: 'Login frequency, engagement, and retention',
      icon: FiActivity,
      color: 'bg-indigo-500',
      link: '/admin/bireports/user-activity',
      metrics: ['Logins', 'Engagement', 'Retention']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/mainadmin" className="mr-4 p-2 rounded-xl bg-white shadow hover:bg-blue-50 transition-colors">
              <FiUsers className="w-5 h-5 text-green-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiUsers className="w-8 h-8 text-green-600 mr-3" />
              User Management Business Intelligence
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl">
            Analyze user growth, segmentation, and engagement to optimize your platform's user base.
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

export default UserBIReports; 