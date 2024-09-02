import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrCart } from "react-icons/gr";
import { FaBars } from "react-icons/fa";
import axios from "axios";
import { useAuth } from '../MainOpeningpage/AuthContext'; 
import { IoIosArrowDown } from "react-icons/io";
import Categories from "../Categories and Display page/Categories";
import "./Navigation.css";

export default function NavigationBar({ cartItems = [], guestEmail }) {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const categoriesRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || guestEmail);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const toggleDropdownVisibility = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

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

        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/user/notifications`, {
          params: { email: currentUser.email }
        });

        setNotifications(response.data);
        const unreadCount = response.data.filter(notification => !notification.read).length;
        setUnreadNotificationsCount(unreadCount);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const handleSearch = async () => {
    try {
      if (!currentUser) {
        console.error('No user email provided');
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/search`, {
        params: {
          term: searchQuery,
          email: currentUser.email
        }
      });

      setResults(response.data);

      const uniqueCategories = [...new Set(response.data.map(item => item.category))];
      setCategories(uniqueCategories);

      navigate(`/search?term=${searchQuery}`, { state: { results: response.data } });
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSignOut = async () => {
    signOut();
    console.log('User signed out successfully.');
    navigate('/signin');
    localStorage.removeItem('userEmail');
  };

  const handleBarsClick = () => {
    setIsCategoriesVisible(!isCategoriesVisible);
  };

  const handleCategoriesClose = () => {
    setIsCategoriesVisible(false);
  };

  const handleOutsideClick = (event) => {
    if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
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
    return email ? email.charAt(0).toUpperCase() : '';
  };

  const handlemove = () => {

    navigate('/signin')

  }
     

  return (
    <div className={`container_NavigationBar ${isScrolled ? "scrolled" : ""}`}>
      <div className="bars_nav" onClick={handleBarsClick}>
        <FaBars />
      </div>
     
      <Link style={{ textDecoration: 'none' }} to="/">
        <h3 className="title_h3">Atlas Copco - Kenya Web Shop</h3>
      </Link>
      
      <div className="div_search">
        <input
          className="input"
          name="text"
          type="search"
          value={searchQuery}
          placeholder="Search for Part Numbers or Names or Category"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      
      <div className="user-profile-container">
        {currentUser ? (
          <div className="user-profile" onClick={toggleDropdownVisibility}>
            <div className="profile-initial">{getInitial(currentUser.email)}</div>
            {isDropdownVisible && (
              <div className="dropdown-content">
                <div className="profile-initial-dropdown">{getInitial(currentUser.email)}</div>
                <small className='account_dropdown'>{currentUser.email}</small>
                <p>{currentUser.displayName || "User Name"}</p>
                <Link to='/userprofile'><p>User Profile</p></Link>
                <Link to='/orderhistory'><p>Order History</p></Link>
                <Link to='/saveditems'><p>Saved Items</p></Link>
                <small onClick={handleSignOut} className='logout_btn' >Log Out</small>
              </div>
            )}
          </div>
        ) : (
        

                 <button onClick={handlemove} className="sign_in_button" >
  Sign In
  <div class="arrow-wrapper">
    <div class="arrow"></div>
  </div>
</button>

           
          
       
          
          
        )}
      </div>
      
      <div className="wrapper_cart" >  
         <div className="notification-bell-nav">
        <Link to='/usernotifications' style={{textDecoration:'none'}} >
          <span className="bell-icon-nav">&#128276;</span>
          {unreadNotificationsCount > 0 && (
            <span className="notification-count-nav">{unreadNotificationsCount}</span>
          )}
        </Link>
      </div>

      <div>
      <Link to='/Cart' className="p_cart" style={{ textDecoration: 'none' }}>
          <GrCart className="icon_cart" />
          <span className="count">
            {cartItems.length === 0 ? "" : cartItems.length}
          </span>
          <small>Cart</small>
        </Link>
      </div>
      </div>
     

      
     
      

      {isCategoriesVisible && (
        <div ref={categoriesRef}>
          <Categories isVisible={isCategoriesVisible} onClose={handleCategoriesClose} />
        </div>
      )}
    </div>
  );
}
