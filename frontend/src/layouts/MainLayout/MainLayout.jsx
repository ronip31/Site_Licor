import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import './MainLayout.css';

const MainLayout = () => {
  // Estado para gerenciar o carrinho
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Função para atualizar a quantidade de itens no carrinho
  const updateCartItemCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || { itens: [] };
    const totalItems = cart.itens.reduce((acc, item) => acc + item.quantidade, 0);
    setCartItemsCount(totalItems);
  };

  // Adiciona o listener para ouvir as mudanças do carrinho
  useEffect(() => {
    // Atualiza a contagem inicial ao carregar a página
    updateCartItemCount();

    // Listener para o evento personalizado do carrinho
    const handleCartUpdated = () => {
      updateCartItemCount();
    };

    // Adiciona o evento listener
    window.addEventListener('cartUpdated', handleCartUpdated);

    // Remove o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  return (
    <div className="main-layout">
      {/* Passa a quantidade de itens no carrinho para o Header */}
      <MainHeader cartItemsCount={cartItemsCount} />

      <main className="main-content">
        {/* O Outlet renderiza a rota correspondente */}
        <Outlet context={{ updateCartItemCount }} />
      </main>

      <MainFooter />
    </div>
  );
};

export default MainLayout;
