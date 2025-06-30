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

const FinanceCostsReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCostsData();
  }, []);

  const fetchCostsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance/costs-report');
      if (!response.ok) {
        throw new Error('Failed to fetch costs data');
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
      ['Total Costs', data.totalCosts, data.costsGrowth],
      ['Cost of Goods Sold', data.costOfGoodsSold, data.cogsGrowth],
      ['Operating Expenses', data.operatingExpenses, data.opexGrowth],
      ['Cost Categories', '', ''],
      ...data.costCategories.map(item => [item.category, item.amount, item.percentage]),
      ['Monthly Costs', '', ''],
      ...data.monthlyCosts.map(item => [item.month, item.costs, '']),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance-costs-report.csv';
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
            onClick={fetchCostsData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const monthlyCostsData = {
    labels: data.monthlyCosts.map(item => item.month),
    datasets: [
      {
        label: 'Total Costs',
        data: data.monthlyCosts.map(item => item.costs),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const costCategoriesData = {
    labels: data.costCategories.map(item => item.category),
    datasets: [
      {
        data: data.costCategories.map(item => item.amount),
        backgroundColor: [
          '#EF4444',
          '#F59E0B',
          '#10B981',
          '#3B82F6',
          '#8B5CF6',
          '#06B6D4',
        ],
      },
    ],
  };

  const costTrendData = {
    labels: data.costTrends.map(item => item.month),
    datasets: [
      {
        label: 'COGS',
        data: data.costTrends.map(item => item.cogs),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
      {
        label: 'Operating Expenses',
        data: data.costTrends.map(item => item.opex),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Finance Costs Report</h1>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export to CSV
            </button>
          </div>
          <p className="text-gray-600">Cost analysis and expense management insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Costs</h3>
            <p className="text-2xl font-bold text-gray-900">${data.totalCosts.toLocaleString()}</p>
            <p className={`text-sm ${data.costsGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.costsGrowth >= 0 ? '+' : ''}{data.costsGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Cost of Goods Sold</h3>
            <p className="text-2xl font-bold text-gray-900">${data.costOfGoodsSold.toLocaleString()}</p>
            <p className={`text-sm ${data.cogsGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.cogsGrowth >= 0 ? '+' : ''}{data.cogsGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Operating Expenses</h3>
            <p className="text-2xl font-bold text-gray-900">${data.operatingExpenses.toLocaleString()}</p>
            <p className={`text-sm ${data.opexGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.opexGrowth >= 0 ? '+' : ''}{data.opexGrowth}% from last period
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Profit Margin</h3>
            <p className="text-2xl font-bold text-gray-900">{data.profitMargin}%</p>
            <p className={`text-sm ${data.marginGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.marginGrowth >= 0 ? '+' : ''}{data.marginGrowth}% from last period
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Costs Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Costs Trend</h3>
            <Line data={monthlyCostsData} options={{
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

          {/* Cost Categories */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Categories</h3>
            <Doughnut data={costCategoriesData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
              }
            }} />
          </div>
        </div>

        {/* Cost Trends */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Trends by Type</h3>
          <Bar data={costTrendData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
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

        {/* Cost Categories Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Categories Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.costCategories.map((category, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${category.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${category.growth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {category.growth >= 0 ? '+' : ''}{category.growth}%
                      </span>
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

export default FinanceCostsReport; 