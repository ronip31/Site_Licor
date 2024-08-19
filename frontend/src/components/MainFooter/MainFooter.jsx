import React from 'react';
import './MainFooter.css';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';

const MainFooter = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2024 MeuSiteDeVendas. Todos os direitos reservados.</p>
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook style={{ color: '#4267B2', fontSize: '40px' }} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram style={{ color: '#C13584', fontSize: '40px' }} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter style={{ color: '#1DA1F2', fontSize: '40px' }} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
