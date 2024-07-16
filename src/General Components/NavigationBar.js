import React, { useState, useEffect } from "react";
import { IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { GrCart } from "react-icons/gr";
import axios from "axios";
import { useAuth } from '../MainOpeningpage/AuthContext'; 
import { auth } from "../Firebase";
import { LuUser } from "react-icons/lu";
import "./Navigation.css";
import { IoIosArrowDown } from "react-icons/io";

export default function NavigationBar({ cartItems = [], guestEmail }) {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || guestEmail);

  const toggleDropdownVisibility = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        if (!userEmail) {
          console.error('No user email provided');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/search`, {
          params: {
            term: searchQuery,
            email:  currentUser.email
          }
        });

        setResults(response.data);

        const uniqueCategories = [...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error searching:', error);
      }
    };

    if (searchQuery.trim() !== '') {
      fetchSearchResults();
    } else {
      setResults([]);
      setCategories([]);
    }
  }, [searchQuery, currentUser]);

  const handleSearch = async () => {
    try {
      if (!currentUser) {
        console.error('No user email provided');
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/search`, {
        params: {
          term: searchQuery,
          email:  currentUser.email
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

  const handleSignOut = () => {
    signOut();
    console.log('User signed out successfully.');
    navigate('/signin');
    localStorage.removeItem('userEmail');
  };



  

  return (
    <div className={`container_NavigationBar ${isScrolled ? "scrolled" : ""}`}>
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
      <div className="mycart">
        <Link to='/Cart' className="p_cart" style={{ textDecoration: 'none' }}>
          <GrCart className="icon_cart" />
          <span className="count">
            {cartItems.length === 0 ? "" : cartItems.length}
          </span>
          <small>Cart</small>
        </Link>
      </div>
      <div className="user-profile-container" onClick={toggleDropdownVisibility}>
        <div className="user-profile">
          <LuUser className="person_icon" />
          <div className="dropdown">
            <span className="email">
            {currentUser ? currentUser.email : "Account"}
              <IoIosArrowDown className="nav_arrowdown" />
            </span>
            {isDropdownVisible && (
              <div className="dropdown-content">
                <Link to='/userprofile'><p>User Profile</p></Link>
                <Link to='/orderhistory'><p>Order History</p></Link>
                <Link to='/saveditems'><p>Saved Items</p></Link>
                <p onClick={handleSignOut}>Log Out</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
