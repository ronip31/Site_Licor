import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
  TextField,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Ícone do carrinho

const theme = createTheme({
  palette: {
    primary: {
      main: '#232f3e',
    },
    secondary: {
      main: '#ffffff',
      contrastText: '#232f3e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  padding: '0 20px',
}));

const CenteredContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  flex: 1,
  justifyContent: 'center',
});

const SearchField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  borderRadius: '25px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '25px',
    '& fieldset': {
      borderColor: theme.palette.secondary.contrastText,
    },
  },
  width: '300px',
  '@media (max-width:600px)': {
    width: '200px', // Ajusta o tamanho do campo de busca em telas menores
  },
}));

const Header = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Função para atualizar o número de itens no carrinho
  const updateCartItemCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || { itens: [] };
    const totalItems = cart.itens.reduce((acc, item) => acc + item.quantidade, 0);
    setCartItemsCount(totalItems);
  };

  useEffect(() => {
    // Atualizar o número de itens no carrinho quando o componente é montado
    updateCartItemCount();

    // Adiciona um evento para escutar mudanças no localStorage
    window.addEventListener('storage', updateCartItemCount);

    // Remove o evento ao desmontar o componente
    return () => {
      window.removeEventListener('storage', updateCartItemCount);
    };
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <StyledToolbar>
          <Button component={Link} to="/" color="secondary" sx={{ fontSize: '1.2rem' }}>
            Casa dos Licores
          </Button>

          {!isMobile && (
            <CenteredContainer>
              <SearchField
                variant="outlined"
                placeholder="Buscar produtos..."
                size="small"
              />
            </CenteredContainer>
          )}

          <div>
            {!isMobile && (
              <>
                <Button component={Link} to="/about" color="secondary">
                  Sobre
                </Button>
                <Button component={Link} to="/contact" color="secondary">
                  Contato
                </Button>
                <Button component={Link} to="/perfil" color="secondary">
                  Perfil
                </Button>
              </>
            )}

            {/* Ícone do carrinho sempre visível */}
            <IconButton component={Link} to="/carrinho" color="inherit">
              <Badge badgeContent={cartItemsCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Ícone de menu para dispositivos móveis */}
            {isMobile && (
              <IconButton color="inherit" onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            )}
          </div>
        </StyledToolbar>
      </AppBar>

      {/* Drawer para navegação em dispositivos móveis */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <div style={{ width: 250 }}>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
          <Divider />
          <List>
            <ListItem button component={Link} to="/products" onClick={toggleDrawer}>
              <ListItemText primary="Produtos" />
            </ListItem>
            <ListItem button component={Link} to="/about" onClick={toggleDrawer}>
              <ListItemText primary="Sobre" />
            </ListItem>
            <ListItem button component={Link} to="/contact" onClick={toggleDrawer}>
              <ListItemText primary="Contato" />
            </ListItem>
            <ListItem button component={Link} to="/perfil" onClick={toggleDrawer}>
              <ListItemText primary="Perfil" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </ThemeProvider>
  );
};

export default Header;
