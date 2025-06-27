import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiArrowLeft, FiDownload } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MarketingReport = () => {
  const [campaign, setCampaign] = useState('All');
  const [campaignPerformance, setCampaignPerformance] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [conversionData, setConversionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campaigns] = useState(['All', 'Summer Sale', 'New Product Launch', 'Holiday Special']);

  // Fetch marketing data from backend
  const fetchMarketingData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/marketing-report`, {
        params: {
          campaign: campaign === 'All' ? undefined : campaign,
        }
      });
      
      if (response.data) {
        setCampaignPerformance(response.data.campaignPerformance || []);
        setChannelData(response.data.channelEffectiveness || []);
        setConversionData(response.data.conversionRates || []);
      }
    } catch (error) {
      console.error('Error fetching marketing data:', error);
      toast.error('Failed to fetch marketing data');
      // Use placeholder data if API fails
      setCampaignPerformance([
        { day: 'Day 1', impressions: 1000, clicks: 100, conversions: 10 },
        { day: 'Day 2', impressions: 1200, clicks: 120, conversions: 12 },
        { day: 'Day 3', impressions: 1100, clicks: 110, conversions: 11 },
      ]);
      setChannelData([
        { channel: 'Email', reach: 5000, engagement: 15, conversion: 3 },
        { channel: 'Social Media', reach: 8000, engagement: 8, conversion: 2 },
        { channel: 'Google Ads', reach: 3000, engagement: 25, conversion: 5 },
      ]);
      setConversionData([
        { stage: 'Impressions', count: 10000, rate: 100 },
        { stage: 'Clicks', count: 800, rate: 8 },
        { stage: 'Conversions', count: 80, rate: 10 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, [campaign]);

  // Line chart configuration for campaign performance
  const lineChartData = {
    labels: campaignPerformance.map(item => item.day),
    datasets: [
      {
        label: 'Impressions',
        data: campaignPerformance.map(item => item.impressions),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Clicks',
        data: campaignPerformance.map(item => item.clicks),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Conversions',
        data: campaignPerformance.map(item => item.conversions),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Campaign Performance Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
    },
  };

  // Bar chart configuration for channel effectiveness
  const barChartData = {
    labels: channelData.map(item => item.channel),
    datasets: [
      {
        label: 'Reach',
        data: channelData.map(item => item.reach),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Engagement Rate (%)',
        data: channelData.map(item => item.engagement),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Channel Effectiveness',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count / Percentage',
        },
      },
    },
  };

  // Export functionality
  const exportToCSV = () => {
    const csvContent = [
      ['Channel', 'Reach', 'Engagement Rate (%)', 'Conversion Rate (%)'],
      ...channelData.map(item => [
        item.channel, 
        item.reach, 
        item.engagement, 
        item.conversion
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketing-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Marketing report exported successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 ml-64">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/admin/bireports" className="mr-4 p-2 rounded-xl bg-white shadow hover:bg-blue-50 transition-colors">
              <FiArrowLeft className="w-5 h-5 text-blue-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiTrendingUp className="w-8 h-8 text-purple-600 mr-2" /> Marketing Report
            </h1>
          </div>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Campaign Filter */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-medium">Campaign:</label>
            <select 
              className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
              value={campaign} 
              onChange={e => setCampaign(e.target.value)}
            >
              {campaigns.map(camp => (
                <option key={camp} value={camp}>{camp}</option>
              ))}
            </select>
          </div>
          {loading && (
            <div className="flex items-center text-purple-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
              Loading...
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Reach</h3>
            <p className="text-2xl font-bold text-gray-900">
              {channelData.reduce((sum, item) => sum + item.reach, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Avg Engagement</h3>
            <p className="text-2xl font-bold text-green-600">
              {channelData.length > 0 ? (channelData.reduce((sum, item) => sum + item.engagement, 0) / channelData.length).toFixed(1) : 0}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Conversion Rate</h3>
            <p className="text-2xl font-bold text-blue-600">
              {channelData.length > 0 ? (channelData.reduce((sum, item) => sum + item.conversion, 0) / channelData.length).toFixed(1) : 0}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">ROI</h3>
            <p className="text-2xl font-bold text-purple-600">
              {campaignPerformance.length > 0 ? 
                ((campaignPerformance.reduce((sum, item) => sum + item.conversions, 0) / 
                  campaignPerformance.reduce((sum, item) => sum + item.impressions, 0)) * 100).toFixed(2) : 0}%
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h2>
            <div className="h-64">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Channel Effectiveness</h2>
            <div className="h-64">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h2>
          <div className="space-y-4">
            {conversionData.map((stage, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    idx === 0 ? 'bg-blue-500' : 
                    idx === 1 ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{stage.stage}</h3>
                    <p className="text-sm text-gray-500">{stage.count.toLocaleString()} users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{stage.rate}%</p>
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Performance Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reach</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement Rate (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {channelData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.channel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.reach.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.engagement}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.conversion}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.engagement >= 15 && row.conversion >= 3 ? 'bg-green-100 text-green-800' :
                        row.engagement >= 10 && row.conversion >= 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.engagement >= 15 && row.conversion >= 3 ? 'Excellent' :
                         row.engagement >= 10 && row.conversion >= 2 ? 'Good' : 'Needs Improvement'}
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

export default MarketingReport; 