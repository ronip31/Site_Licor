import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Card, CardContent, IconButton, TextField, Divider } from '@mui/material';
import { Remove, Add, Delete } from '@mui/icons-material';
import api from '../../../utils/api'; // API para se comunicar com o backend
import { getSessionId, getToken, isTokenValid } from '../../../utils/authUtils';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [cep, setCep] = useState('');
  const [cupom, setCupom] = useState('');
  const [desconto, setDesconto] = useState(0); // Estado para o valor do desconto
  const [mensagemCupom, setMensagemCupom] = useState(null); // Estado para mensagens de cupom
  const [freteGratis, setFreteGratis] = useState(false); // Estado para verificar se há frete grátis

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const sessionId = getSessionId();
        const token = getToken();
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

  const getCompleteImageUrl = (imagePath) => {
    return `${api.defaults.baseURL.replace('/api', '')}${imagePath}`;
  };

  const handleApplyCupom = async () => {
    setMensagemCupom(null); // Limpa a mensagem anterior
    setDesconto(0); // Redefine o desconto para evitar manter o valor anterior
    setFreteGratis(false); // Redefine o frete grátis
    try {
      const sessionId = getSessionId();
      const token = getToken();
      const payload = { 
        session_id: sessionId,  // Session ID enviado no payload
        codigo_cupom: cupom      // Cupom fornecido pelo usuário
      };
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  
      // Chama a API para aplicar o cupom
      const response = await api.post('/aplicar-cupom/', payload, config);
  
      // Aplica o desconto e as informações retornadas pela API
      setDesconto(response.data.desconto); // Aplica o desconto retornado pela API
      setFreteGratis(response.data.frete_gratis); // Define se o frete grátis foi aplicado
      setMensagemCupom(response.data.mensagem); // Mostra a mensagem de sucesso
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        setMensagemCupom(error.response.data.detail); // Mostra mensagem de erro
      } else {
        setMensagemCupom('Erro ao aplicar o cupom.');
      }
    }
  };
  
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
        setCart(updatedCart.data);
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
      setCart(updatedCart.data);
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

      window.dispatchEvent(new CustomEvent('cartUpdated'));

      const updatedCart = await api.post('/carrinho/listar/', { session_id: sessionId }, config);
      setCart(updatedCart.data);
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
    }
  };

  const handleCheckout = async () => {
    if (!isTokenValid()) {
      window.location.href = '/login';
    } else {
      try {
        const token = getToken();
        const payload = { session_id: getSessionId() };
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await api.post('/carrinho/finalizar/', payload, config);
        console.log('Finalização de compra realizada com sucesso:', response.data);
      } catch (error) {
        console.error('Erro ao finalizar a compra:', error);
      }
    }
  };

  if (!cart || !cart.itens || cart.itens.length === 0) {
    return (
      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Typography variant="h6">Seu carrinho está vazio.</Typography>
      </Container>
    );
  }

  const totalComDesconto = cart.total_carrinho - desconto;

  return (
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Meu Carrinho
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {cart.itens.map((item, index) => (
        <Card key={index} sx={{ marginY: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                <img src={getCompleteImageUrl(item.produto.imagens[0])} alt={item.produto.nome} width={70} height={70} />
                <Box ml={2}>
                  <Typography variant="h6">{item.produto.nome}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Valor un.: R$ {item.produto.preco_unitario.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total itens: R$ {item.produto.total_item.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => handleDecreaseQuantity(item)} disabled={item.produto.quantidade <= 1}>
                  <Remove />
                </IconButton>
                <Typography component="span">{item.produto.quantidade}</Typography>
                <IconButton onClick={() => handleIncreaseQuantity(item)}>
                  <Add />
                </IconButton>
                <IconButton color="error" onClick={() => handleRemoveItem(item)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Divider sx={{ my: 2 }} />

      <Box mt={4}>
        <Typography variant="h5">Total em Produtos: R$ {cart.total_carrinho.toFixed(2)}</Typography>
        {desconto > 0 && (
          <>
            <Typography variant="h6" color="green">
              Desconto Aplicado: -R$ {desconto.toFixed(2)}
            </Typography>
            <Typography variant="h5">
              Total com Desconto: R$ {totalComDesconto.toFixed(2)}
            </Typography>
          </>
        )}
        {freteGratis && (
          <Typography variant="h6" color="blue">
            Frete Grátis aplicado!
          </Typography>
        )}
      </Box>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Box display="flex" flexDirection="column" width="45%">
          <TextField
            label="Inserir Cupom de Desconto"
            variant="outlined"
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
          />
          <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }} onClick={handleApplyCupom}>
            Aplicar Cupom
          </Button>
          {mensagemCupom && (
            <Typography variant={desconto > 0 ? 'h6' : 'body1'} color={desconto > 0 ? 'green' : 'red'} sx={{ mt: 1 }}>
              {mensagemCupom}
            </Typography>
          )}
        </Box>

        <Box display="flex" flexDirection="column" width="45%">
          <TextField
            label="Informe o CEP"
            variant="outlined"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            InputProps={{
              endAdornment: (
                <Button variant="contained" color="primary" size="small">
                  OK
                </Button>
              ),
            }}
          />
        </Box>
      </Box>

      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" size="large" onClick={handleCheckout}>
          Finalizar Compra
        </Button>
      </Box>
    </Container>
  );
};

export default Cart;
