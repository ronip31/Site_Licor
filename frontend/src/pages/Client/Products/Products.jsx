import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Rating,
  Box,
  IconButton
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Slider from 'react-slick';
import api from '../../../utils/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Products = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/');
        const productsWithImages = await Promise.all(
          response.data.map(async (product) => {
            const imagesResponse = await api.get(`/produtos/${product.uuid}/imagens/`);
            return {
              ...product,
              images: imagesResponse.data,
              imageIndex: 0, // Adiciona índice inicial para a imagem exibida
            };
          })
        );
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

  const handleNextImage = (index) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index
          ? {
              ...product,
              imageIndex: (product.imageIndex + 1) % product.images.length,
            }
          : product
      )
    );
  };

  const handlePreviousImage = (index) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index
          ? {
              ...product,
              imageIndex:
                (product.imageIndex - 1 + product.images.length) % product.images.length,
            }
          : product
      )
    );
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <Slider {...sliderSettings}>
        {carouselImages.map((slide) => (
          <div key={slide.uuid}>
            {slide.link_url ? (
              <a href={slide.link_url} target="_blank" rel="noopener noreferrer">
                <img src={slide.imagem} alt={slide.titulo} style={{ width: '100%', height: 'auto' }} />
              </a>
            ) : (
              <img src={slide.imagem} alt={slide.titulo} style={{ width: '100%', height: 'auto' }} />
            )}
          </div>
        ))}
      </Slider>

      <Container maxWidth="lg" style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>Nossos Produtos</Typography>

        <Grid container spacing={4}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={3} key={product.uuid}>
              <Card sx={{ position: 'relative', textAlign: 'center', padding: '10px' }}>
                {product.label && (
                  <Chip
                    label={product.label}
                    color="secondary"
                    size="small"
                    sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                  />
                )}

                <Link to={`/products/${product.uuid}`}>
                  <CardMedia
                    component="img"
                    image={product.images[product.imageIndex]?.imagem || 'https://via.placeholder.com/300'}
                    alt={product.nome}
                    sx={{ height: 200 }}
                  />
                </Link>

                {product.images.length > 1 && (
                  <>
                    <IconButton
                      onClick={() => handlePreviousImage(index)}
                      sx={{ position: 'absolute', top: '20%', left: 0, zIndex: 3, color: 'gray' }}
                    >
                      <ArrowBack />
                    </IconButton>
                    <IconButton
                      onClick={() => handleNextImage(index)}
                      sx={{ position: 'absolute', top: '20%', right: 0, zIndex: 2, color: 'gray' }}
                    >
                      <ArrowForward />
                    </IconButton>
                  </>
                )}

                <CardContent sx={{ textAlign: 'center' }}>
                  <Link to={`/products/${product.uuid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography gutterBottom variant="h7" component="div">
                      {product.nome}
                    </Typography>
                  </Link>
                  <Rating value={product.rating || 0} readOnly size="small" />
                  
                  {product.preco_com_desconto ? (
                    <>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ textDecoration: 'line-through', color: 'gray', marginTop: '8px' }}
                      >
                        De: R$ {product.preco_venda}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        color="error" 
                        sx={{ fontWeight: 'bold', color: 'green', marginTop: '4px' }}
                      >
                        Por: R$ {product.preco_com_desconto}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ou 3x de R$ {(product.preco_com_desconto / 3).toFixed(2)} sem juros
                      </Typography>
                    </>
                  ) : (
                    <Typography 
                      variant="h6" 
                      color="text.secondary" 
                      sx={{ fontWeight: 'bold', marginTop: '8px' }}
                    >
                      R$ {product.preco_venda}
                    </Typography>
                  )}
                </CardContent>

                <Box sx={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ fontSize: '0.9em', fontWeight: 'bold', padding: '10px 20px' }}
                  >
                    Comprar
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Products;
