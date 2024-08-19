import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import './AdminHeader.css';

const AdminHeader = () => {
  return (
    <header className="header">
      <div className="container">
        <h1>Painel administrador MeuSiteDeVendas</h1>
        <nav>
          <ul>
            <li>
              <Button component={Link} to="/admin" variant="contained" color="primary">
                Admin Login
              </Button>
            </li>
            <li>
              <Button component={Link} to="/admin/createproducts" variant="contained" color="primary">
                Cadastro Produtos
              </Button>
            </li>
            <li>
              <Button component={Link} to="/admin/creategrups" variant="contained" color="primary">
                Cadastro Grupos
              </Button>
            </li>
            <li>
              <Button component={Link} to="/admin/customerlist" variant="contained" color="primary">
                Lista Clientes
              </Button>
            </li>
            <li>
              <Button component={Link} to="/admin/Orders" variant="contained" color="primary">
                Pedidos realizados
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
