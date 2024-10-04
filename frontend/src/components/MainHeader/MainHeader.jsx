import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
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
      contrastText: '#232f3e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#232f3e', // Cor do fundo do Drawer
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
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& input': {
    padding: '10px 20px',
    color: theme.palette.primary.main,
  },
  width: '300px',
}));

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack spacing={2} direction="row">
        <AppBar position="static">
          <StyledToolbar>
            <Button component={Link} to="/" color="secondary">
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

            {isMobile ? (
              <IconButton color="inherit" onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
            ) : (
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
            )}
          </StyledToolbar>
        </AppBar>

        {/* Drawer para navegação em dispositivos móveis */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          }}
        >
          <div style={{ width: 250 }}>
            <IconButton onClick={toggleDrawer} sx={{ margin: '10px', color: theme.palette.secondary.main }}>
              <CloseIcon />
            </IconButton>
            <Divider />
            <List>
              <ListItem button component={Link} to="/products" onClick={toggleDrawer}>
                <ListItemText primary="Produtos" sx={{ color: theme.palette.primary.contrastText }} />
              </ListItem>
              <ListItem button component={Link} to="/about" onClick={toggleDrawer}>
                <ListItemText primary="Sobre" sx={{ color: theme.palette.primary.contrastText }} />
              </ListItem>
              <ListItem button component={Link} to="/contact" onClick={toggleDrawer}>
                <ListItemText primary="Contato" sx={{ color: theme.palette.primary.contrastText }} />
              </ListItem>
              <ListItem button component={Link} to="/perfil" onClick={toggleDrawer}>
                <ListItemText primary="Perfil" sx={{ color: theme.palette.primary.contrastText }} />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </Stack>
    </ThemeProvider>
  );
};

export default Header;
