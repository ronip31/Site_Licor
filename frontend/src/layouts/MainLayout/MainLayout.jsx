import React from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <MainHeader />
      <main className="content">
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
};

export default MainLayout;
