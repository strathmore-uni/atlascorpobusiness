import React, { useState, useEffect } from "react";
import "./Navigation.css";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { Link} from "react-router-dom";
import { GrCart } from "react-icons/gr";
import axios from 'axios';

export default function NavigationBar({cartItems=[]}) {
  const [compressorsappear, compressorsappearsetAppear] = useState();
  const [categoriesappear, categoriessetAppear] = useState();
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleCategoriesAppear = () => {
    categoriessetAppear(!categoriesappear);
  };

  const toggleCompressorAppear = () => {
    compressorsappearsetAppear(!compressorsappear);
  };

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

 
  return (
    <div className={`container_NavigationBar ${isScrolled ? "scrolled" : ""}`}>
      <Link to="/">
      <h3 className="title_h3" >Atlas Copco - Kenya Web Shop</h3>
      </Link>
<input  type="text"  placeholder="Search for Part Numbers or Serial Numbers"  className="search_input"   value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} />

<hr className="nav_hr_line" />
      <div
        className="products_li"
        onMouseEnter={toggleCategoriesAppear}
        onMouseLeave={toggleCategoriesAppear}
      >
    
          <small className="p_product">Filters  <IoIosArrowDown className="arrow_down_li" /></small>{" "}
          
       
          {categoriesappear && (
          <div className="listedproducts" >
          
            <Link to='/Shop/Filterelement' style={{ textDecoration: "none", color: "black" }}><li>Compressors</li></Link> 
            <Link to='/Shop/Heavy'style={{ textDecoration: "none", color: "black" }} ><li>HEAVY</li></Link> 
            <li>BIG</li>
            <li>HEAVY</li>
            <li>BIG</li>
            <li>HEAVY</li>
          </div>
        )}

      </div>

      <div     
      className="mycompressor"
      onMouseEnter={toggleCompressorAppear}
        onMouseLeave={toggleCompressorAppear}>

      <small className="li_compressor" >Compressor  <IoIosArrowDown className="arrow_down_li" /></small>

      {compressorsappear && (
          <div className="listedproductscompressor" >
          
            <Link to='/Shop/Filterelement' style={{ textDecoration: "none", color: "black" }}><li>Compressors</li></Link> 
            <Link to='/Shop/Heavy'style={{ textDecoration: "none", color: "black" }} ><li>HEAVY</li></Link> 
            <li>BIG</li>
            <li>HEAVY</li>
            <li>BIG</li>
            <li>HEAVY</li>
          </div>
        )}
      </div>
   

     <Link to='/Cart' style={{textDecoration:'none',color:'white'}} ><p className="p_cart" > <GrCart />  </p></Link> 
     <span className="count">
            {" "}
            {cartItems.length === 0 ? "" : cartItems.length}{" "}
          </span>{" "}

      <IoSearchOutline className="search_icon_navigation" onClick={handleSearch} />

      <ul style={{position:"absolute",top:'10rem'}} >
        {searchResults.map((result) => (
          <li key={result.id}>{result.Description}</li>
        ))}
      </ul>
    </div>
  );
}
