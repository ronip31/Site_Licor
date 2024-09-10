import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

// Exemplo de lista de produtos
const products = [
  { id: 1, name: 'Produto 1', image: 'https://via.placeholder.com/150', price: 'R$ 100,00' },
  { id: 2, name: 'Produto 2', image: 'https://via.placeholder.com/150', price: 'R$ 200,00' },
  { id: 3, name: 'Produto 3', image: 'https://via.placeholder.com/150', price: 'R$ 300,00' },
];

const Products = () => {
  return (
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      {/* Banner */}
      <div style={{ width: '100%', height: '200px', backgroundColor: '#f5f5f5', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h4">Bem-vindo à nossa loja!</Typography>
      </div>

      {/* Título da página */}
      <Typography variant="h5" gutterBottom>Nossos Produtos</Typography>

      {/* Grid de produtos */}
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.price}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  to={`/products/${product.id}`} 
                  style={{ marginTop: '10px' }}
                >
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
