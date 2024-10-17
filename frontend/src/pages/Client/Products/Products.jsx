import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Rating,
  Box,
  IconButton,
  Skeleton,
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import api from '../../../utils/api';
import 'react-lazy-load-image-component/src/effects/blur.css';
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

const Products = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products-with-images/');
        // Inicialize o índice da imagem para cada produto
        const productsWithImages = response.data.map((product) => ({
          ...product,
          imageIndex: 0,
        }));
        setProducts(productsWithImages);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCarouselImages = async () => {
      try {
        const response = await api.get('/carousel-list/');
        setCarouselImages(response.data);
      } catch (error) {
        console.error('Erro ao buscar imagens do carrossel:', error);
      }
    };

    fetchProducts();
    fetchCarouselImages();
  }, []);

  // Função para mudar para a próxima imagem
  const handleNextImage = (index) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index
          ? {
              ...product,
              imageIndex: (product.imageIndex + 1) % product.imagens.length,
            }
          : product
      )
    );
  };

  // Função para voltar para a imagem anterior
  const handlePreviousImage = (index) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index
          ? {
              ...product,
              imageIndex: (product.imageIndex - 1 + product.imagens.length) % product.imagens.length,
            }
          : product
      )
    );
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')           // Substitui espaços por hifens
      .replace(/[^\w-]+/g, '')        // Remove caracteres especiais (o "-" não precisa de escape)
      .replace(/--+/g, '-')           // Substitui hifens duplos por um único (o "-" não precisa de escape)
      .replace(/^-+/, '')             // Remove hifens no início
      .replace(/-+$/, '');            // Remove hifens no final
  };
  

  if (loading) {
    return (
      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Grid container spacing={4}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="100%" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  const addToCart = async (product) => {
    if (!product || !product.uuid) {
      console.error('Produto inválido ou não encontrado.');
      return;
    }
    const storedSessionId = getSessionId();

    const payload = {
      produto_uuid: product.uuid,
      quantidade: 1,
      session_id: storedSessionId, // Sempre envia o session_id
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
  

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate('/carrinho');
  };


  return (
    <ThemeProvider theme={theme}>
      <Carousel autoPlay animation="slide" indicators={false} navButtonsAlwaysVisible>
        {carouselImages.map((slide) => (
          <Box
            key={slide.uuid}
            sx={{
              width: '100%',
              height: { xs: '150px', sm: '250px', md: '400px' }, // Altura responsiva para diferentes tamanhos de tela
              overflow: 'hidden', // Evita que imagens maiores fiquem cortadas
            }}
          >
            {slide.link_url ? (
              <a href={slide.link_url} target="_blank" rel="noopener noreferrer">
                <img
                  src={slide.imagem}
                  alt={slide.titulo}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // Garante que a imagem preencha o espaço sem distorção
                  }}
                />
              </a>
            ) : (
              <img
                src={slide.imagem}
                alt={slide.titulo}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </Box>
        ))}
      </Carousel>


      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>Nossos Produtos</Typography>

        <Grid container spacing={4}>
          {products.map((product, index) => (
            <Grid item xs={6} sm={6} md={4} lg={3} key={product.uuid}>
              <Card
                sx={{
                  position: 'relative',
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s',
                  height: '100%',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                {product.label && (
                  <Chip
                    label={product.label}
                    color="secondary"
                    size="small"
                    sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                  />
                )}

                {/* Botões de navegação para imagens */}
                <Box sx={{ position: 'relative', height: '200px' }}>
                  {product.imagens.length > 1 && (
                    <IconButton
                      onClick={() => handlePreviousImage(index)}
                      sx={{ position: 'absolute', top: '50%', left: '5px', zIndex: 2 }}
                    >
                      <ArrowBack />
                    </IconButton>
                  )}
                  {/* Conteúdo do Card */}
                  <Box sx={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Link to={`/products-details/${slugify(product.nome)}`} >
                      <LazyLoadImage
                        src={product.imagens[product.imageIndex]?.imagem || 'https://via.placeholder.com/300'}
                        alt={product.nome}
                        effect="blur"
                        height="200px"
                        width="100%"
                        style={{ objectFit: 'cover' }}
                      />
                    </Link>
                  </Box>

                  {product.imagens.length > 1 && (
                    <IconButton
                      onClick={() => handleNextImage(index)}
                      sx={{ position: 'absolute', top: '50%', right: '5px', zIndex: 2 }}
                    >
                      <ArrowForward />
                    </IconButton>
                  )}
                </Box>

                <CardContent
                  sx={{
                    textAlign: 'center',
                    padding: '16px',
                    height: { xs: '180px', sm: '160px' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Link to={`/products-details/${slugify(product.nome)}`}  style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold', minHeight: '48px', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {product.nome}
                    </Typography>
                  </Link>

                  <Rating value={product.rating || 0} readOnly size="small" sx={{ marginY: '8px' }} />

                  {product.preco_com_desconto ? (
                    <>
                      <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'gray', marginTop: '8px', fontSize: { xs: '0.8rem', sm: '1rem' } }}>
                        De: R$ {product.preco_venda}
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'green', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                          Por:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'green', fontSize: { xs: '1.2rem', sm: '1.4rem' } }}>
                          R$ {product.preco_com_desconto.toFixed(2)}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '8px', fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                      R$ {product.preco_venda}
                    </Typography>
                  )}
                </CardContent>

                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    padding: '10px', 
                    marginTop: { xs: '-10px', sm: '0px' } // Ajusta a posição do botão em telas pequenas
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                      fontSize: { xs: '0.8em', sm: '0.9em' }, // Fonte menor em telas menores
                      fontWeight: 'bold',
                      padding: { xs: '6px 16px', sm: '8px 20px' },
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        backgroundColor: 'secondary.dark',
                      },
                    }}
                    onClick={() => handleBuyNow(product)}  // Passa o produto atual ao clicar
                    aria-label={`Comprar ${product.nome}`}
                  >
                    Comprar
                  </Button>
                </Box>

              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Products;
