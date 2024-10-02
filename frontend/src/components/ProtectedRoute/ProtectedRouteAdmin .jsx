import React from 'react';
import { Navigate } from 'react-router-dom';
import isTokenExpired from '../../utils/isTokenExpired'; // Função para verificar se o token está expirado

const ProtectedRouteAdmin = ({ component: Component }) => {
  const token = localStorage.getItem('token');

  // Verifica se o token existe e se está expirado
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/loginadmin" />; // Redireciona para o login se o token não estiver válido
  }

  // Token é válido, renderiza o componente solicitado
  return <Component />;
};

export default ProtectedRouteAdmin;
