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

const ProductStockReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/product-stock-report');
      if (!response.ok) {
        throw new Error('Failed to fetch product stock data');
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
      ['Total Stock Items', data.totalStockItems, data.stockGrowth],
      ['Low Stock Items', data.lowStockItems, data.lowStockChange],
      ['Out of Stock', data.outOfStockItems, data.outOfStockChange],
      ['Stock Categories', '', ''],
      ...data.stockCategories.map(item => [item.category, item.count, item.percentage]),
      ['Monthly Stock Levels', '', ''],
      ...data.monthlyStockLevels.map(item => [item.month, item.items, '']),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-stock-report.csv';
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
            onClick={fetchStockData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const monthlyStockData = {
    labels: data.monthlyStockLevels.map(item => item.month),
    datasets: [
      {
        label: 'Stock Items',
        data: data.monthlyStockLevels.map(item => item.items),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const stockCategoriesData = {
    labels: data.stockCategories.map(item => item.category),
    datasets: [
      {
        data: data.stockCategories.map(item => item.count),
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

  const stockStatusData = {
    labels: data.stockStatus.map(item => item.status),
    datasets: [
      {
        label: 'Items',
        data: data.stockStatus.map(item => item.count),
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Product Stock Report</h1>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export to CSV
            </button>
          </div>
          <p className="text-gray-600">Product stock levels and inventory management</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Stock Items</h3>
            <p className="text-2xl font-bold text-gray-900">{data.totalStockItems.toLocaleString()}</p>
            <p className={`text-sm ${data.stockGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.stockGrowth >= 0 ? '+' : ''}{data.stockGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
            <p className="text-2xl font-bold text-gray-900">{data.lowStockItems.toLocaleString()}</p>
            <p className={`text-sm ${data.lowStockChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.lowStockChange >= 0 ? '+' : ''}{data.lowStockChange}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
            <p className="text-2xl font-bold text-gray-900">{data.outOfStockItems.toLocaleString()}</p>
            <p className={`text-sm ${data.outOfStockChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.outOfStockChange >= 0 ? '+' : ''}{data.outOfStockChange}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Stock Turnover</h3>
            <p className="text-2xl font-bold text-gray-900">{data.stockTurnover}x</p>
            <p className={`text-sm ${data.turnoverGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.turnoverGrowth >= 0 ? '+' : ''}{data.turnoverGrowth}% from last period
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Stock Levels */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Stock Levels</h3>
            <Line data={monthlyStockData} options={{
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

          {/* Stock Categories */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock by Category</h3>
            <Doughnut data={stockCategoriesData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
              }
            }} />
          </div>
        </div>

        {/* Stock Status */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Status Overview</h3>
          <Bar data={stockStatusData} options={{
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

        {/* Stock Categories Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Categories Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Low Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.stockCategories.map((category, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.lowStock}
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

export default ProductStockReport; 