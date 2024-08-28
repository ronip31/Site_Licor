import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticatedAndAdmin = () => {
  const token = localStorage.getItem('token');
  const tipo_usuario = localStorage.getItem('tipo_usuario');
  return token && tipo_usuario === 'administrador';
};

const AdminRoute = () => {
  return isAuthenticatedAndAdmin() ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
