import React, { useState, useEffect } from "react";
import "./Navigation.css";

import { IoSearchOutline } from "react-icons/io5";
import { Link} from "react-router-dom";
import { GrCart } from "react-icons/gr";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from "../constants";
export default function NavigationBar({cartItems=[]}) {
 
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
   

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/search?term=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }

  
  };
  const {t } = useTranslation();
  
  return (
    <div className={`container_NavigationBar ${isScrolled ? "scrolled" : ""}`}>
     <select defaultValue={"es"}>
        {LANGUAGES.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
      <Link to="/">
        <img  src=" public/logo2.0.jpg" alt="" />
      <h3 className="title_h3" >{t('Atlas Copco - Kenya Web Shop')}</h3>
      </Link>
<input  type="text"  placeholder={t("Search for Part Numbers or Serial Numbers" )}    className="search_input"   value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} />

<hr className="nav_hr_line" />


     <Link to='/Cart' style={{textDecoration:'none',color:'white'}} ><p className="p_cart" > <GrCart />    <span className="count">
            {" "}
            {cartItems.length === 0 ? "" : cartItems.length}{" "}
          </span>{" "}
 </p></Link> 
  
      <IoSearchOutline className="search_icon_navigation" onClick={handleSearch} />

      <ul style={{position:"absolute",top:'10rem'}} >
        {searchResults.map((result) => (
          <li key={result.id}>{result.Description}</li>
        ))}
      </ul>
    </div>
  );
}
