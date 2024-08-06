import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WarehouseCategory from './WarehouseCategory';
import { useAuth } from '../MainOpeningpage/AuthContext';

const Dashboard = () => {
    const { currentUser } = useAuth();
  const [summary, setSummary] = useState({
  
    pendingOrders: [],
   
  });


  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [
    
          pendingOrdersResponse,
       
        ] = await Promise.all([

         
          axios.get(`${process.env.REACT_APP_LOCAL}/api/admin/orders/pending`, { params: { email: currentUser.email } }),
        
        ]);


        setSummary({
          
          pendingOrders: pendingOrdersResponse.data.sort(sortByDateDescending),
         
        });
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
  }, [currentUser]);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Inventory Summary</h2>
        {/* Display inventory summary */}
        <pre>{JSON.stringify(summary.pendingOrdersResponse, null, 2)}</pre>
      </div>
      <div>
        <h2>Order Summary</h2>
        {/* Display order summary */}
        <pre>{JSON.stringify(summary.pendingOrdersResponse, null, 2)}</pre>
      </div>
      <WarehouseCategory />
    </div>
  );
};

export default Dashboard;
