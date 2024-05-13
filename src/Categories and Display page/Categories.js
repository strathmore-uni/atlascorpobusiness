import React, { useState } from "react";
import "./categories.css";
import { Link } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";



export default function Categories({ fulldatas}) {
  const [compressorDropdown, setCompressorDropdown] = useState(false);

 

  return (
    <div className="Categories_container">
      <div className="listedproducts_categories">
        <Link
          to="/Shop/Big"
          style={{ textDecoration: "none", color: "black" }}
          onClick={() => setCompressorDropdown(!compressorDropdown)}
        >
          {" "}
          <li>
            Compressors{" "}
            {compressorDropdown ? (
              <IoIosArrowUp  />
            ) : (
              <IoIosArrowDown  />
            )}{" "}
          </li></Link>
        {compressorDropdown && (
          <ul className="compressor_dropdown">
            <li style={{width:'13.5rem',padding:'.5rem'}} >Rotary Screw Air Compressors</li>
            <Link to='/Shop/Big/Oilfreecompressor'  >
              <li  style={{width:'14rem',padding:'.5rem'}} >Oil-free compressors</li> </Link>
            <li  style={{width:'14rem',padding:'.5rem'}}>Piston Compressors</li>
          </ul>
        )}
        <Link
          to="/Shop/Heavy"
          style={{ textDecoration: "none", color: "black" }}
        >
          {" "}
          <li>Heavy</li>
        </Link>{" "}
        <li>BIG</li>
        <li>HEAVY</li>
        <li>BIG</li>
        <li>HEAVY</li>
      </div>
    
    </div>
  );
}