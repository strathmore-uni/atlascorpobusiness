import React, { useState,useRef } from "react";
import "./categories.css";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Categories() {
  const [dropdowns, setDropdowns] = useState({
    filterElement: false,
    overhaulKit: false,
    prevMain: false,
    kitFilter: false,
  });

  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const navigate = useNavigate();

  const categoriesRef = useRef(null);
  const handleCategoryClick = (category) => {
    navigate(`/products/${category}`);
    setIsCategoriesVisible(false); // Close the categories when a category is selected
  };

  const toggleDropdown = (dropdown) => {
    setDropdowns((prev) => ({ ...prev, [dropdown]: !prev[dropdown] }));
  };

  const toggleCategoriesVisibility = () => {
    setIsCategoriesVisible(!isCategoriesVisible);
  };

  return (
    <div className={`categories-container ${isCategoriesVisible ? 'visible' : ''}`}   ref={categoriesRef}>
    
      <button className="categories-toggle" onClick={toggleCategoriesVisibility}>
        <FaBars />
      </button>
      <div className={`categories-list ${isCategoriesVisible ? 'visible' : ''}`}>
        <button className="close-button" onClick={() => setIsCategoriesVisible(false)}>
          <FaTimes />
        </button>
        <h3 style={{ color: "#0078a1" }}>Categories</h3>
        <ul className="listedproducts-categories">
          <li key="filterElement">
            <span onClick={() => toggleDropdown("filterElement")}>
              Filter Element{" "}
              {dropdowns.filterElement ? (
                <IoIosArrowUp className="arrow" />
              ) : (
                <IoIosArrowDown className="arrow" />
              )}
            </span>
            {dropdowns.filterElement && (
              <ul className="dropdown-menu">
                <li key="Filterelement" onClick={() => handleCategoryClick("Filterelement")}>
                  Filter Element
                </li>
                <li key="Oilfilterelement" onClick={() => handleCategoryClick("Oilfilterelement")}>
                  Oil Filter Element
                </li>
              </ul>
            )}
          </li>
          <li onClick={() => handleCategoryClick("Servkit")}>Serv Kit</li>
          <li onClick={() => handleCategoryClick("Autodrainvalve")}>Auto Drain Valve</li>
          <li onClick={() => handleCategoryClick("Contractor")}>Contractor</li>
          <li key="overhaulKit">
            <span onClick={() => toggleDropdown("overhaulKit")}>
              Over Haul Kit{" "}
              {dropdowns.overhaulKit ? (
                <IoIosArrowUp className="arrow" />
              ) : (
                <IoIosArrowDown className="arrow" />
              )}
            </span>
            {dropdowns.overhaulKit && (
              <ul className="dropdown-menu">
                <li key="Overhaulkit" onClick={() => handleCategoryClick("Overhaulkit")}>
                  Over Haul Kit
                </li>
                <li key="Silencerkit" onClick={() => handleCategoryClick("Silencerkit")}>
                  Silencer Kit
                </li>
                <li key="Maintenancekit" onClick={() => handleCategoryClick("Maintenancekit")}>
                  Maintenance Kit
                </li>
              </ul>
            )}
          </li>
          <li onClick={() => handleCategoryClick("Bearingkits")}>Bearing Kits</li>
          <li onClick={() => handleCategoryClick("Kitpm8k")}>KIT PM8K RS</li>
          <li onClick={() => handleCategoryClick("energyrecovery")}>Energy Recovery</li>
          <li onClick={() => handleCategoryClick("blowerpowerckt")}>Blower Power Ckt</li>
          <li onClick={() => handleCategoryClick("blowerbearkingkit")}>Blower Bearing Kit</li>
          <li key="prevMain">
            <span onClick={() => toggleDropdown("prevMain")}>
              Prev Main{" "}
              {dropdowns.prevMain ? (
                <IoIosArrowUp className="arrow" />
              ) : (
                <IoIosArrowDown className="arrow" />
              )}
            </span>
            {dropdowns.prevMain && (
              <ul className="dropdown-menu">
                <li onClick={() => handleCategoryClick("Prevmain")}>Prev Main</li>
                <li onClick={() => handleCategoryClick("Hrkit")}>Hr Kit</li>
              </ul>
            )}
          </li>
          <li key="kitFilter">
            <span onClick={() => toggleDropdown("kitFilter")}>
              Kit Filter{" "}
              {dropdowns.kitFilter ? (
                <IoIosArrowUp className="arrow" />
              ) : (
                <IoIosArrowDown className="arrow" />
              )}
            </span>
            {dropdowns.kitFilter && (
              <ul className="dropdown-menu">
                <li onClick={() => handleCategoryClick("kitfilterdd")}>Kit Filter DD</li>
                <li onClick={() => handleCategoryClick("kitfilterpd")}>Kit Filter PD</li>
                <li onClick={() => handleCategoryClick("kitfilterddp")}>Kit Filter DDP</li>
                <li onClick={() => handleCategoryClick("kitfilterud")}>Kit Filter UD</li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
