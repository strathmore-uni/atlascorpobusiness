import React, { useState, useEffect } from 'react';
import './notification.css';

const Notification = ({ message,failure_message }) => {
  const [isVisiblesuccess, setIsVisiblesuccess] = useState(false);
  const [isVisiblefailure, setIsVisiblefailure] = useState(false);
  useEffect(() => {
    setIsVisiblesuccess(true);

    const timeout = setTimeout(() => {
      setIsVisiblesuccess(false);
    }, 3000); // Duration for the notification to be visible (3 seconds in this example)

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setIsVisiblefailure(true);

    const timeout = setTimeout(() => {
      setIsVisiblefailure(false);
    }, 3000); // Duration for the notification to be visible (3 seconds in this example)

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div >
      <div className={`notification ${isVisiblesuccess ? 'show' : ''}`} >

        {message}
      </div>
      <div className={`failure_notification ${isVisiblefailure ? 'show' : ''}`} >
        {failure_message}
      </div>
      
    </div>
  );
};

export default Notification;
