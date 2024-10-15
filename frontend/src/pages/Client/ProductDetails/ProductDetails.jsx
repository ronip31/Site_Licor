import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card, 
  CardContent,
  Divider,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  TextField,
  Paper,
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Lightbox from 'react-awesome-lightbox'; 
import 'react-awesome-lightbox/build/style.css';
import api from '../../../utils/api';
import { getSessionId, getToken, isTokenValid } from '../../../utils/authUtils';

const theme = createTheme({
  typography: {
    responsiveFontSizes: true,
  },
  palette: {
    primary: {
      main: '#007BFF',
    },
    secondary: {
      main: '#28A745',
    },
  },
});

const ProductDetail = () => {
  const { uuid } = useParams();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cep, setCep] = useState('');
  const [opcoesFrete, setOpcoesFrete] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [usuarioUuid, setUsuarioUuid] = useState(null); 

  useEffect(() => {
    // Carrega o token e o session_id do utils
    const token = getToken();
    const storedSessionId = getSessionId();

    if (token && isTokenValid()) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUsuarioUuid(decodedToken.uuid); // Define o UUID do usuário logado
    }

    setSessionId(storedSessionId);
  }, []);

  const addToCart = async (product) => {
    const payload = {
      produto_uuid: product.uuid,
      quantidade: 1,
      session_id: sessionId, // Sempre envia o session_id
    };

    const token = getToken();
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    try {
      await api.post('/carrinho/adicionar_item/', payload, config);
      window.dispatchEvent(new CustomEvent('cartUpdated')); // Dispara evento para atualizar o ícone do carrinho
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products-details/${slug}/`);
        setProduct(response.data);

      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [uuid, slug]);

  const handleCalcularFrete = async () => {
    try {
      const response = await api.post('/calcular-frete/', {
        produto_uuid: product.uuid,
        cep_destino: cep,
      });
      if (response.data.length > 0) {
        setOpcoesFrete(response.data);
      } else {
        setOpcoesFrete([]);
      }
    } catch (error) {
      console.error('Erro ao calcular o frete:', error);
      setOpcoesFrete([]);
    }
  };

  const handleOpenLightbox = (index) => {
    setActiveImageIndex(index);
    setIsOpen(true);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Typography variant="h6">Carregando produto...</Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Typography variant="h6">Produto não encontrado.</Typography>
      </Container>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/carrinho');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Grid container spacing={4}>
          {/* Coluna para imagens do produto */}
          <Grid item xs={12} md={6}>
            <Card>
              {product.imagens && product.imagens.length > 0 ? (
                <Carousel autoPlay={false} animation="slide" navButtonsAlwaysVisible>
                  {product.imagens.map((image, index) => (
                    <Box
                      key={image.uuid}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 400,
                        backgroundColor: '#f5f5f5',
                      }}
                      onClick={() => handleOpenLightbox(index)}
                    >
                      <LazyLoadImage
                        src={image.imagem}
                        alt={product.nome}
                        height="100%"
                        width="auto"
                        effect="blur"
                        style={{
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  ))}
                </Carousel>
              ) : (
                <Typography variant="body1">Sem imagens disponíveis</Typography>
              )}
            </Card>

            {/* Descrição abaixo da imagem */}
            <Typography variant="h5"  sx={{ fontWeight: 'bold' }}>Descrição do Produto</Typography>
            <Typography variant="body1" dangerouslySetInnerHTML={{ __html: product.descricao }} />
          </Grid>

          {/* Coluna para as informações do produto */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>{product.nome}</Typography>

            <Box sx={{ marginY: 2 }}>
              <Rating value={4} readOnly />
            </Box>

            {product.preco_com_desconto ? (
              <>
                <Typography variant="h5" sx={{ textDecoration: 'line-through', color: 'gray' }}>
                  De: R$ {parseFloat(product.preco_venda).toFixed(2)}
                </Typography>
                <Typography variant="h4" sx={{ color: 'green', fontWeight: 'bold' }}>
                  Por: R$ {parseFloat(product.preco_com_desconto).toFixed(2)}
                </Typography>
              </>
            ) : (
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                R$ {parseFloat(product.preco_venda).toFixed(2)}
              </Typography>
            )}

            <Box sx={{ marginY: 2 }}>
              <Chip label={`Estoque: ${product.quantidade_estoque}`} color={product.quantidade_estoque > 0 ? 'primary' : 'secondary'} />
            </Box>

            {/* Botões para Comprar e Adicionar ao Carrinho */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" color="secondary" size="large" onClick={handleBuyNow}>
                Comprar
              </Button>
              <Button variant="outlined" color="primary" size="large" onClick={handleAddToCart}>
                Adicionar ao Carrinho
              </Button>
            </Box>

            {/* Campo de CEP e botão para calcular frete */}
            <Box component={Paper} elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
              <TextField
                label="Digite seu CEP"
                value={cep}
                onChange={(e) => {
                  const cepValido = e.target.value.replace(/\D/g, '').slice(0, 8);
                  setCep(cepValido);
                }}
                size="small"
                variant="outlined"
                sx={{ marginRight: 2 }}
                inputProps={{ maxLength: 8 }}
              />
              <Button variant="outlined" color="primary" onClick={handleCalcularFrete}>
                Calcular Frete
              </Button>
            </Box>

            {/* Exibe todas as opções de frete calculadas */}
            {opcoesFrete.length > 0 && (
              <Box sx={{ marginY: 4 }}>
                <Typography variant="h6" gutterBottom>Opções de Frete</Typography>
                {opcoesFrete.map((frete, index) => (
                  <Card key={index} sx={{ marginY: 2, boxShadow: 3 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                          <LocalShippingIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                          <Typography variant="h6">{frete.nome}</Typography>
                        </Box>
                        <Typography variant="h6" color="primary">R$ {frete.preco_final}</Typography>
                      </Box>
                      <Divider sx={{ marginY: 1 }} />
                      <Box display="flex" alignItems="center">
                        <AccessTimeIcon sx={{ marginRight: 1, color: 'secondary.main' }} />
                        <Typography variant="body2">Prazo de Entrega: {frete.tempo_entrega_dias} dias</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {/* Informações de marca e teor alcoólico */}
            <Typography variant="h5" sx={{ fontWeight: 'bold' }} >Informações do Produto</Typography>
            <Typography variant="body1"><strong>Marca:</strong> {product.marca.nome}</Typography>
            <Typography variant="body1"><strong>Teor Alcoólico:</strong> {product.teor_alcoolico}%</Typography>
          </Grid>
        </Grid>

        {/* Lightbox que exibe a imagem em tela cheia */}
        {isOpen && (
          <Lightbox
            images={product.imagens.map((image) => image.imagem)}
            startIndex={activeImageIndex}
            onClose={() => setIsOpen(false)}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default ProductDetail;
