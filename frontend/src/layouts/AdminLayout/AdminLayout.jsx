import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader/AdminHeader';
import AdminFooter from '../../components/AdminFooter/AdminFooter';
import './AdminLayout.css';

const MainLayout = () => {
  return (
    <div className="layout">
      <AdminHeader />
      <main className="content">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};


export default MainLayout;
