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

const WarehouseFulfillmentReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFulfillmentData();
  }, []);

  const fetchFulfillmentData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/warehouse/fulfillment-report');
      if (!response.ok) {
        throw new Error('Failed to fetch fulfillment data');
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
      ['Orders Fulfilled', data.ordersFulfilled, data.fulfillmentGrowth],
      ['Fulfillment Rate', data.fulfillmentRate, data.rateChange],
      ['Average Pick Time', data.averagePickTime, data.pickTimeChange],
      ['Fulfillment Methods', '', ''],
      ...data.fulfillmentMethods.map(item => [item.method, item.count, item.percentage]),
      ['Monthly Fulfillment', '', ''],
      ...data.monthlyFulfillment.map(item => [item.month, item.orders, '']),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'warehouse-fulfillment-report.csv';
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
            onClick={fetchFulfillmentData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const monthlyFulfillmentData = {
    labels: data.monthlyFulfillment.map(item => item.month),
    datasets: [
      {
        label: 'Orders Fulfilled',
        data: data.monthlyFulfillment.map(item => item.orders),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const fulfillmentMethodsData = {
    labels: data.fulfillmentMethods.map(item => item.method),
    datasets: [
      {
        data: data.fulfillmentMethods.map(item => item.count),
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
      },
    ],
  };

  const pickTimeData = {
    labels: data.pickTimeByCategory.map(item => item.category),
    datasets: [
      {
        label: 'Average Pick Time (minutes)',
        data: data.pickTimeByCategory.map(item => item.time),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Warehouse Fulfillment Report</h1>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export to CSV
            </button>
          </div>
          <p className="text-gray-600">Order fulfillment performance and efficiency analysis</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Orders Fulfilled</h3>
            <p className="text-2xl font-bold text-gray-900">{data.ordersFulfilled.toLocaleString()}</p>
            <p className={`text-sm ${data.fulfillmentGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.fulfillmentGrowth >= 0 ? '+' : ''}{data.fulfillmentGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Fulfillment Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{data.fulfillmentRate}%</p>
            <p className={`text-sm ${data.rateChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.rateChange >= 0 ? '+' : ''}{data.rateChange}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Average Pick Time</h3>
            <p className="text-2xl font-bold text-gray-900">{data.averagePickTime} min</p>
            <p className={`text-sm ${data.pickTimeChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.pickTimeChange >= 0 ? '+' : ''}{data.pickTimeChange}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">On-Time Delivery</h3>
            <p className="text-2xl font-bold text-gray-900">{data.onTimeDelivery}%</p>
            <p className={`text-sm ${data.deliveryChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.deliveryChange >= 0 ? '+' : ''}{data.deliveryChange}% from last period
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Fulfillment Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Fulfillment Trend</h3>
            <Line data={monthlyFulfillmentData} options={{
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

          {/* Fulfillment Methods */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fulfillment Methods</h3>
            <Doughnut data={fulfillmentMethodsData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
              }
            }} />
          </div>
        </div>

        {/* Pick Time by Category */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pick Time by Category</h3>
          <Bar data={pickTimeData} options={{
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

        {/* Fulfillment Methods Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fulfillment Methods Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.fulfillmentMethods.map((method, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {method.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {method.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {method.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {method.avgTime} min
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

export default WarehouseFulfillmentReport; 