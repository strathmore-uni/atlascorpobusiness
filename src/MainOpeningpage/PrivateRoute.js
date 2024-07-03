// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ path, element }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Route path={path} element={element} /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
