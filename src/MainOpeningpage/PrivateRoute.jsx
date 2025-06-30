// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ path, element }) => {
  const { currentUser, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to signin if not authenticated
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return <Route path={path} element={element} />;
};

export default PrivateRoute;
