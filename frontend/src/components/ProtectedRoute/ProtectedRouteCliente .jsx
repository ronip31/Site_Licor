import { jwtDecode } from "jwt-decode";
import React from 'react';
import { Navigate } from 'react-router-dom';
import isTokenExpired from '../../utils/isTokenExpired';

const ProtectedRouteCliente = ({ component: Component }) => {
  const token = localStorage.getItem('token');
  
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return <Navigate to="/login" />;
  }

  // Decodifica o token para verificar o tipo de usuário
  const decodedToken = jwtDecode(token);
  if (decodedToken.tipo_usuario !== 'cliente') {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default ProtectedRouteCliente;
