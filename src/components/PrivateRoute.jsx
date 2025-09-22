import React from 'react';
import { Navigate } from 'react-router-dom';

// Tenta obter o token de autenticação do armazenamento local (localStorage)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  
  if (token) {
    return children;
  }
  
  return <Navigate to="/" />;
};

export default PrivateRoute;