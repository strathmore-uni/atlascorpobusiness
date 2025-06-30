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

const FinanceInventoryReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance/inventory-report');
      if (!response.ok) {
        throw new Error('Failed to fetch inventory data');
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
      ['Total Inventory Value', data.totalInventoryValue, data.inventoryGrowth],
      ['Inventory Turnover', data.inventoryTurnover, data.turnoverGrowth],
      ['Stock Levels', '', ''],
      ...data.stockLevels.map(item => [item.category, item.value, item.percentage]),
      ['Monthly Inventory', '', ''],
      ...data.monthlyInventory.map(item => [item.month, item.value, '']),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance-inventory-report.csv';
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
            onClick={fetchInventoryData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const monthlyInventoryData = {
    labels: data.monthlyInventory.map(item => item.month),
    datasets: [
      {
        label: 'Inventory Value',
        data: data.monthlyInventory.map(item => item.value),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const stockLevelsData = {
    labels: data.stockLevels.map(item => item.category),
    datasets: [
      {
        data: data.stockLevels.map(item => item.value),
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

  const inventoryTurnoverData = {
    labels: data.inventoryTurnoverByCategory.map(item => item.category),
    datasets: [
      {
        label: 'Turnover Rate',
        data: data.inventoryTurnoverByCategory.map(item => item.turnover),
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
            <h1 className="text-3xl font-bold text-gray-900">Finance Inventory Report</h1>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export to CSV
            </button>
          </div>
          <p className="text-gray-600">Inventory value and turnover analysis</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Inventory Value</h3>
            <p className="text-2xl font-bold text-gray-900">${data.totalInventoryValue.toLocaleString()}</p>
            <p className={`text-sm ${data.inventoryGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.inventoryGrowth >= 0 ? '+' : ''}{data.inventoryGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Inventory Turnover</h3>
            <p className="text-2xl font-bold text-gray-900">{data.inventoryTurnover}x</p>
            <p className={`text-sm ${data.turnoverGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.turnoverGrowth >= 0 ? '+' : ''}{data.turnoverGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Days of Inventory</h3>
            <p className="text-2xl font-bold text-gray-900">{data.daysOfInventory}</p>
            <p className={`text-sm ${data.daysGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.daysGrowth >= 0 ? '+' : ''}{data.daysGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Stockout Rate</h3>
            <p className="text-2xl font-bold text-gray-900">{data.stockoutRate}%</p>
            <p className={`text-sm ${data.stockoutGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.stockoutGrowth >= 0 ? '+' : ''}{data.stockoutGrowth}% from last period
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Inventory Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Inventory Value</h3>
            <Line data={monthlyInventoryData} options={{
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

          {/* Stock Levels by Category */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Levels by Category</h3>
            <Doughnut data={stockLevelsData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
              }
            }} />
          </div>
        </div>

        {/* Inventory Turnover */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Turnover by Category</h3>
          <Bar data={inventoryTurnoverData} options={{
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

        {/* Stock Levels Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Levels Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turnover Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.stockLevels.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.turnover}x
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

export default FinanceInventoryReport; 