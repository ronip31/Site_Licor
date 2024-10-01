import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  CssBaseline,
  Tooltip,
  Collapse,
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DiscountIcon from '@mui/icons-material/Discount';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const theme = createTheme({
  palette: {
    primary: {
      main: '#232f3e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: 13,
  },
});

const drawerWidth = 235;
const drawerWidthClosed = 50;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, -1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const AdminHeader = ({ drawerOpen, toggleDrawer }) => {
  const [openCadastros, setOpenCadastros] = useState(false); // Estado para controlar submenu
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/loginadmin');
  };

  const handleToggleCadastros = () => {
    setOpenCadastros(!openCadastros); // Alterna o estado de expansão do submenu "Cadastros"
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ marginRight: 2 }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Painel Administrador Casa dos Licores
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerOpen ? drawerWidth : drawerWidthClosed,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            height: '100vh',
            width: drawerOpen ? drawerWidth : drawerWidthClosed,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: drawerOpen ? 'auto' : 'hidden',
            overflowY: 'auto',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawer} sx={{ paddingLeft: 0 }}>
            {drawerOpen ? (
              <ChevronLeftIcon sx={{ color: theme.palette.secondary.main }} />
            ) : (
              <MenuIcon sx={{ color: theme.palette.secondary.main }} />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />
        <List>
          <ListItem button component={Link} to="/admin">
            <Tooltip title="Home" placement="right" disableHoverListener={drawerOpen}>
              <ListItemIcon>
                <HomeIcon sx={{ color: theme.palette.secondary.main }} />
              </ListItemIcon>
            </Tooltip>
            {drawerOpen && <ListItemText primary="Home" />}
          </ListItem>
          <ListItem button component={Link} to="/admin/customerlist">
            <Tooltip title="Lista Clientes" placement="right" disableHoverListener={drawerOpen}>
              <ListItemIcon>
                <PeopleIcon sx={{ color: theme.palette.secondary.main }} />
              </ListItemIcon>
            </Tooltip>
            {drawerOpen && <ListItemText primary="Lista Clientes" />}
          </ListItem>
          <ListItem button component={Link} to="/admin/orders">
            <Tooltip title="Pedidos Realizados" placement="right" disableHoverListener={drawerOpen}>
              <ListItemIcon>
                <ShoppingCartIcon sx={{ color: theme.palette.secondary.main }} />
              </ListItemIcon>
            </Tooltip>
            {drawerOpen && <ListItemText primary="Pedidos Realizados" />}
          </ListItem>
          <Divider />

          {/* Menu "Cadastros" */}
          <ListItem button onClick={handleToggleCadastros}>
          <Tooltip title="Abrir Cadastros" placement="right" disableHoverListener={drawerOpen}>
            <ListItemIcon>
              <AppRegistrationIcon sx={{ color: theme.palette.secondary.main }} />
            </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Cadastros" />
            {openCadastros ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openCadastros} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button component={Link} to="/admin/createproducts">
                <ListItemIcon>
                  <CategoryIcon sx={{ color: theme.palette.secondary.main }} />
                </ListItemIcon>
                <ListItemText primary="Produtos" />
              </ListItem>
              <ListItem button component={Link} to="/admin/categorybrand">
                <ListItemIcon>
                  <CategoryIcon sx={{ color: theme.palette.secondary.main }} />
                </ListItemIcon>
                <ListItemText primary="Categorias/Marcas" />
              </ListItem>
              <ListItem button component={Link} to="/admin/createpromotion">
                <ListItemIcon>
                  <LocalOfferIcon sx={{ color: theme.palette.secondary.main }} />
                </ListItemIcon>
                <ListItemText primary="Promoções" />
              </ListItem>
              <ListItem button component={Link} to="/admin/createcupons">
                <ListItemIcon>
                  <DiscountIcon sx={{ color: theme.palette.secondary.main }} />
                </ListItemIcon>
                <ListItemText primary="Cupons" />
              </ListItem>
              <ListItem button component={Link} to="/admin/editcarousel">
                <ListItemIcon>
                  <DiscountIcon sx={{ color: theme.palette.secondary.main }} />
                </ListItemIcon>
                <ListItemText primary="Carrossel" />
              </ListItem>
            </List>
          </Collapse>

          <Divider />
          <ListItem button component={Link} to="/admin/DeliveryConfig">
            <Tooltip title="Configuração Entrega" placement="right" disableHoverListener={drawerOpen}>
              <ListItemIcon>
                <LocalShippingIcon sx={{ color: theme.palette.secondary.main }} />
              </ListItemIcon>
            </Tooltip>
            {drawerOpen && <ListItemText primary="Configuração Entrega" />}
          </ListItem>
          <ListItem button component="a" href="/" target="_blank" rel="noopener noreferrer">
            <Tooltip title="Acessar Site de Venda" placement="right" disableHoverListener={drawerOpen}>
              <ListItemIcon>
                <StoreIcon sx={{ color: theme.palette.secondary.main }} />
              </ListItemIcon>
            </Tooltip>
            {drawerOpen && <ListItemText primary="Acessar Site de Venda" />}
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <Tooltip title="Logout" placement="right" disableHoverListener={drawerOpen}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: theme.palette.secondary.main }} />
              </ListItemIcon>
            </Tooltip>
            {drawerOpen && <ListItemText primary="Logout" />}
          </ListItem>
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

export default AdminHeader;
