import React, { useState } from "react";
import "./categories.css";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function Categories() {
  const [dropdowns, setDropdowns] = useState({
    filterElement: false,
    overhaulKit: false,
    prevMain: false,
    kitFilter: false,
  });

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products/${category}`);
  };

  const toggleDropdown = (dropdown) => {
    setDropdowns((prev) => ({ ...prev, [dropdown]: !prev[dropdown] }));
  };

  return (
    <div className="categories-container">
      <h3 style={{ color: "#0078a1" }}>Categories</h3>
      <ul className="listedproducts-categories">
        <li onClick={() => toggleDropdown("filterElement")}>
          Filter Element{" "}
          {dropdowns.filterElement ? (
            <IoIosArrowUp className="arrow" />
          ) : (
            <IoIosArrowDown className="arrow" />
          )}
        </li>
        {dropdowns.filterElement && (
          <ul className="dropdown-menu">
            <li onClick={() => handleCategoryClick("Filterelement")}>
              Filter Element
            </li>
            <li onClick={() => handleCategoryClick("Oilfilterelement")}>
              Oil Filter Element
            </li>
          </ul>
        )}
        <li onClick={() => handleCategoryClick("Servkit")}>Serv Kit</li>
        <li onClick={() => handleCategoryClick("Autodrainvalve")}>
          Auto Drain Valve
        </li>
        <li onClick={() => handleCategoryClick("Contractor")}>Contractor</li>
        <li onClick={() => toggleDropdown("overhaulKit")}>
          Over Haul Kit{" "}
          {dropdowns.overhaulKit ? (
            <IoIosArrowUp className="arrow" />
          ) : (
            <IoIosArrowDown className="arrow" />
          )}
        </li>
        {dropdowns.overhaulKit && (
          <ul className="dropdown-menu">
            <li onClick={() => handleCategoryClick("Overhaulkit")}>
              Over Haul Kit
            </li>
            <li onClick={() => handleCategoryClick("Silencerkit")}>
              Silencer Kit
            </li>
            <li onClick={() => handleCategoryClick("Maintenancekit")}>
              Maintenance Kit
            </li>
          </ul>
        )}
        <li onClick={() => handleCategoryClick("Bearingkits")}>Bearing Kits</li>
        <li onClick={() => handleCategoryClick("Kitpm8k")}>KIT PM8K RS</li>
        <li onClick={() => handleCategoryClick("energyrecovery")}>Energy Recovery</li>
        <li onClick={() => handleCategoryClick("blowerpowerckt")}> Blower Power Ckt</li>
        
        <li onClick={() => handleCategoryClick("blowerbearkingkit")}> Blower Bearing Kit</li>
        <li onClick={() => toggleDropdown("prevMain")}>
          Prev Main{" "}
          {dropdowns.prevMain ? (
            <IoIosArrowUp className="arrow" />
          ) : (
            <IoIosArrowDown className="arrow" />
          )}
        </li>
        {dropdowns.prevMain && (
          <ul className="dropdown-menu">
            <li onClick={() => handleCategoryClick("Prevmain")}>Prev Main</li>
            <li onClick={() => handleCategoryClick("Hrkit")}>Hr Kit</li>
          </ul>
        )}
        <li onClick={() => toggleDropdown("kitFilter")}>
          Kit Filter{" "}
          {dropdowns.kitFilter ? (
            <IoIosArrowUp className="arrow" />
          ) : (
            <IoIosArrowDown className="arrow" />
          )}
        </li>
        {dropdowns.kitFilter && (
          <ul className="dropdown-menu">
            <li onClick={() => handleCategoryClick("kitfilterdd")}>
              Kit Filter DD
            </li>
            <li onClick={() => handleCategoryClick("kitfilterpd")}>
              Kit Filter PD
            </li>
            <li onClick={() => handleCategoryClick("kitfilterddp")}>
              Kit Filter DDP
            </li>
            <li onClick={() => handleCategoryClick("kitfilterud")}>
              Kit Filter UD
            </li>
          </ul>
        )}
      </ul>
      
      
    </div>
  );
}
