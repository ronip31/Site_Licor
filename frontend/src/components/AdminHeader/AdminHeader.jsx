import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
//import IconButton from '@mui/material/IconButton';
//import MenuIcon from '@mui/icons-material/Menu';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles'; 

const theme = createTheme({
  palette: {
    primary: {
      main: '#232f3e', // Azul mais escuro para um visual mais sofisticado
      light: '#5472d3',
      dark: '#002171',
      contrastText: '#ffffff', // Texto branco para contraste
    },
    secondary: {
      main: '#ffffff', // Rosa vibrante para contraste e destaque
      light: '#ff5983',
      dark: '#bb002f',
      contrastText: '#ffffff', // Texto branco para contraste
    },
    background: {
      default: '#f5f5f5', // Fundo claro e suave para evitar cansaço visual
    },
    text: {
      primary: '#ffffff', // Texto principal em um tom escuro
      secondary: '#757575', // Texto secundário em um tom mais claro
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Tipografia limpa e moderna
  },
});

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,   
}));

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove o token e qualquer outro dado de autenticação do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    // Redireciona o usuário para a página de login
    navigate('/loginadmin');
  };

  return (
    <Stack spacing={2} direction="row">
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <StyledToolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Painel administrador MeuSiteDeVendas
            </Typography>
            <div>
              <Button variant="text" component={Link} to="/admin" color="secondary">
                Dashboard
              </Button>
              <Button variant="text" component={Link} to="/admin/createproducts" color="secondary">
                Cadastro Produtos
              </Button>
              <Button variant="text" component={Link} to="/admin/creategrups" color="secondary">
                Cadastro Grupos
              </Button>
              <Button variant="text" component={Link} to="/admin/customerlist" color="secondary">
                Lista Clientes
              </Button>
              <Button variant="text" component={Link} to="/admin/orders" color="secondary">
                Pedidos realizados
              </Button>
              <Button variant="text" onClick={handleLogout} color="secondary">
                Logout
              </Button>

            </div>
          </StyledToolbar>
        </AppBar>
      </ThemeProvider>
    </Stack>
  );
};

export default AdminHeader;
