import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, IconButton } from '@mui/material';
import { Remove, Add, Delete } from '@mui/icons-material'; // Ícones de remoção e adição de quantidade
import api from '../../../utils/api'; // API para se comunicar com o backend

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar se o usuário está logado

  // Verifica se o usuário está logado pelo token no localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // Se houver token, o usuário está logado
    }

    const fetchCart = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const payload = { session_id: sessionId };

        if (isLoggedIn && token) {
          payload['Authorization'] = `Bearer ${token}`; // Adiciona o token ao payload
        }

        const response = await api.post('/carrinho/listar/', payload);
        setCart(response.data);
      } catch (error) {
        console.error('Erro ao buscar carrinho no backend:', error);
        setCart({ itens: [] }); // Define carrinho vazio se houver erro
      }
    };

    fetchCart();
  }, [isLoggedIn]);

  // Função para diminuir a quantidade de um item
  const handleDecreaseQuantity = async (item) => {
    if (item.quantidade > 1) {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const token = localStorage.getItem('token');
        const payload = {
          produto_uuid: item.produto.uuid,
          quantidade: item.quantidade - 1,
          session_id: sessionId,
        };

        if (token) {
          payload['Authorization'] = `Bearer ${token}`;
        }

        await api.post('/carrinho/atualizar_quantidade/', payload);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        setCart((prevCart) => ({
          ...prevCart,
          itens: prevCart.itens.map((i) =>
            i.produto.uuid === item.produto.uuid ? { ...i, quantidade: i.quantidade - 1 } : i
          ),
        }));
      } catch (error) {
        console.error('Erro ao diminuir a quantidade:', error);
      }
    }
  };

  // Função para aumentar a quantidade de um item
  const handleIncreaseQuantity = async (item) => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const token = localStorage.getItem('token');
      const payload = {
        produto_uuid: item.produto.uuid,
        quantidade: item.quantidade + 1,
        session_id: sessionId,
      };

      if (token) {
        payload['Authorization'] = `Bearer ${token}`;
      }

      await api.post('/carrinho/atualizar_quantidade/', payload);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      setCart((prevCart) => ({
        ...prevCart,
        itens: prevCart.itens.map((i) =>
          i.produto.uuid === item.produto.uuid ? { ...i, quantidade: i.quantidade + 1 } : i
        ),
      }));
    } catch (error) {
      console.error('Erro ao aumentar a quantidade:', error);
    }
  };

  // Função para remover um item completamente do carrinho
  const handleRemoveItem = async (item) => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const token = localStorage.getItem('token');
      const payload = {
        produto_uuid: item.produto.uuid,
        session_id: sessionId,
      };

      if (token) {
        payload['Authorization'] = `Bearer ${token}`;
      }

      await api.post('/carrinho/remover_item/', payload);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      setCart((prevCart) => ({
        ...prevCart,
        itens: prevCart.itens.filter((i) => i.produto.uuid !== item.produto.uuid),
      }));
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
    }
  };

  if (!cart || cart.itens.length === 0) {
    return (
      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Typography variant="h6">Seu carrinho está vazio.</Typography>
      </Container>
    );
  }

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      // Redirecionar para login se o usuário não estiver logado
      window.location.href = '/login';
    } else {
      // Proceder para o checkout no backend
      try {
        const token = localStorage.getItem('token');
        const payload = {
          session_id: localStorage.getItem('sessionId'),
        };

        if (token) {
          payload['Authorization'] = `Bearer ${token}`;
        }

        const response = await api.post('/carrinho/finalizar/', payload);
        console.log('Finalização de compra realizada com sucesso:', response.data);
      } catch (error) {
        console.error('Erro ao finalizar a compra:', error);
      }
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
            <Typography variant="body2">Preço: R$ {item.preco_unitario}</Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <IconButton onClick={() => handleDecreaseQuantity(item)} disabled={item.quantidade <= 1}>
                  <Remove />
                </IconButton>
                <Typography component="span">{item.quantidade}</Typography>
                <IconButton onClick={() => handleIncreaseQuantity(item)}>
                  <Add />
                </IconButton>
              </Box>
              <IconButton color="error" onClick={() => handleRemoveItem(item)}>
                <Delete />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
      <Button variant="contained" color="primary" size="large" onClick={handleCheckout}>
        Finalizar Compra
      </Button>
    </Container>
  );
};

export default Cart;
