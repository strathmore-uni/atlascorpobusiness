import React, { useState, useEffect } from "react";
import "./Navigation.css";
import { IoPersonOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { Link} from "react-router-dom";
import { GrCart } from "react-icons/gr";
import axios from 'axios';

export default function NavigationBar({cartItems=[]}) {
 

  const countries = [
    { value: 'KE', label: 'Kenya' },
    { value: 'AF', label: 'Afghanistan' },
    { value: 'AU', label: 'Australia' },
    { value: 'BR', label: 'Brazil' },
    { value: 'CA', label: 'Canada' },
    { value: 'CN', label: 'China' },
    { value: 'EG', label: 'Egypt' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' },
    { value: 'IN', label: 'India' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'IT', label: 'Italy' },
    { value: 'JP', label: 'Japan' },
    { value: 'MX', label: 'Mexico' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'RU', label: 'Russia' },
    { value: 'SA', label: 'Saudi Arabia' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'KR', label: 'South Korea' },
    { value: 'ES', label: 'Spain' },
    { value: 'US', label: 'United States' }
  ];

  const [selectedCountry, setSelectedCountry] = useState('');

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  }


  
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
      const response = await axios.get(`http://localhost:3001/api/search?term=${searchQuery}`);
      setSearchResults(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error searching:', error);
    }

  
  };

  
  
  return (
    <div className={`container_NavigationBar ${isScrolled ? "scrolled" : ""}`}>
     
 
      <Link to="/">
     
      <h3 className="title_h3" >Atlas Copco - Kenya Web Shop</h3>
      </Link>
<input  type="text"  placeholder="Search for Part Numbers or Serial Numbers"     className="search_input"   value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} />

<hr className="nav_hr_line" />


     <Link to='/Cart' style={{textDecoration:'none',color:'white'}} ><p className="p_cart" > <GrCart />    <span className="count">
            {" "}
            {cartItems.length === 0 ? "" : cartItems.length}{" "}
          </span>{" "}
 </p></Link> 
<IoPersonOutline className="person_icon" />
 <select value={selectedCountry} onChange={handleCountryChange} className="select_country" >
      {countries.map((country) => (
        <option key={country.value} value={country.value}>
          {country.label}
        </option>
      ))}
    </select>
  
      <IoSearchOutline className="search_icon_navigation" onClick={handleSearch} />

      <ul style={{position:"absolute",top:'10rem'}} >
        {searchResults.map((result) => (
          <li key={result.id}>{result.Description}</li>
        ))}
      </ul>
    </div>
  );
}
