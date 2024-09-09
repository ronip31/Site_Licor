import { jwtDecode } from "jwt-decode";
import React from 'react';
import { Navigate } from 'react-router-dom';
import isTokenExpired from '../../utils/isTokenExpired';

const ProtectedRoute = ({ allowedRoles, component: Component  }) => {
  const token = localStorage.getItem('token');
  
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return <Navigate to="/loginadmin" />;
  }

  // Se desejar validar o tipo de usuário:
  const decodedToken = jwtDecode(token);
  if (allowedRoles && !allowedRoles.includes(decodedToken.tipo_usuario)) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default ProtectedRoute;
