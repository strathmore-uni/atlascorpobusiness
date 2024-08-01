// OrdersUsersMap.js
import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const OrdersUsersMap = ({ data }) => {
  const position = [0.5, 37.5]; // Centered around Eastern Africa

  const countryCoordinates = {
    Kenya: [-1.286389, 36.817223],
    Uganda: [0.313611, 32.581111],
    Tanzania: [-6.8, 39.283333],
    Rwanda: [-1.943889, 30.059444],
    Burundi: [-3.361944, 29.359444],
    Ethiopia: [9.033333, 38.7],
    Somalia: [2.041389, 45.343889],
    // Add more countries as needed
  };

  return (
    <div className="map-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  
  <rect width="100%" height="100%" fill="#f5f5f5" />


  <path
    d="M260,100 L290,140 L320,130 L350,160 L340,200 L300,230 L270,210 L250,250 L220,240 L200,270 L190,220 L160,210 L140,250 L130,270 L110,250 L100,270 L120,300 L140,320 L180,300 L200,330 L230,320 L260,350 L280,320 L310,330 L330,290 L350,320 L370,310 L390,340 L400,320 L420,340 L430,300 L460,290 L470,270 L460,240 L450,210 L440,180 L420,160 L410,140 L380,130 L360,110 L340,100 L310,80 L280,90 Z"
    fill="#ffeb3b"
    stroke="#000"
    strokeWidth="2"
  />

  
  <circle cx="200" cy="250" r="10" fill="red">
    <title>Data Point 1</title>
  </circle>
  <circle cx="300" cy="300" r="10" fill="blue">
    <title>Data Point 2</title>
  </circle>


  <text x="220" y="240" fill="black" font-size="16" font-family="Arial">Nairobi</text>

 
  <rect x="30" y="650" width="100" height="40" fill="#ffeb3b" stroke="#000" />
  <text x="140" y="670" fill="black" font-size="16" font-family="Arial">Kenya</text>
</svg>

      </svg>
    </div>
  );
};

export default OrdersUsersMap;
