import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Card, CardContent } from '@mui/material';
import api from '../../../utils/api'; // API para se comunicar com o backend

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar se o usuário está logado

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Simule uma requisição para verificar se o usuário está logado
        const response = await api.get('/user-status/');
        setIsLoggedIn(response.data.loggedIn);
      } catch (error) {
        console.error('Erro ao verificar login:', error);
      }
    };

    const fetchCart = async () => {
      if (isLoggedIn) {
        // Se o usuário estiver logado, buscar o carrinho do backend
        try {
          const response = await api.get('/carrinho/');
          setCart(response.data);
        } catch (error) {
          console.error('Erro ao buscar carrinho:', error);
        }
      } else {
        // Se o usuário não estiver logado, buscar o carrinho do localStorage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        } else {
          setCart({ itens: [] }); // Define um carrinho vazio se não houver no localStorage
        }
      }
    };

    checkLoginStatus();
    fetchCart();
  }, [isLoggedIn]);

  if (!cart || cart.itens.length === 0) {
    return (
      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Typography variant="h6">Seu carrinho está vazio.</Typography>
      </Container>
    );
  }

  const handleCheckout = () => {
    if (!isLoggedIn) {
      // Redirecionar para login se o usuário não estiver logado
      window.location.href = '/login';
    } else {
      // Proceder para checkout
      console.log('Processar finalização de compra');
    }
  };

  return (
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Carrinho de Compras
      </Typography>
      {cart.itens.map((item, index) => (
        <Card key={index} sx={{ marginY: 2 }}>
          <CardContent>
            <Typography variant="h6">{item.produto.nome}</Typography>
            <Typography variant="body2">Quantidade: {item.quantidade}</Typography>
            <Typography variant="body2">Preço: R$ {item.preco_unitario}</Typography>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleCheckout}
      >
        Finalizar Compra
      </Button>
    </Container>
  );
};

export default Cart;
