import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Button,
  useMediaQuery,
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import api from '../../utils/api';

const theme = createTheme({
  palette: {
    primary: { main: '#232f3e' },
    secondary: { main: '#ffffff', contrastText: '#232f3e' },
  },
});

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  padding: '0 20px',
}));

const Header = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Função para buscar a quantidade de itens no carrinho
  const fetchCartItems = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId'); // Pega o session_id salvo no localStorage
      const token = localStorage.getItem('token'); // Pega o token se o usuário estiver logado

      if (!sessionId) return; // Evita chamada se não houver sessionId

      const payload = {
        session_id: sessionId,
      };

      // Configuração do cabeçalho com o token se o usuário estiver logado
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      // Envia o session_id no payload e o token (se disponível) nos headers
      const response = await api.post('/carrinho/listar/', payload, config);

      // Calcula a quantidade total de itens no carrinho
      const totalItems = response.data.itens.reduce((acc, item) => acc + item.quantidade, 0);
      setCartItemsCount(totalItems); // Atualiza o número de itens no carrinho
    } catch (error) {
      console.error('Erro ao buscar o carrinho:', error);
    }
  };

  useEffect(() => {
    fetchCartItems(); // Chama a função para buscar os itens do carrinho ao montar o componente

    // Adiciona um evento para atualizar o número de itens ao adicionar produtos ao carrinho
    const handleCartUpdated = () => fetchCartItems();
    window.addEventListener('cartUpdated', handleCartUpdated);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated); // Remove o listener ao desmontar o componente
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <StyledToolbar>
          <Button component={Link} to="/" color="secondary" sx={{ fontSize: '1.2rem' }}>
            Casa dos Licores
          </Button>

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

            {/* Ícone do carrinho com a contagem de itens */}
            <IconButton component={Link} to="/carrinho" color="inherit">
              <Badge badgeContent={cartItemsCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </div>
        </StyledToolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
