import React from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  // Exemplo de lista de produtos
  const products = [
    { id: 1, name: 'Produto 1' },
    { id: 2, name: 'Produto 2' },
    { id: 3, name: 'Produto 3' },
  ];

  return (
    <div>
      <h2>Nossos Produtos</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
