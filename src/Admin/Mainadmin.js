import React from 'react';
import AdminCategory from './AdminCategory';
import Adminnav from './Adminnav';
import Ordereditems from './Ordereditems';
import './admincategory.css'; 

export default function Mainadmin() {
  return (
    <div>
      
      <div className="maincontainer_admin">
      <AdminCategory />
      <AdminDashboardSummary />
    
      </div>
    </div>
  );
}
