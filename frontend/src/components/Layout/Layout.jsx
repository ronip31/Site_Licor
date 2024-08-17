import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="content">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
