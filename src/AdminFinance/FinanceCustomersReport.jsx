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

const FinanceCustomersReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomersData();
  }, []);

  const fetchCustomersData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance/customers-report');
      if (!response.ok) {
        throw new Error('Failed to fetch customers data');
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
      ['Total Customers', data.totalCustomers, data.customerGrowth],
      ['New Customers', data.newCustomers, data.newCustomerGrowth],
      ['Customer Lifetime Value', data.customerLifetimeValue, data.clvGrowth],
      ['Customer Segments', '', ''],
      ...data.customerSegments.map(item => [item.segment, item.count, item.percentage]),
      ['Monthly Customer Growth', '', ''],
      ...data.monthlyCustomerGrowth.map(item => [item.month, item.customers, '']),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance-customers-report.csv';
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
            onClick={fetchCustomersData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const customerGrowthData = {
    labels: data.monthlyCustomerGrowth.map(item => item.month),
    datasets: [
      {
        label: 'Total Customers',
        data: data.monthlyCustomerGrowth.map(item => item.customers),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const segmentsData = {
    labels: data.customerSegments.map(item => item.segment),
    datasets: [
      {
        data: data.customerSegments.map(item => item.count),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
      },
    ],
  };

  const topCustomersData = {
    labels: data.topCustomers.map(item => item.name),
    datasets: [
      {
        label: 'Total Spent',
        data: data.topCustomers.map(item => item.totalSpent),
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
            <h1 className="text-3xl font-bold text-gray-900">Finance Customers Report</h1>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export to CSV
            </button>
          </div>
          <p className="text-gray-600">Customer analysis and segmentation insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
            <p className="text-2xl font-bold text-gray-900">{data.totalCustomers.toLocaleString()}</p>
            <p className={`text-sm ${data.customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.customerGrowth >= 0 ? '+' : ''}{data.customerGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">New Customers</h3>
            <p className="text-2xl font-bold text-gray-900">{data.newCustomers.toLocaleString()}</p>
            <p className={`text-sm ${data.newCustomerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.newCustomerGrowth >= 0 ? '+' : ''}{data.newCustomerGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Customer Lifetime Value</h3>
            <p className="text-2xl font-bold text-gray-900">${data.customerLifetimeValue}</p>
            <p className={`text-sm ${data.clvGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.clvGrowth >= 0 ? '+' : ''}{data.clvGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Retention Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{data.retentionRate}%</p>
            <p className={`text-sm ${data.retentionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.retentionGrowth >= 0 ? '+' : ''}{data.retentionGrowth}% from last period
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Customer Growth Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth Trend</h3>
            <Line data={customerGrowthData} options={{
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

          {/* Customer Segments */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
            <Doughnut data={segmentsData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
              }
            }} />
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Revenue</h3>
          <Bar data={topCustomersData} options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }} />
        </div>

        {/* Customer Segments Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments Details</h3>
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
                    Average Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.customerSegments.map((segment, index) => (
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
                      ${segment.averageValue}
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

export default FinanceCustomersReport; 