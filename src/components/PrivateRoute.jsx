import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    return children;
  }
  
  return <Navigate to="/" />;
};

export default PrivateRoute;