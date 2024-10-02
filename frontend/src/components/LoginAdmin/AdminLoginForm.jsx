import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Button, TextField, Typography, Alert, Stack } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#232f3e',
    },
    secondary: {
      main: '#ffffff',
    },
    error: {
      main: '#6e8096',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      secondary: '#757575',
      third: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/admin/', {
        email,
        password: senha,
      });

      const token = response.data.access;

      // Armazena o token no localStorage
      localStorage.setItem('token', token);

      // Redireciona para a área de administração após login bem-sucedido
      navigate('/admin/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErrorMessage('Falha no login. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          padding: 3,
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Login Administrador
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <form onSubmit={handleLogin}>
          <Stack spacing={2} sx={{ width: '300px' }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              fullWidth
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Entrar
            </Button>
            <Button type="button" href="/esqueceu_senha" variant="contained" color="error" sx={{ ml: 2 }}>
              Esqueceu sua senha?
            </Button>
          </Stack>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLoginForm;
