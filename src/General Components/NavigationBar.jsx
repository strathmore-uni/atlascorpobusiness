import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrCart } from "react-icons/gr";
import { FaBars, FaSearch, FaBell, FaUser } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../MainOpeningpage/AuthContext";
import { useCart } from "../App";
import { IoIosArrowDown } from "react-icons/io";
import Categories from "../Categories and Display page/Categories";
// import "./Navigation.css"; // Removed old CSS

export default function NavigationBar({ guestEmail }) {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { cartItems, getCartCount } = useCart();
  const categoriesRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || guestEmail
  );
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const toggleDropdownVisibility = () => setIsDropdownVisible(!isDropdownVisible);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isDropdownVisible &&
        !event.target.closest(".user-profile-container")
      ) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isDropdownVisible]);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!currentUser) {
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL}/api/user/notifications`,
          {
            params: { email: currentUser.email },
          }
        );

        setNotifications(response.data);
        const unreadCount = response.data.filter(
          (notification) => !notification.read
        ).length;
        setUnreadNotificationsCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const handleSearch = async () => {
    try {
      if (!currentUser) {
        console.error("No user email provided");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL}/api/search`,
        {
          params: {
            term: searchQuery,
            email: currentUser.email,
          },
        }
      );

      setResults(response.data);

      const uniqueCategories = [
        ...new Set(response.data.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);

      navigate(`/search?term=${searchQuery}`, {
        state: { results: response.data },
      });
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSignOut = async () => {
    signOut();
    console.log("User signed out successfully.");
    navigate("/signin");
    localStorage.removeItem("userEmail");
  };

  const handleBarsClick = () => {
    setIsCategoriesVisible((prevState) => !prevState);
  };

  const handleCategoriesClose = () => {
    setIsCategoriesVisible(false);
  };

  const handleOutsideClick = (event) => {
    if (
      categoriesRef.current &&
      !categoriesRef.current.contains(event.target)
    ) {
      setIsCategoriesVisible(false);
    }
  };

  useEffect(() => {
    if (isCategoriesVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isCategoriesVisible]);

  const getInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : "";
  };

  const handlemove = () => {
    navigate("/signin");
  };

  return (
    <nav className={`z-50 w-full sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${isScrolled ? "shadow-lg" : "shadow-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-6">
            {currentUser && (
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={handleBarsClick}
                aria-label="Open categories menu"
              >
                <FaBars className="text-gray-600" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 text-blue-900 font-bold text-lg hover:opacity-80 transition-opacity">
              <span className="hidden sm:inline">Atlas Copco</span>
              <span className="sm:hidden">AC</span>
            </Link>
          </div>

          {/* Center: Search (Desktop) */}
          {currentUser && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSearch}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                {/* Mobile Search */}
                <button
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                  aria-label="Search"
                >
                  <FaSearch className="text-gray-600" />
                </button>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Shopping cart"
                >
                  <GrCart className="text-gray-600" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {getCartCount() > 99 ? '99+' : getCartCount()}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <Link
                  to="/usernotifications"
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Notifications"
                >
                  <FaBell className="text-gray-600" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </Link>

                {/* User Profile */}
                <div className="relative user-profile-container">
                  <button
                    onClick={toggleDropdownVisibility}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {getInitial(currentUser.email)}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-700">
                      {currentUser.email.split('@')[0]}
                    </span>
                    <IoIosArrowDown className={`hidden lg:block text-xs transition-transform ${isDropdownVisible ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownVisible && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{currentUser.email}</p>
                        <p className="text-xs text-gray-500">Welcome back!</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/userprofile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsDropdownVisible(false)}
                        >
                          <FaUser className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          to="/orderhistory"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsDropdownVisible(false)}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Orders
                        </Link>
                        <Link
                          to="/saveditems"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsDropdownVisible(false)}
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          Saved Items
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={handlemove}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchExpanded && currentUser && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                className="block w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Categories Menu */}
      {isCategoriesVisible && currentUser && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Categories />
          </div>
        </div>
      )}
    </nav>
  );
}
