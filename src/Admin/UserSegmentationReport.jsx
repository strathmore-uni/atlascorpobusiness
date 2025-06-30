import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const UserSegmentationReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSegmentationData();
  }, []);

  const fetchSegmentationData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/user-segmentation-report');
      if (!response.ok) {
        throw new Error('Failed to fetch user segmentation data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data) return;
    
    const csvContent = [
      ['Metric', 'Value', 'Change'],
      ['Total Segments', data.totalSegments, data.segmentGrowth],
      ['Premium Users', data.premiumUsers, data.premiumGrowth],
      ['Active Segments', data.activeSegments, data.activeGrowth],
      ['User Segments', '', ''],
      ...data.userSegments.map(item => [item.segment, item.count, item.percentage]),
      ['Segment Performance', '', ''],
      ...data.segmentPerformance.map(item => [item.segment, item.value, item.growth]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-segmentation-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error: {error}</div>
          <button
            onClick={fetchSegmentationData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const segmentDistributionData = {
    labels: data.userSegments.map(item => item.segment),
    datasets: [
      {
        data: data.userSegments.map(item => item.count),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4',
        ],
      },
    ],
  };

  const segmentPerformanceData = {
    labels: data.segmentPerformance.map(item => item.segment),
    datasets: [
      {
        label: 'Performance Score',
        data: data.segmentPerformance.map(item => item.value),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
    ],
  };

  const segmentGrowthData = {
    labels: data.segmentGrowth.map(item => item.month),
    datasets: [
      {
        label: 'Premium Users',
        data: data.segmentGrowth.map(item => item.premium),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Regular Users',
        data: data.segmentGrowth.map(item => item.regular),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">User Segmentation Report</h1>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export to CSV
            </button>
          </div>
          <p className="text-gray-600">User segmentation and behavior analysis</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Segments</h3>
            <p className="text-2xl font-bold text-gray-900">{data.totalSegments}</p>
            <p className={`text-sm ${data.segmentGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.segmentGrowth >= 0 ? '+' : ''}{data.segmentGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Premium Users</h3>
            <p className="text-2xl font-bold text-gray-900">{data.premiumUsers.toLocaleString()}</p>
            <p className={`text-sm ${data.premiumGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.premiumGrowth >= 0 ? '+' : ''}{data.premiumGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Active Segments</h3>
            <p className="text-2xl font-bold text-gray-900">{data.activeSegments}</p>
            <p className={`text-sm ${data.activeGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.activeGrowth >= 0 ? '+' : ''}{data.activeGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Segment Engagement</h3>
            <p className="text-2xl font-bold text-gray-900">{data.segmentEngagement}%</p>
            <p className={`text-sm ${data.engagementChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.engagementChange >= 0 ? '+' : ''}{data.engagementChange}% from last period
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Segment Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Segment Distribution</h3>
            <Doughnut data={segmentDistributionData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
              }
            }} />
          </div>

          {/* Segment Performance */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Performance</h3>
            <Bar data={segmentPerformanceData} options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                }
              }
            }} />
          </div>
        </div>

        {/* Segment Growth Trend */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Growth Trend</h3>
          <Line data={segmentGrowthData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
            },
            scales: {
              y: {
                beginAtZero: true,
              }
            }
          }} />
        </div>

        {/* User Segments Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Segments Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Segment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.userSegments.map((segment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {segment.segment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {segment.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {segment.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${segment.avgValue}
                    </td>
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

export default UserSegmentationReport; 