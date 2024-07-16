import React from 'react';
import AdminCategory from './AdminCategory';
import Adminnav from './Adminnav';
import Ordereditems from './Ordereditems';
import './admincategory.css'; // Ensure the CSS file is imported here

export default function Mainadmin() {
  return (
    <div>
      <Adminnav />
      <div className="maincontainer_admin">
      <AdminCategory />
        
    
      </div>
    </div>
  );
}
