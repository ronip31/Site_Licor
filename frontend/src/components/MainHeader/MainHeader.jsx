import React from 'react';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
//import './MainHeader.css';
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
      main: '#ffffff',
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

const Header = () => {
  return (
    <Stack spacing={2} direction="row">
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <StyledToolbar>

              <Button component={Link} to="/" color="secondary">  
                MeuSiteDeVendas
              </Button>
              <div>
              <Button component={Link} to="/products" color="secondary">
                Produtos
              </Button>
              <Button component={Link} to="/about" color="secondary">
                Sobre
              </Button>
              <Button component={Link} to="/contact" color="secondary">
                Contato
              </Button>
              <Button component={Link} to="/perfil" color="secondary">
                Perfil
              </Button>
              </div>
          </StyledToolbar>
        </AppBar>
      </ThemeProvider>
    </Stack>
  );
};

export default Header;
