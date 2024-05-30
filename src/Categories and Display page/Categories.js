import React, { useState } from "react";
import "./categories.css";
import { Link } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import axios from "axios";

export default function Categories() {
  const [compressorDropdown, setCompressorDropdown] = useState(false);
  const [prevmaincompressorDropdown, prevmainsetCompressorDropdown] = useState(false);
  const [overhaulcompressorDropdown, overhaulsetCompressorDropdown] = useState(false);
  const [data] = useState([]);



  return (
    <div className="Categories_container">
      <h3 style={{ color: "#0078a1" }}>Categories</h3>
      <div className="listedproducts_categories">
        {data}
        <li onClick={() => setCompressorDropdown(!compressorDropdown)}>
          Filter Element{" "}
          {compressorDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}{" "}
        </li>
        {compressorDropdown && (
          <ul className="compressor_dropdown">
            <Link
              to="/Shop/Filterelement"
              style={{
                width: "13.5rem",
                padding: ".5rem",
                color: "black",
                textDecoration: "none",
              }}
            >
              {" "}
              <li>Filter Element</li>
            </Link>
            <Link
              to="/Shop/oilfilterelement"
              style={{
                width: "14rem",
                padding: ".5rem",
                textDecoration: "none",
                color: "black",
              }}
            >
              {" "}
              <li>Oil Filter Element</li>{" "}
            </Link>
          </ul>
        )}
        <Link
          to="/shop/servkit/"
          style={{ textDecoration: "none", color: "black" }}
        >
          {" "}
          <li>Serv Kit</li>
        </Link>{" "}
        <Link 
          to="/shop/autodrainvalve/"
          style={{ textDecoration: "none", color: "black" }}
        >
          {" "}
          <li>Auto Drain Valve</li>
        </Link>
      
        <Link 
          to="/shop/contractor"
          style={{ textDecoration: "none", color: "black" }}
        >
          {" "}
          <li>Contractor</li>
        </Link>
      
       
         
          <li  onClick={() => overhaulsetCompressorDropdown(!overhaulcompressorDropdown)}>Over Haul Kit
          {overhaulcompressorDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </li>
          
        {overhaulcompressorDropdown && (
          <ul className="compressor_dropdown">
            <Link
              to="/Shop/overhaulkit"
              style={{
                width: "13.5rem",
                padding: ".5rem",
                color: "black",
                textDecoration: "none",
              }}
            >
              {" "}
              <li>Over Haul Kit</li>
            </Link>
            <Link
              to="/Shop/silencerkit"
              style={{
                width: "14rem",
                padding: ".5rem",
                textDecoration: "none",
                color: "black",
              }}
            >
              {" "}
              <li>Silencer Kit</li>{" "}
            </Link>
            <Link
              to="/Shop/maintenancekit"
              style={{
                width: "14rem",
                padding: ".5rem",
                textDecoration: "none",
                color: "black",
              }}
            >
              {" "}
              <li>Maintenance Kit</li>{" "}
            </Link>
          </ul>
        )}
     
        <Link 
          to="/shop/bearingkits"
          style={{ textDecoration: "none", color: "black" }}
        >
          {" "}
          <li>Bearing Kits</li>
        </Link>
        
        <li  onClick={() => prevmainsetCompressorDropdown(!prevmaincompressorDropdown)}>
          Prev Main
          {prevmaincompressorDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}{" "}
          </li>
          {prevmaincompressorDropdown && (
          <ul className="compressor_dropdown">
            <Link
              to="/Shop/prevmain"
              style={{
                width: "13.5rem",
                padding: ".5rem",
                color: "black",
                textDecoration: "none",
              }}
            >
              {" "}
              <li>Prev Main</li>
            </Link>
            <Link
              to="/Shop/hrkit"
              style={{
                width: "14rem",
                padding: ".5rem",
                textDecoration: "none",
                color: "black",
              }}
            >
              {" "}
              <li>Hr Kit</li>{" "}
            </Link>
        
          </ul>
        )}




      </div>

    
    </div>
  );
}
