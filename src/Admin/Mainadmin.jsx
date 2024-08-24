import React from 'react';
import AdminCategory from './AdminCategory';

import Ordereditems from './Ordereditems';
import './admincategory.css'; 
import AdminDashboardSummary from './AdminDashboardSummary ';

export default function Mainadmin() {
  return (
    <div className='container_admin'>
      <AdminCategory />
      <div className="maincontainer_admin">
      
      <AdminDashboardSummary />
    
      </div>
    </div>
  );
}
