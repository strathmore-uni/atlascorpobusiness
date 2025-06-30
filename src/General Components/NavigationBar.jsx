import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrCart } from "react-icons/gr";
import { FaBars, FaSearch, FaBell, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaBoxOpen, FaHeart, FaEnvelope } from "react-icons/fa";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../MainOpeningpage/AuthContext";
import { useTheme } from "../ThemeProvider";
import { IoIosArrowDown } from "react-icons/io";
import Categories from "../Categories and Display page/Categories";
// import "./Navigation.css"; // Removed old CSS

export default function NavigationBar({ guestEmail }) {
  const navigate = useNavigate();
  const { currentUser, IsAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  // For accessibility: focus trap for dropdown
  const dropdownRef = useRef(null);

  const toggleDropdownVisibility = () => setIsDropdownVisible(!isDropdownVisible);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isDropdownVisible &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
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

        const response = await axiosInstance.get(
          `/api/user/notifications`,
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

      const response = await axiosInstance.get(
        `/api/search`,
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
    // This will be handled by Redux auth slice
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

  const getFirstName = (email) => email ? email.split("@")[0].split(".")[0] : "";

  // Accessibility: keyboard navigation for dropdown
  useEffect(() => {
    if (isDropdownVisible && dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, [isDropdownVisible]);

  return (
    <>
      {/* Glassmorphism Navbar */}
      <nav className={`z-50 w-full sticky top-0 border-b border-gray-100 bg-white/70 backdrop-blur-lg shadow-sm transition-all duration-300 ${isScrolled ? "shadow-lg" : "shadow-sm"}`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo & FAB Categories (mobile) */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-blue-900 font-bold text-xl hover:opacity-80 transition-opacity">
                <span className="hidden sm:inline">Atlas Copco</span>
                <span className="sm:hidden">AC</span>
              </Link>
              {/* Floating Categories Button (FAB) on mobile */}
              {IsAuthenticated && (
                <button
                  className="sm:hidden ml-2 p-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Open categories menu"
                  onClick={() => setIsCategoriesVisible(true)}
                >
                  <FaBars className="text-lg" />
                </button>
              )}
            </div>

            {/* Center: Search Bar (desktop) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSearch}
                  className="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  <FaSearch className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              {/* Search Button (mobile) */}
              <button
                className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                aria-label="Search"
              >
                <FaSearch className="h-5 w-5 text-gray-600" />
              </button>

              {/* Cart */}
              {IsAuthenticated && (
                <Link
                  to="/cart"
                  className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Shopping cart"
                >
                  <GrCart className="h-6 w-6 text-gray-600" />
                  {/* Cart count will be implemented when Redux is properly set up */}
                </Link>
              )}

              {/* Notifications */}
              {IsAuthenticated && (
                <button
                  className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Notifications"
                >
                  <FaBell className="h-5 w-5 text-gray-600" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
              )}

              {/* User Menu */}
              {IsAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdownVisibility}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="User menu"
                    aria-expanded={isDropdownVisible}
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitial(currentUser?.email)}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {getFirstName(currentUser?.email)}
                    </span>
                    <IoIosArrowDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownVisible && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to="/userprofile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownVisible(false)}
                      >
                        <FaUser className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        to="/orderhistory"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownVisible(false)}
                      >
                        <FaBoxOpen className="h-4 w-4" />
                        Order History
                      </Link>
                      <Link
                        to="/saveditems"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownVisible(false)}
                      >
                        <FaHeart className="h-4 w-4" />
                        Saved Items
                      </Link>
                      <Link
                        to="/usernotifications"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownVisible(false)}
                      >
                        <FaBell className="h-4 w-4" />
                        Notifications
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <FaSignOutAlt className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchExpanded && (
            <div className="md:hidden pb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSearch}
                  className="absolute inset-y-0 right-0 px-3 flex items-center bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  <FaSearch className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Categories Sidebar */}
      {isCategoriesVisible && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleCategoriesClose} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl" ref={categoriesRef}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                <button
                  onClick={handleCategoriesClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaBars className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            <Categories onClose={handleCategoriesClose} />
          </div>
        </div>
      )}
    </>
  );
}
