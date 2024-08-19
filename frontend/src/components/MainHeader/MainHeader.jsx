import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import './MainHeader.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <h1>MeuSiteDeVendas</h1>
        <nav>
          <ul>
            <li>
              <Button component={Link} to="/" variant="contained" color="primary">
                Home
              </Button>
            </li>
            <li>
              <Button component={Link} to="/products" variant="contained" color="primary">
                Produtos
              </Button>
            </li>
            <li>
              <Button component={Link} to="/about" variant="contained" color="primary">
                Sobre
              </Button>
            </li>
            <li>
              <Button component={Link} to="/contact" variant="contained" color="primary">
                Contato
              </Button>
            </li>
            <li>
              <Button component={Link} to="/perfil" variant="contained" color="primary">
                Perfil
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
