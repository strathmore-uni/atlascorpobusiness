import React from "react";
import { Link } from "react-router-dom";
// import "./footerlinks.css"; // Removed old CSS

export default function FooterLinks() {
  return (
    <nav aria-label="Footer Quick Links">
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
        <li>
          <Link to="/products/Filterelement" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Filter Element</Link>
        </li>
        <li>
          <Link to="/products/Oilfilterelement" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Oil Filter Element</Link>
        </li>
        <li>
          <Link to="/products/Servkit" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Serv Kit</Link>
        </li>
        <li>
          <Link to="/products/Autodrainvalve" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Auto Drain Valve</Link>
        </li>
        <li>
          <Link to="/products/Contractor" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Contractor</Link>
        </li>
        <li>
          <Link to="/products/Overhaulkit" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Over Haul Kit</Link>
        </li>
        <li>
          <Link to="/products/Silencerkit" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Silencer Kit</Link>
        </li>
        <li>
          <Link to="/products/Maintenancekit" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Maintenance Kit</Link>
        </li>
        <li>
          <Link to="/products/Bearingkits" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Bearing Kits</Link>
        </li>
        <li>
          <Link to="/products/Kitpm8k" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">KIT PM8K RS</Link>
        </li>
        <li>
          <Link to="/products/energyrecovery" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Energy Recovery</Link>
        </li>
        <li>
          <Link to="/products/blowerpowerckt" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Blower Power Ckt</Link>
        </li>
        <li>
          <Link to="/products/blowerbearkingkit" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Blower Bearing Kit</Link>
        </li>
        <li>
          <Link to="/products/Prevmain" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Prev Main</Link>
        </li>
        <li>
          <Link to="/products/Hrkit" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Hr Kit</Link>
        </li>
        <li>
          <Link to="/products/kitfilterdd" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Kit Filter DD</Link>
        </li>
        <li>
          <Link to="/products/kitfilterpd" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Kit Filter PD</Link>
        </li>
        <li>
          <Link to="/products/kitfilterddp" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Kit Filter DDP</Link>
        </li>
        <li>
          <Link to="/products/kitfilterud" className="block px-2 py-1 rounded hover:bg-blue-100 hover:text-blue-800 transition">Kit Filter UD</Link>
        </li>
      </ul>
    </nav>
  );
}
