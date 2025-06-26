import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrCart } from "react-icons/gr";
import { FaBars, FaSearch, FaBell, FaUser, FaCog, FaQuestionCircle, FaSignOutAlt, FaBoxOpen, FaHeart, FaEnvelope } from "react-icons/fa";
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
              {currentUser && (
                <button
                  className="sm:hidden ml-2 p-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Open categories menu"
                  onClick={() => setIsCategoriesVisible(true)}
                >
                  <FaBars className="text-lg" />
                </button>
              )}
            </div>

            {/* Center: Search (Desktop) */}
            {currentUser && (
              <div className="hidden md:flex flex-1 max-w-lg mx-8">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Search products, categories, or brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Search products"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label="Search"
                  >
                    <FaSearch className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {currentUser ? (
                <>
                  {/* Mobile Search Icon */}
                  <button
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setIsSearchExpanded((v) => !v)}
                    aria-label="Expand search bar"
                  >
                    <FaSearch className="text-gray-600" />
                  </button>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Shopping cart"
                  >
                    <GrCart className="text-gray-600 text-xl" />
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
                    <FaBell className="text-gray-600 text-lg" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                      </span>
                    )}
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative user-profile-container">
                    <button
                      onClick={() => setIsDropdownVisible((v) => !v)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
                      aria-label="User menu"
                      aria-haspopup="true"
                      aria-expanded={isDropdownVisible}
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-base">
                        {getInitial(currentUser.email)}
                      </div>
                      <span className="hidden lg:block text-sm font-medium text-gray-700">
                        Welcome, {getFirstName(currentUser.email)}
                      </span>
                      <IoIosArrowDown className={`hidden lg:block text-xs transition-transform ${isDropdownVisible ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownVisible && (
                      <div
                        ref={dropdownRef}
                        tabIndex={-1}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 focus:outline-none"
                        onKeyDown={e => { if (e.key === 'Escape') setIsDropdownVisible(false); }}
                      >
                        <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {getInitial(currentUser.email)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{currentUser.email}</div>
                            <div className="text-xs text-gray-500">{currentUser.email.split('@')[1]}</div>
                          </div>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/userprofile"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                            onClick={() => setIsDropdownVisible(false)}
                          >
                            <FaUser className="h-4 w-4" /> Profile
                          </Link>
                          <Link
                            to="/orderhistory"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                            onClick={() => setIsDropdownVisible(false)}
                          >
                            <FaBoxOpen className="h-4 w-4" /> Orders
                          </Link>
                          <Link
                            to="/saveditems"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                            onClick={() => setIsDropdownVisible(false)}
                          >
                            <FaHeart className="h-4 w-4" /> Saved Items
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                            onClick={() => setIsDropdownVisible(false)}
                          >
                            <FaCog className="h-4 w-4" /> Settings
                          </Link>
                          <a
                            href="mailto:support@atlascopco.com"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            <FaEnvelope className="h-4 w-4" /> Contact Us
                          </a>
                          <Link
                            to="/help"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                            onClick={() => setIsDropdownVisible(false)}
                          >
                            <FaQuestionCircle className="h-4 w-4" /> Help & Support
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <FaSignOutAlt className="h-4 w-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => navigate("/signin")}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  aria-label="Sign in"
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
                  placeholder="Search products, categories, or brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Search products"
                />
                <button
                  onClick={handleSearch}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label="Search"
                >
                  <FaSearch className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Categories Modal/Drawer */}
        {isCategoriesVisible && currentUser && (
          <div className="fixed inset-0 z-50 flex">
            <div className="bg-white w-80 max-w-full h-full shadow-xl p-6 overflow-y-auto animate-slide-in-left relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-blue-600 text-2xl focus:outline-none"
                onClick={() => setIsCategoriesVisible(false)}
                aria-label="Close categories menu"
              >
                &times;
              </button>
              <Categories />
            </div>
            <div className="flex-1 bg-black bg-opacity-30" onClick={() => setIsCategoriesVisible(false)}></div>
          </div>
        )}
      </nav>
    </>
  );
}
