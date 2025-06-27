import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBox, FiArrowLeft, FiDownload, FiAlertTriangle } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InventoryReport = () => {
  const [category, setCategory] = useState('All');
  const [stockData, setStockData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories] = useState(['All', 'Compressors', 'Parts', 'Services']);

  // Fetch inventory data from backend
  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/inventory-report`, {
        params: {
          category: category === 'All' ? undefined : category,
        }
      });
      
      if (response.data) {
        setStockData(response.data.stockLevels || []);
        setLowStockData(response.data.lowStock || []);
        setSupplierData(response.data.supplierPerformance || []);
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      toast.error('Failed to fetch inventory data');
      // Use placeholder data if API fails
      setStockData([
        { product: 'Compressor X', stock: 20 },
        { product: 'Part Y', stock: 5 },
        { product: 'Service Z', stock: 15 },
      ]);
      setLowStockData([
        { product: 'Part Y', stock: 5, reorderPoint: 10 },
      ]);
      setSupplierData([
        { supplier: 'Supplier A', onTime: 95, accuracy: 98 },
        { supplier: 'Supplier B', onTime: 88, accuracy: 92 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, [category]);

  // Bar chart configuration
  const barChartData = {
    labels: stockData.map(item => item.product),
    datasets: [
      {
        label: 'Current Stock',
        data: stockData.map(item => item.stock),
        backgroundColor: stockData.map(item => 
          item.stock < 10 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(16, 185, 129, 0.8)'
        ),
        borderColor: stockData.map(item => 
          item.stock < 10 ? 'rgba(239, 68, 68, 1)' : 'rgba(16, 185, 129, 1)'
        ),
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
        text: 'Stock Levels by Product',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity',
        },
      },
    },
  };

  // Export functionality
  const exportToCSV = () => {
    const csvContent = [
      ['Product', 'Current Stock', 'Reorder Point', 'Status'],
      ...stockData.map(item => [
        item.product, 
        item.stock, 
        item.reorderPoint || 'N/A',
        item.stock < (item.reorderPoint || 10) ? 'Low Stock' : 'In Stock'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Inventory report exported successfully');
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
              <FiBox className="w-8 h-8 text-green-600 mr-2" /> Inventory Report
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

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-medium">Category:</label>
            <select 
              className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
              value={category} 
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {loading && (
            <div className="flex items-center text-green-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
              Loading...
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Products</h3>
            <p className="text-2xl font-bold text-gray-900">{stockData.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Stock</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stockData.reduce((sum, item) => sum + item.stock, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Low Stock Items</h3>
            <p className="text-2xl font-bold text-red-600">{lowStockData.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Suppliers</h3>
            <p className="text-2xl font-bold text-gray-900">{supplierData.length}</p>
          </div>
        </div>

        {/* Stock Levels Chart */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock Levels</h2>
          <div className="h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Low Stock Table */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FiAlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              Low Stock / Reorder Points
            </h2>
            {lowStockData.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {lowStockData.length} items need reorder
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Point</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockData.length > 0 ? (
                  lowStockData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-red-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{row.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.reorderPoint}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Low Stock
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No low stock items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supplier Performance */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Supplier Performance</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On-Time Delivery (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Accuracy (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supplierData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.supplier}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.onTime}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.accuracy}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.onTime >= 90 && row.accuracy >= 95 
                          ? 'bg-green-100 text-green-800' 
                          : row.onTime >= 80 && row.accuracy >= 90
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {row.onTime >= 90 && row.accuracy >= 95 ? 'Excellent' : 
                         row.onTime >= 80 && row.accuracy >= 90 ? 'Good' : 'Needs Improvement'}
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

export default InventoryReport; 