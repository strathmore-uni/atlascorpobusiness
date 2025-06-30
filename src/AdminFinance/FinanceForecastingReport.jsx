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

const FinanceForecastingReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForecastingData();
  }, []);

  const fetchForecastingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance/forecasting-report');
      if (!response.ok) {
        throw new Error('Failed to fetch forecasting data');
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
      ['Metric', 'Value', 'Forecast'],
      ['Revenue Forecast', data.revenueForecast, data.revenueGrowth],
      ['Cost Forecast', data.costForecast, data.costGrowth],
      ['Profit Forecast', data.profitForecast, data.profitGrowth],
      ['Monthly Forecasts', '', ''],
      ...data.monthlyForecasts.map(item => [item.month, item.actual, item.forecast]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance-forecasting-report.csv';
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
            onClick={fetchForecastingData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const revenueForecastData = {
    labels: data.revenueForecastTrend.map(item => item.month),
    datasets: [
      {
        label: 'Actual Revenue',
        data: data.revenueForecastTrend.map(item => item.actual),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Forecasted Revenue',
        data: data.revenueForecastTrend.map(item => item.forecast),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderDash: [5, 5],
        tension: 0.1,
      },
    ],
  };

  const profitForecastData = {
    labels: data.profitForecastTrend.map(item => item.month),
    datasets: [
      {
        label: 'Actual Profit',
        data: data.profitForecastTrend.map(item => item.actual),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'Forecasted Profit',
        data: data.profitForecastTrend.map(item => item.forecast),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
      },
    ],
  };

  const riskFactorsData = {
    labels: data.riskFactors.map(item => item.factor),
    datasets: [
      {
        data: data.riskFactors.map(item => item.impact),
        backgroundColor: [
          '#EF4444',
          '#F59E0B',
          '#10B981',
          '#3B82F6',
          '#8B5CF6',
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
            <h1 className="text-3xl font-bold text-gray-900">Finance Forecasting Report</h1>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export to CSV
            </button>
          </div>
          <p className="text-gray-600">Financial projections and forecasting analysis</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Revenue Forecast</h3>
            <p className="text-2xl font-bold text-gray-900">${data.revenueForecast.toLocaleString()}</p>
            <p className={`text-sm ${data.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.revenueGrowth >= 0 ? '+' : ''}{data.revenueGrowth}% expected growth
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Cost Forecast</h3>
            <p className="text-2xl font-bold text-gray-900">${data.costForecast.toLocaleString()}</p>
            <p className={`text-sm ${data.costGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.costGrowth >= 0 ? '+' : ''}{data.costGrowth}% expected change
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Profit Forecast</h3>
            <p className="text-2xl font-bold text-gray-900">${data.profitForecast.toLocaleString()}</p>
            <p className={`text-sm ${data.profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.profitGrowth >= 0 ? '+' : ''}{data.profitGrowth}% expected growth
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Forecast Accuracy</h3>
            <p className="text-2xl font-bold text-gray-900">{data.forecastAccuracy}%</p>
            <p className={`text-sm ${data.accuracyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.accuracyChange >= 0 ? '+' : ''}{data.accuracyChange}% from last period
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Forecast Trend */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Forecast Trend</h3>
            <Line data={revenueForecastData} options={{
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

          {/* Risk Factors */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors Impact</h3>
            <Doughnut data={riskFactorsData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
              }
            }} />
          </div>
        </div>

        {/* Profit Forecast */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Forecast Trend</h3>
          <Bar data={profitForecastData} options={{
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

        {/* Monthly Forecasts Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Forecasts Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Forecasted Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.monthlyForecasts.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.actual.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.forecast.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.variance >= 0 ? '+' : ''}{item.variance}%
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

export default FinanceForecastingReport; 