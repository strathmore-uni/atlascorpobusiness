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

const WarehouseActivityReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/warehouse/activity-report');
      if (!response.ok) {
        throw new Error('Failed to fetch activity data');
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
      ['Total Activities', data.totalActivities, data.activityGrowth],
      ['Active Workers', data.activeWorkers, data.workerGrowth],
      ['Equipment Utilization', data.equipmentUtilization, data.utilizationChange],
      ['Activity Types', '', ''],
      ...data.activityTypes.map(item => [item.type, item.count, item.percentage]),
      ['Daily Activity', '', ''],
      ...data.dailyActivity.map(item => [item.day, item.activities, '']),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'warehouse-activity-report.csv';
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
            onClick={fetchActivityData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const dailyActivityData = {
    labels: data.dailyActivity.map(item => item.day),
    datasets: [
      {
        label: 'Activities',
        data: data.dailyActivity.map(item => item.activities),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const activityTypesData = {
    labels: data.activityTypes.map(item => item.type),
    datasets: [
      {
        data: data.activityTypes.map(item => item.count),
        backgroundColor: [
          '#8B5CF6',
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#06B6D4',
        ],
      },
    ],
  };

  const workerProductivityData = {
    labels: data.workerProductivity.map(item => item.worker),
    datasets: [
      {
        label: 'Activities Completed',
        data: data.workerProductivity.map(item => item.activities),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Warehouse Activity Report</h1>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export to CSV
            </button>
          </div>
          <p className="text-gray-600">Warehouse operations and worker activity analysis</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Activities</h3>
            <p className="text-2xl font-bold text-gray-900">{data.totalActivities.toLocaleString()}</p>
            <p className={`text-sm ${data.activityGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.activityGrowth >= 0 ? '+' : ''}{data.activityGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Active Workers</h3>
            <p className="text-2xl font-bold text-gray-900">{data.activeWorkers}</p>
            <p className={`text-sm ${data.workerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.workerGrowth >= 0 ? '+' : ''}{data.workerGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Equipment Utilization</h3>
            <p className="text-2xl font-bold text-gray-900">{data.equipmentUtilization}%</p>
            <p className={`text-sm ${data.utilizationChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.utilizationChange >= 0 ? '+' : ''}{data.utilizationChange}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Efficiency Score</h3>
            <p className="text-2xl font-bold text-gray-900">{data.efficiencyScore}%</p>
            <p className={`text-sm ${data.efficiencyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.efficiencyChange >= 0 ? '+' : ''}{data.efficiencyChange}% from last period
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Activity Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity Trend</h3>
            <Line data={dailyActivityData} options={{
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

          {/* Activity Types */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Types</h3>
            <Doughnut data={activityTypesData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
              }
            }} />
          </div>
        </div>

        {/* Worker Productivity */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Worker Productivity</h3>
          <Bar data={workerProductivityData} options={{
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

        {/* Activity Types Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Types Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.activityTypes.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {activity.avgDuration} min
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

export default WarehouseActivityReport; 