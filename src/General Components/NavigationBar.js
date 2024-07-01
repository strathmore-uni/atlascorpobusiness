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
  const [userEmail, setUserEmail] = useState(null);

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
            email: userEmail
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
  }, [searchQuery, userEmail]);

  const handleSearch = async () => {
    try {
      if (!userEmail) {
        console.error('No user email provided');
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_LOCAL}/api/search`, {
        params: {
          term: searchQuery,
          email: userEmail
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

  const getEmail = () => {
    return currentUser ? currentUser.email : guestEmail;
  };

  useEffect(() => {
    const storedUserEmail = localStorage.getItem('userEmail');
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    }
  }, []);

  return (
    <div className={`container_NavigationBar ${isScrolled ? "scrolled" : ""}`}>
      <Link to="/">
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
        <IoSearchOutline className="search_icon_navigation" onClick={handleSearch} />
      </div>
      <Link to='/Cart' style={{ textDecoration: 'none', color: 'white' }}>
        <p className="p_cart">
          <GrCart />
          <span className="count">
            {cartItems.length === 0 ? "" : cartItems.length}
          </span>
        </p>
      </Link>
      <div className="user-profile-container">
        <div className="user-profile">
          <LuUser className="person_icon" />
          {(currentUser || guestEmail) ? (
            <div className="dropdown">
              <span className="email">
                {getEmail()}
                {(currentUser || guestEmail) && <IoIosArrowDown className="nav_arrowdown" />}
              </span>
              <div className="dropdown-content">
                <Link to='/userprofile'><p>User Profile</p></Link>
                <Link to='/orderhistory' ><p>Order History</p></Link>
                <p onClick={handleSignOut}>Log Out</p>
              </div>
            </div>
          ) : (
            <p onClick={() => navigate('/signin')} className="sign-in-button">Sign In to Shop</p>
          )}
        </div>
      </div>
    </div>
  );
}
