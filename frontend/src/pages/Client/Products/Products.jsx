import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Chip, Rating, Box } from '@mui/material';
import Slider from 'react-slick';

// Importar os estilos do slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Exemplo de lista de produtos
const products = [
  { id: 1, name: 'Produto 1', image: 'https://via.placeholder.com/300?text=Produto+1', price: 'R$ 100,00', rating: 4, label: 'Novo' },
  { id: 2, name: 'Produto 2', image: 'https://via.placeholder.com/300?text=Produto+2', price: 'R$ 150,00', rating: 5, label: 'Promoção' },
  { id: 3, name: 'Produto 3', image: 'https://via.placeholder.com/300?text=Produto+3', price: 'R$ 200,00', rating: 3 },
  // Adicione mais produtos conforme necessário
];

// Exemplo de imagens para o carrossel
const carouselImages = [
  { id: 1, image: 'https://via.placeholder.com/1200x300?text=Banner+1', alt: 'Banner 1' },
  { id: 2, image: 'https://via.placeholder.com/1200x300?text=Banner+2', alt: 'Banner 2' },
  { id: 3, image: 'https://via.placeholder.com/1200x300?text=Banner+3', alt: 'Banner 3' },
];

const Products = () => {
  // Configurações do carrossel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      {/* Banner com Carrossel */}
      <Slider {...sliderSettings}>
        {carouselImages.map((slide) => (
          <div key={slide.id}>
            <img src={slide.image} alt={slide.alt} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}
      </Slider>

      <Container maxWidth="lg" style={{ padding: '20px' }}>
        {/* Título da página */}
        <Typography variant="h5" gutterBottom>Nossos Produtos</Typography>

        {/* Grid de produtos */}
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                sx={{
                  position: 'relative',
                  '&:hover .overlay': {
                    opacity: 1,
                  },
                }}
              >
                {/* Etiqueta */}
                {product.label && (
                  <Chip
                    label={product.label}
                    color="secondary"
                    size="small"
                    sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                  />
                )}

                <CardMedia
                  component="img"
                  image={product.image}
                  alt={product.name}
                  sx={{ height: 200 }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Rating value={product.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {product.price}
                  </Typography>
                </CardContent>
                {/* Overlay com botões */}
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    opacity: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.3s',
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/products/${product.id}`}
                    sx={{ mr: 1 }}
                  >
                    Ver Detalhes
                  </Button>
                  <Button variant="contained" color="secondary">
                    Adicionar ao Carrinho
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
