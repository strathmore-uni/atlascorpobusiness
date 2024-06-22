import React, { useState, useEffect, useContext } from "react";
import { IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { GrCart } from "react-icons/gr";
import axios from "axios";
import { ProductsContext } from "../MainOpeningpage/ProductsContext";
import { useAuth } from '../MainOpeningpage/AuthContext'; 
import { auth } from "../Firebase";
import { IoIosArrowDown } from "react-icons/io";
import { LuUser } from "react-icons/lu";
import "./Navigation.css";

export default function NavigationBar({ cartItems = [], guestEmail }) {
  const navigate = useNavigate();
  const { selectedCountry, setSelectedCountry, fetchProducts } = useContext(ProductsContext);
  const { currentUser, signOut } = useAuth();
  const countries = [
    { value: 'KE', label: 'Kenya' },
    { value: 'US', label: 'United States' },
    { value: 'UG', label: 'Uganda' },
    { value: 'TZ', label: 'Tanzania' },
  ];

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    fetchProducts(country); // Fetch products based on the new selected country
  };

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
 const engine= "https://104.154.57.31:3001"
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`${engine}/api/search?term=${searchQuery}`);
        setResults(response.data);
        // Extract categories from results
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
  }, [searchQuery]);

 
  const handleSearch = async () => {
    try {
      const response = await axios.get(`${engine}/api/search?term=${searchQuery}`);
      setResults(response.data);
      // Extract categories from results
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

  const SignOutUser = () => {
    auth.signOut()
      .then(() => {
        console.log('User signed out successfully.');
        localStorage.removeItem('guestEmail');
        navigate('/signin'); 
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };
  
  const handleSignOut = () => {
    SignOutUser();
  };

  const getEmail = () => {
    return currentUser ? currentUser.email : guestEmail;
  };

  return (
    <div className={`container_NavigationBar ${isScrolled ? "scrolled" : ""}`}>
    
      <Link to="/"><img src='./images/OIP.jpg' alt='' className='mylogoimage' /></Link>
      <Link to="/">
        <h3 className="title_h3">Atlas Copco - Kenya Web Shop</h3>
      </Link>
      <input
        className="input"
        name="text"
        type="search"
        value={searchQuery}
        placeholder="Search for Part Numbers or Names or Category"
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <hr className="nav_hr_line" />
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
              <span className="email">{getEmail()}</span><IoIosArrowDown />
              <div className="dropdown-content">
                <p>User Profile</p>
                <p onClick={handleSignOut}>Log Out</p>
              </div>
            </div>
          ) : (
            <p onClick={() => navigate('/signin')} className="sign-in-button">Sign In to Shop</p>
          )}
        </div>
      </div>
    
      <IoSearchOutline className="search_icon_navigation" onClick={handleSearch} />
    </div>
  );
}
