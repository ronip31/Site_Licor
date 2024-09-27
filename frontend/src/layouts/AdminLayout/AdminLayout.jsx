import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader/AdminHeader';
import './AdminLayout.css';

const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false); // Inicialmente aberto

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className={`layout ${drawerOpen ? '' : 'drawer-closed'}`}>
      <AdminHeader drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
