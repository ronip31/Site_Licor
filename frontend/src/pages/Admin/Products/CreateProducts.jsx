import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Faz a requisição para a API usando a instância do Axios
        const response = await api.get('/product/lista/');
        // Atualiza o estado com os produtos recebidos
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Erro ao buscar produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Carregando produtos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Produtos</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.nome}</h2>
            <p>{product.descricao}</p>
            <p>Preço: R${product.preco}</p>
            <p>Quantidade Em Estoque:{product.quantidade_estoque}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
