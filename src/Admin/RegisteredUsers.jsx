import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoChevronBackOutline } from "react-icons/io5";
import { useAuth } from '../MainOpeningpage/AuthContext';
import { useLoading } from '../General Components/LoadingProvider';
import LoadingSpinner from '../General Components/LoadingSpinner';
import { FiUsers, FiFilter, FiEye, FiUserX, FiMail, FiPhone, FiMapPin, FiCalendar, FiPackage, FiDollarSign } from 'react-icons/fi';
import AdminCategory from './AdminCategory';

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('details'); // State for active tab
  const { currentUser } = useAuth();
  const { setLoading, getLoadingState } = useLoading();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser || !currentUser.email) {
        setError('No admin email provided');
        toast.error('No admin email provided');
        return;
      }

      setLoading('users', true, 'Loading users...');
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/registeredusers`, {
          params: { email: currentUser.email }
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
        toast.success('Users fetched successfully');
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users.');
        toast.error('Failed to fetch users.');
      } finally {
        setLoading('users', false);
      }
    };

    fetchUsers();
  }, [currentUser, setLoading]);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading('countries', true, 'Loading countries...');
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/countries`);
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast.error('Failed to fetch countries.');
      } finally {
        setLoading('countries', false);
      }
    };

    fetchCountries();
  }, [setLoading]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setActiveTab('details');
    
    if (user.email) {
      setLoading('orderHistory', true, 'Loading order history...');
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/orders`, {
          params: { email: user.email }
        });
        setOrderHistory(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
        toast.error('Failed to fetch order history.');
      } finally {
        setLoading('orderHistory', false);
      }
    }
  };

  const handleCountryChange = async (event) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);
  
    // Debug log to check the selected country
    console.log(`Selected Country: ${selectedCountry}`);
  
    setLoading('filterUsers', true, 'Filtering users...');
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/registeredusers`, {
        params: { email: currentUser.email, country: selectedCountry || undefined },
      });
  
      // Debug log to check the response
      console.log('Filtered Users Response:', response.data);
      setFilteredUsers(response.data);
      toast.success('Users filtered successfully');
    } catch (error) {
      console.error('Error fetching filtered users:', error);
      toast.error('Failed to filter users.');
    } finally {
      setLoading('filterUsers', false);
    }
  };
  
  const handleSuspendUser = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend this user?')) {
      return;
    }

    setLoading('suspendUser', true, 'Suspending user...');
    try {
      await axios.post(`${process.env.REACT_APP_LOCAL}/api/suspenduser`, {
        email: currentUser.email,
        userId
      });
      toast.success('User suspended successfully');
      // Refresh user list after suspension
      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/registeredusers`, {
        params: { email: currentUser.email }
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user.');
    } finally {
      setLoading('suspendUser', false);
    }
  };

  const usersLoading = getLoadingState('users');
  const countriesLoading = getLoadingState('countries');
  const orderHistoryLoading = getLoadingState('orderHistory');
  const filterUsersLoading = getLoadingState('filterUsers');
  const suspendUserLoading = getLoadingState('suspendUser');

  if (usersLoading.isLoading) {
    return (
      <LoadingSpinner
        type="dots"
        size="large"
        color="blue"
        text="Loading users..."
        fullScreen={true}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <AdminCategory />
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 ml-64">
      <div className="max-w-7xl mx-auto">
        <AdminCategory />
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Registered Users</h1>
          </div>
          <p className="text-lg text-gray-600">Manage and view all registered users in your system</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiFilter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  disabled={countriesLoading.isLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </select>
              </div>
              {countriesLoading.isLoading && (
                <LoadingSpinner type="ring" size="small" color="blue" text="" />
              )}
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>

        {/* Users List */}
        {filterUsersLoading.isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner
              type="wave"
              size="medium"
              color="blue"
              text="Filtering users..."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status || 'Active'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {user.name || 'N/A'}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FiMail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <FiMapPin className="w-4 h-4 mr-2" />
                      {user.country || 'N/A'}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FiPhone className="w-4 h-4 mr-2" />
                      {user.phone || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <button
                  className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserClick(user);
                  }}
                >
                  <FiEye className="w-4 h-4 mr-2" />
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!filterUsersLoading.isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {selectedCountry ? "No users found in the selected country." : "No users have registered yet."}
            </p>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSelectedUser(null)}></div>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-50">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiUsers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedUser.name || 'User Details'}
                    </h2>
                    <p className="text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <IoChevronBackOutline className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  User Details
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'orders'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  Order History
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <p className="text-gray-900">{selectedUser.name || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <p className="text-gray-900">{selectedUser.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <p className="text-gray-900">{selectedUser.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <p className="text-gray-900">{selectedUser.country || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedUser.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedUser.status || 'Active'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                          <p className="text-gray-900">
                            {new Date(selectedUser.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                          <p className="text-gray-900 font-mono text-sm">{selectedUser.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
                    {orderHistoryLoading.isLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <LoadingSpinner
                          type="bounce"
                          size="medium"
                          color="blue"
                          text="Loading order history..."
                        />
                      </div>
                    ) : orderHistory.length > 0 ? (
                      <div className="space-y-4">
                        {orderHistory.map((order) => (
                          <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FiPackage className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Order #{order.id}</p>
                                  <p className="text-sm text-gray-600">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">${order.total}</p>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'Completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiPackage className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-600">No order history found for this user.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200">
                <button
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleSuspendUser(selectedUser.id)}
                  disabled={suspendUserLoading.isLoading}
                >
                  {suspendUserLoading.isLoading ? (
                    <LoadingSpinner type="ring" size="small" color="white" text="" />
                  ) : (
                    <>
                      <FiUserX className="w-4 h-4 mr-2" />
                      Suspend User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default RegisteredUsers;
