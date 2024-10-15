import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, IconButton } from '@mui/material';
import { Remove, Add, Delete } from '@mui/icons-material'; // Ícones de remoção e adição de quantidade
import api from '../../../utils/api'; // API para se comunicar com o backend
import { getSessionId, getToken, isTokenValid } from '../../../utils/authUtils';

const Cart = () => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const sessionId = getSessionId(); // Usa o sessionId do utils
        const token = getToken(); // Usa o token do utils

        const payload = { session_id: sessionId };
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const response = await api.post('/carrinho/listar/', payload, config);
        setCart(response.data);
      } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
      }
    };

    fetchCart();
  }, []);

  // Função para diminuir a quantidade de um item
  const handleDecreaseQuantity = async (item) => {
    if (item.produto.quantidade > 1) {
      try {
        const sessionId = getSessionId();
        const token = getToken();
        const payload = {
          produto_uuid: item.produto.uuid,
          quantidade: item.produto.quantidade - 1,
          session_id: sessionId,
        };

        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        await api.post('/carrinho/atualizar_quantidade/', payload, config);
        window.dispatchEvent(new CustomEvent('cartUpdated'));

        const updatedCart = await api.post('/carrinho/listar/', { session_id: sessionId }, config);
        setCart(updatedCart.data); // Atualiza o carrinho no estado
      } catch (error) {
        console.error('Erro ao diminuir a quantidade:', error);
      }
    }
  };

  // Função para aumentar a quantidade de um item
  const handleIncreaseQuantity = async (item) => {
    try {
      const sessionId = getSessionId();
      const token = getToken();
      const payload = {
        produto_uuid: item.produto.uuid,
        quantidade: item.produto.quantidade + 1,
        session_id: sessionId,
      };

      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await api.post('/carrinho/atualizar_quantidade/', payload, config);
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      const updatedCart = await api.post('/carrinho/listar/', { session_id: sessionId }, config);
      setCart(updatedCart.data); // Atualiza o carrinho no estado
    } catch (error) {
      console.error('Erro ao aumentar a quantidade:', error);
    }
  };

  // Função para remover um item completamente do carrinho
  const handleRemoveItem = async (item) => {
    try {
      const sessionId = getSessionId();
      const token = getToken();
      const payload = {
        produto_uuid: item.produto.uuid,
        session_id: sessionId,
      };

      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await api.post('/carrinho/remover_item/', payload, config);

      // Dispara o evento para atualizar o ícone do carrinho
      window.dispatchEvent(new CustomEvent('cartUpdated'));

      // Atualiza o carrinho, ou seja, recarrega os itens no carrinho
      const updatedCart = await api.post('/carrinho/listar/', { session_id: sessionId }, config);
      setCart(updatedCart.data); // Atualiza o carrinho no estado
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
    }
  };

  // Verifica se o carrinho está vazio
  if (!cart || !cart.itens || cart.itens.length === 0) {
    return (
      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Typography variant="h6">Seu carrinho está vazio.</Typography>
      </Container>
    );
  }

  const handleCheckout = async () => {
    if (!isTokenValid()) {
      // Redirecionar para login se o usuário não estiver logado
      window.location.href = '/login';
    } else {
      // Proceder para o checkout no backend
      try {
        const token = getToken();
        const payload = {
          session_id: getSessionId(),
        };

        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const response = await api.post('/carrinho/finalizar/', payload, config);
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
            <Typography variant="body2">Preço Unitário: R$ {item.produto.preco_unitario.toFixed(2)}</Typography>
            <Typography variant="body2">Total do Item: R$ {item.produto.total_item.toFixed(2)}</Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <IconButton onClick={() => handleDecreaseQuantity(item)} disabled={item.produto.quantidade <= 1}>
                  <Remove />
                </IconButton>
                <Typography component="span">{item.produto.quantidade}</Typography>
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
      <Typography variant="h5" gutterBottom>
        Total do Carrinho: R$ {cart.total_carrinho.toFixed(2)}
      </Typography>
      <Button variant="contained" color="primary" size="large" onClick={handleCheckout}>
        Finalizar Compra
      </Button>
    </Container>
  );
};

export default Cart;
