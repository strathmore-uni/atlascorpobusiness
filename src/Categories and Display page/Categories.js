import React, { useState } from "react";
import "./categories.css";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function Categories() {
  const [compressorDropdown, setCompressorDropdown] = useState(false);
  const [prevmaincompressorDropdown, prevmainsetCompressorDropdown] = useState(false);
  const [overhaulcompressorDropdown, overhaulsetCompressorDropdown] = useState(false);
  const [kitfiltercompressorDropdown, kitfiltersetCompressorDropdown] = useState(false);

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
 
    navigate(`/products/${category}`);
  };
  

  return (
    <div className="Categories_container">
      <h3 style={{ color: "#0078a1" }}>Categories</h3>
      <div className="listedproducts_categories">
        <li onClick={() => setCompressorDropdown(!compressorDropdown)}>
          Filter Element{" "}
          {compressorDropdown ? <IoIosArrowUp className="arrowup" /> : <IoIosArrowDown className="arrowup"  />}{" "}
        </li>
        {compressorDropdown && (
          <ul className="compressor_dropdown_filter">
            <li onClick={() => handleCategoryClick('Filterelement')}>Filter Element</li>
            <li onClick={() => handleCategoryClick('Oilfilterelement')}>Oil Filter Element</li>

          </ul>
        )}
        <li onClick={() => handleCategoryClick('Servkit')}>Serv Kit</li>
        <li onClick={() => handleCategoryClick('Autodrainvalve')}>Auto Drain Valve</li>
        <li onClick={() => handleCategoryClick('Contractor')}>Contractor</li>
        <li onClick={() => overhaulsetCompressorDropdown(!overhaulcompressorDropdown)}>
          Over Haul Kit
          {overhaulcompressorDropdown ? <IoIosArrowUp  className="arrowup" /> : <IoIosArrowDown className="arrowup" />}
        </li>
        {overhaulcompressorDropdown && (
          <ul className="compressor_dropdown">
            <li onClick={() => handleCategoryClick('Overhaulkit')}>Over Haul Kit</li>
            <li onClick={() => handleCategoryClick('Silencerkit')}>Silencer Kit</li>
            <li onClick={() => handleCategoryClick('Maintenancekit')}>Maintenance Kit</li>
          </ul>
        )}
        <li onClick={() => handleCategoryClick('Bearingkits')}>Bearing Kits</li>
        <li onClick={() => prevmainsetCompressorDropdown(!prevmaincompressorDropdown)}>
          Prev Main
          {prevmaincompressorDropdown ? <IoIosArrowUp className="arrowup" /> : <IoIosArrowDown className="arrowup"/>}
        </li>
        {prevmaincompressorDropdown && (
          <ul className="compressor_dropdown">
            <li onClick={() => handleCategoryClick('Prevmain')}>Prev Main</li>
            <li onClick={() => handleCategoryClick('Hrkit')}>Hr Kit</li>
          </ul>
        )}
           <li onClick={() => kitfiltersetCompressorDropdown(!kitfiltercompressorDropdown)}>
           Kit Filter
          {kitfiltercompressorDropdown ? <IoIosArrowUp className="arrowup" /> : <IoIosArrowDown className="arrowup"/>}
        </li>
        {kitfiltercompressorDropdown && (
          <ul className="compressor_dropdown">
            <li onClick={() => handleCategoryClick('kitfilterdd')}>Kit filter dd</li>
            <li onClick={() => handleCategoryClick('kitfilterpd')}>Kit filter pd</li>
            <li onClick={() => handleCategoryClick('kitfilterddp')}>kit filter ddp</li>
            <li onClick={() => handleCategoryClick('kitfilterud')}>Kit filter ud</li>
          </ul>
        )}



      </div>
    </div>
  );
}
