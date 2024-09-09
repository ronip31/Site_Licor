import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles'; 

const theme = createTheme({
  palette: {
    primary: {
      main: '#232f3e',
      light: '#5472d3',
      dark: '#002171',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      light: '#ff5983',
      dark: '#bb002f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#ffffff',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column', 
  alignItems: 'flex-start',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(1),
}));

const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/loginadmin');
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <StyledToolbar>
          {/* Primeira linha: Título e alguns botões */}
          <HeaderRow>
            <Typography variant="h6" component={Link} to="/admin" color="secondary" sx={{ textDecoration: 'none' }}>
              Painel Administrador Casa dos Licores
            </Typography>
            <Box>
              <Button variant="text" component={Link} to="/admin/customerlist" color="secondary">
                Lista Clientes
              </Button>
              <Button variant="text" component={Link} to="/admin/orders" color="secondary">
                Pedidos realizados
              </Button>
              <Button
                variant="text"
                component="a"
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                color="secondary"
              >
                Acessar site de venda
              </Button>
              <Button variant="text" onClick={handleLogout} color="secondary">
                Logout
              </Button>
            </Box>
          </HeaderRow>

          {/* Segunda linha: Botões de cadastro */}
          <ButtonContainer>
            <Button variant="text" component={Link} to="/admin/createproducts" color="secondary">
              Cadastro Produtos
            </Button>
            <Button variant="text" component={Link} to="/admin/creategrups" color="secondary">
              Cadastro Categorias/Marcas
            </Button>
            <Button variant="text" component={Link} to="/admin/createpromotion" color="secondary">
              Cadastro Promocoes
            </Button>
            <Button variant="text" component={Link} to="/admin/createcupons" color="secondary">
              Cadastro Cupons
            </Button>
            <Button variant="text" component={Link} to="/admin/DeliveryConfig" color="secondary">
              Configuração Entrega
            </Button>
          </ButtonContainer>
        </StyledToolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default AdminHeader;
