import React from 'react';
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
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
    borderRadius: '25px', // Garante que a borda externa também seja arredondada
    '& fieldset': {
      borderColor: theme.palette.secondary.contrastText,
      borderRadius: '25px', // Arredonda as bordas da borda do campo
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
  return (
    <Stack spacing={2} direction="row">
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <StyledToolbar>
            <Button component={Link} to="/" color="secondary">
              Casa dos Licores
            </Button>

            <CenteredContainer>
              <SearchField
                variant="outlined"
                placeholder="Buscar produtos..."
                size="small"
              />
            </CenteredContainer>

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
