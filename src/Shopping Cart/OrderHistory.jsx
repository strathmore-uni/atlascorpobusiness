import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosArrowBack, IoIosCheckmarkCircle, IoIosTime, IoIosCart, IoIosRefresh, IoIosEye, IoIosClose, IoIosCalendar, IoIosCard } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaDownload, FaCalendar, FaMapMarkerAlt, FaTruck, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../MainOpeningpage/AuthContext";
import LoadingSpinner from "../General Components/LoadingSpinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [receivedStatus, setReceivedStatus] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6; // Reduced for better UX

  const orderSteps = [
    { name: 'Received', icon: IoIosCheckmarkCircle, color: 'bg-green-500' },
    { name: 'Approved', icon: IoIosCheckmarkCircle, color: 'bg-blue-500' },
    { name: 'Being Processed', icon: IoIosTime, color: 'bg-yellow-500' },
    { name: 'Finished Packing', icon: IoIosCart, color: 'bg-purple-500' },
    { name: 'On Transit', icon: IoIosRefresh, color: 'bg-orange-500' },
    { name: 'Completed', icon: IoIosCheckmarkCircle, color: 'bg-green-600' }
  ];

  const getStatusIndex = (status) => {
    return orderSteps.findIndex(step => step.name === status);
  };

  const progressPercentage = (status) => {
    return ((getStatusIndex(status) + 1) / orderSteps.length) * 100;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Received': 'text-green-600 bg-green-50 border-green-200',
      'Approved': 'text-blue-600 bg-blue-50 border-blue-200',
      'Being Processed': 'text-yellow-600 bg-yellow-50 border-yellow-200',
      'Finished Packing': 'text-purple-600 bg-purple-50 border-purple-200',
      'On Transit': 'text-orange-600 bg-orange-50 border-orange-200',
      'Completed': 'text-green-700 bg-green-100 border-green-300'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL}/api/orders/history?email=${currentUser.email}`
        );
        setOrders(response.data);
      } catch (error) {
        setError('Error fetching order history');
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrderHistory();
      const intervalId = setInterval(fetchOrderHistory, 60000); // Poll every 60 seconds

      return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  const handleAddOrderItemsToCart = async (orderId) => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    try {
      // Get the order items from the order
      const order = orders.find(o => o.id === orderId);
      if (!order || !order.items) {
        console.error('Order not found or no items');
        return;
      }

      // Add each item to cart using the context
      for (const item of order.items) {
        const product = {
          partnumber: item.partnumber || item.sku,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        };
        
        await addToCart(product, item.quantity);
      }
      
      console.log('Order items added to cart successfully');
    } catch (error) {
      console.error('Error adding order items to cart:', error);
    }
  };

  const handleReceivedClick = async (orderId) => {
    try {
      // Optimistically update UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: 'Completed' } : order
        )
      );
      setReceivedStatus((prevStatus) => ({ ...prevStatus, [orderId]: true }));

      // Update on the server
      await axios.patch(
        `${process.env.REACT_APP_LOCAL}/api/admin/orders/${orderId}/status`,
        { status: 'Completed' },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      // Revert optimistic update in case of error
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: 'On Transit' } : order
        )
      );
      setReceivedStatus((prevStatus) => ({ ...prevStatus, [orderId]: false }));
    }
  };

  // Calculate pagination variables
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleReorder = async (order) => {
    try {
      // Add all items from the order to cart
      for (const item of order.items) {
        await addToCart({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          email: currentUser.email
        });
      }
      
      toast.success("Items added to cart");
      navigate("/cart");
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("Failed to add items to cart");
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await axiosInstance.get(`/api/orders/${orderId}/invoice`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading your order history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Order History</h1>
              <p className="text-gray-600">Track your orders and their current status</p>
            </div>
            <Link 
              to="/shop" 
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <IoIosArrowBack className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <IoIosCart className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your order history here</p>
            <Link 
              to="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {currentOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">#{order.ordernumber}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.ordernumber}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-lg font-bold text-gray-900">${order.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4">
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>Order Progress</span>
                      <span>{Math.round(progressPercentage(order.status))}% Complete</span>
                    </div>
                    <div className="relative">
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                        <div 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                          style={{ width: `${progressPercentage(order.status)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {orderSteps.map((step, index) => {
                      const isCompleted = getStatusIndex(order.status) >= index;
                      const isCurrent = getStatusIndex(order.status) === index;
                      const Icon = step.icon;
                      
                      return (
                        <div key={index} className="text-center">
                          <div className={`relative mx-auto h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isCurrent 
                                ? 'bg-blue-500 text-white ring-4 ring-blue-100' 
                                : 'bg-gray-200 text-gray-500'
                          }`}>
                            {isCompleted ? (
                              <IoIosCheckmarkCircle className="h-4 w-4" />
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                          </div>
                          <p className={`text-xs mt-1 transition-colors duration-300 ${
                            isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'
                          }`}>
                            {step.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <IoIosEye className="mr-2 h-4 w-4" />
                        {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                      
                      <button
                        onClick={() => handleReorder(order)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <IoIosCart className="mr-2 h-4 w-4" />
                        Reorder
                      </button>
                    </div>

                    {getStatusIndex(order.status) === 4 && !receivedStatus[order.id] && (
                      <button
                        onClick={() => handleReceivedClick(order.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                        <IoIosCheckmarkCircle className="mr-2 h-4 w-4" />
                        Mark as Received
                      </button>
                    )}
                    {receivedStatus[order.id] && (
                      <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md">
                        <IoIosCheckmarkCircle className="mr-2 h-4 w-4" />
                        Received
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Details (Collapsible) */}
                {selectedOrder === order.id && (
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={item.id || index} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.description}</p>
                            <p className="text-xs text-gray-500">SKU: {item.sku || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {item.quantity} × ${item.price?.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${(item.quantity * (item.price || 0)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isActive = currentPage === pageNumber;
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
