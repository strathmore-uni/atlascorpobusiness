import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiLogOut, FiHome, FiShoppingCart, FiPlus, FiList, FiUsers, FiPackage, FiBarChart, FiShield, FiFileText, FiFile, FiMail } from "react-icons/fi";
import { useAuth } from '../MainOpeningpage/AuthContext';

export default function AdminCategory() {
  const [showSubLinks, setShowSubLinks] = useState(false);
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  
  const toggleSubLinks = () => {
    setShowSubLinks(!showSubLinks);
  };

  const fetchCurrentUser = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser;
      } catch (error) {
        console.error('Error parsing user data from local storage:', error);
        return null;
      }
    }
    console.error('No user data found in local storage.');
    return null;
  };
  
  const mycurrentUser = fetchCurrentUser();

  const handleSignOut = async () => {
    signOut();
    console.log('User signed out successfully.');
    navigate('/signin');
    localStorage.removeItem('userEmail');
  };
  
  const getInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : 'A';
  };

  const navigationItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard', color: 'bg-blue-500' },
    { name: 'Orders', icon: FiShoppingCart, path: '', color: 'bg-green-500', hasSubmenu: true },
    { name: 'Add Product', icon: FiPlus, path: '/addproduct', color: 'bg-purple-500' },
    { name: 'Product List', icon: FiList, path: '/productlist', color: 'bg-orange-500' },
    { name: 'Users', icon: FiUsers, path: '/registeredusers', color: 'bg-indigo-500' },
    { name: 'Stock', icon: FiPackage, path: '/stock', color: 'bg-red-500' },
    { name: 'Comparison', icon: FiBarChart, path: '/admin/country-comparison', color: 'bg-teal-500', adminOnly: true },
    { name: 'Admin Rights', icon: FiShield, path: '/admin/adminrightsmanagement', color: 'bg-yellow-500', adminOnly: true },
    { name: 'Audit Logs', icon: FiFileText, path: '/admin/auditlog', color: 'bg-pink-500', adminOnly: true },
    { name: 'Records', icon: FiFile, path: '/admin/records', color: 'bg-gray-500', adminOnly: true },
    { name: 'Questions', icon: FiMail, path: '/admin/questions', color: 'bg-cyan-500', adminOnly: true },
  ];

  const subMenuItems = [
    { name: 'Orders', path: '/ordereditems/orders' },
    { name: 'Approved', path: '/ordereditems/approved' },
    { name: 'Pending', path: '/ordereditems/pending' },
    { name: 'Cancelled', path: '/ordereditems/cancelled' },
    { name: 'Ready for Transport', path: '/ordereditems/finished_packing' },
    { name: 'Completed Orders', path: '/ordereditems/completed_orders' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-52 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            {getInitial(currentUser ? currentUser.email : "Admin")}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Admin</h3>
            <p className="text-xs text-gray-400 truncate max-w-32">{currentUser ? currentUser.email : "Sign in"}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-all duration-200">
            <IoMdNotificationsOutline className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleSignOut}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-all duration-200"
            title="Sign Out"
          >
            <FiLogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-1">
        {navigationItems.map((item) => {
          if (item.adminOnly && !mycurrentUser?.isAdmin) return null;
          
          const Icon = item.icon;
          
          if (item.hasSubmenu) {
            return (
              <div key={item.name}>
                <button
                  onClick={toggleSubLinks}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200 group"
                >
                  <div className={`w-7 h-7 ${item.color} rounded-lg flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-sm truncate">{item.name}</span>
                  <div className={`ml-auto transform transition-transform duration-200 ${showSubLinks ? 'rotate-180' : ''}`}>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {showSubLinks && (
                  <div className="ml-10 mt-1 space-y-0.5">
                    {subMenuItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.path}
                        className="block px-3 py-2 text-xs text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-all duration-200 truncate"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center space-x-3 px-3 py-2.5 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200 group"
            >
              <div className={`w-7 h-7 ${item.color} rounded-lg flex items-center justify-center text-white shadow-md`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-sm truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
