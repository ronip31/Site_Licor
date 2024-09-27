import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Detalhes do Produto {id}</h2>
      <p>Aqui estão os detalhes do produto {id}.</p>
    </div>
  );
};

export default ProductDetails;
