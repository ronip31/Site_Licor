import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const { uuid } = useParams(); // Captura o ID do produto pela URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir e fechar o lightbox
  const [activeImageIndex, setActiveImageIndex] = useState(0); // Estado para controlar a imagem ativa no lightbox
  const [cep, setCep] = useState(''); // Estado para o campo de CEP
  const [opcoesFrete, setOpcoesFrete] = useState([]); // Estado para armazenar todas as opções de frete

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products-details/${uuid}/`);
        setProduct(response.data);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [uuid]);

  const handleCalcularFrete = async () => {
    try {
      const response = await api.post('/calcular-frete/', {
        produto_uuid: uuid,
        cep_destino: cep,
      });
      if (response.data.length > 0) {
        // Armazene todas as opções de frete
        setOpcoesFrete(response.data);
      } else {
        setOpcoesFrete([]); // Limpar as opções de frete se nenhuma estiver disponível
      }
    } catch (error) {
      console.error('Erro ao calcular o frete:', error);
      setOpcoesFrete([]); // Limpar as opções de frete em caso de erro
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
                      onClick={() => handleOpenLightbox(index)} // Abre o lightbox ao clicar na imagem
                    >
                      <LazyLoadImage
                        src={image.imagem}
                        alt={product.nome}
                        height="100%"
                        width="auto"
                        effect="blur"
                        style={{
                          maxHeight: '100%', // Garante que a imagem não ultrapasse a altura
                          objectFit: 'contain', // Garante que a imagem se ajuste sem cortar
                        }}
                      />
                    </Box>
                  ))}
                </Carousel>
              ) : (
                <Typography variant="body1">Sem imagens disponíveis</Typography>
              )}
            </Card>
          </Grid>

          {/* Coluna para as informações do produto */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>{product.nome}</Typography>

            <Box sx={{ marginY: 2 }}>
              <Rating value={4} readOnly />
            </Box>

            <Box sx={{ marginY: 2 }}>
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
            </Box>

            <Box sx={{ marginY: 2 }}>
              <Chip label={`Estoque: ${product.quantidade_estoque}`} color={product.quantidade_estoque > 0 ? 'primary' : 'secondary'} />
            </Box>

            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ marginY: 2, padding: '10px 20px', fontSize: '1.1rem' }}
            >
              Comprar
            </Button>
            

            {/* Campo de CEP e botão para calcular frete */}
            <Box sx={{ marginY: 2 }}>
            <TextField
              label="Digite seu CEP"
              value={cep}
              onChange={(e) => {
                // Permitir apenas números e limitar a 8 dígitos
                const cepValido = e.target.value.replace(/\D/g, '').slice(0, 8);
                setCep(cepValido);
              }}
              size="small"
              variant="outlined"
              sx={{ marginRight: 2 }}
              inputProps={{ maxLength: 8 }} // Limita o número de caracteres no input
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

            {/* Adiciona informações de graduação e marca */}
            <Box sx={{ marginY: 4 }}>
              <Typography variant="h6" gutterBottom>Informações do Produto</Typography>
              <Typography variant="body1"><strong>Marca:</strong> {product.marca.nome}</Typography>
              <Typography variant="body1"><strong>Teor Alcoólico:</strong> {product.teor_alcoolico}%</Typography>
            </Box>

            <Box sx={{ marginY: 4 }}>
              <Typography variant="h6" gutterBottom>Descrição do Produto</Typography>
              <Typography variant="body1" dangerouslySetInnerHTML={{ __html: product.descricao }} />
            </Box>
          </Grid>
        </Grid>

        {/* Lightbox que exibe a imagem em tela cheia */}
        {isOpen && (
          <Lightbox
            images={product.imagens.map((image) => image.imagem)} // Array com todas as URLs das imagens
            startIndex={activeImageIndex} // Começa da imagem clicada
            onClose={() => setIsOpen(false)} // Fecha o lightbox
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default ProductDetail;
