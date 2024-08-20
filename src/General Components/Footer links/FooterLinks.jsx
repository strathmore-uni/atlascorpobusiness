import React from "react";
import { Link } from "react-router-dom";
import "./footerlinks.css";

export default function FooterLinks() {
  return (
    <div className="footer-links-container">
      <h4  >Quick Links</h4>
      <ul className="footer-links">
        <li className="footer_li" >
          <Link to="/products/Filterelement">Filter Element</Link>
        </li>
        <li  className="footer_li" >
          <Link to="/products/Oilfilterelement">Oil Filter Element</Link>
        </li>
        <li  className="footer_li" >
          <Link to="/products/Servkit">Serv Kit</Link>
        </li>
        <li  className="footer_li" >
          <Link to="/products/Autodrainvalve">Auto Drain Valve</Link>
        </li>
        <li  className="footer_li" >
          <Link to="/products/Contractor">Contractor</Link>
        </li>
        <li  className="footer_li" >
          <Link to="/products/Overhaulkit">Over Haul Kit</Link>
        </li>
        <li className="footer_li" >
          <Link to="/products/Silencerkit">Silencer Kit</Link>
        </li>
        <li className="footer_li" >
          <Link to="/products/Maintenancekit">Maintenance Kit</Link>
        </li>
        <li  className="footer_li" >
          <Link to="/products/Bearingkits">Bearing Kits</Link>
        </li>
        <li  className="footer_li" >
          <Link to="/products/Kitpm8k">KIT PM8K RS</Link>
        </li>
        <li className="footer_li" >
          <Link to="/products/energyrecovery">Energy Recovery</Link>
        </li>
        <li className="footer_li" >
          <Link to="/products/blowerpowerckt">Blower Power Ckt</Link>
        </li>
        <li className="footer_li" >
          <Link to="/products/blowerbearkingkit">Blower Bearing Kit</Link>
        </li>
        <li className="footer_li"  >
          <Link to="/products/Prevmain">Prev Main</Link>
        </li>
        <li className="footer_li" >
          <Link to="/products/Hrkit">Hr Kit</Link>
        </li>
        <li className="footer_li" >
          <Link to="/products/kitfilterdd">Kit Filter DD</Link>
        </li>
        <li className="footer_li" >
          <Link to="/products/kitfilterpd">Kit Filter PD</Link>
        </li>
        <li className="footer_li" >
          <Link to="/products/kitfilterddp">Kit Filter DDP</Link>
        </li>
        <li className="footer_li" >
          <Link to="/products/kitfilterud">Kit Filter UD</Link>
        </li>
      </ul>
    </div>
  );
}
