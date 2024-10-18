import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import isTokenExpired from '../../utils/isTokenExpired';
import api from '../../utils/api';  // Suponho que você tenha uma instância do axios aqui

const ProtectedRouteCliente = ({ component: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Estado para controle de autenticação

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');

      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);  // Redirecionar para login
        return;
      }

      // Faz uma requisição ao backend para validar o token e verificar o tipo de usuário
      try {
        const response = await api.get('/usuarios/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Verifica se o tipo de usuário é cliente no backend
        if (response.data.tipo_usuario === 'cliente') {
          setIsAuthenticated(true);  // Usuário é cliente e autenticado
        } else {
          setIsAuthenticated(false);  // Redireciona para login se não for cliente
        }
      } catch (error) {
        console.error('Erro ao validar token no backend:', error);
        localStorage.removeItem('token');  // Remove o token inválido
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);  // Redireciona para login
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    // Mostra um loading enquanto valida o token
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Renderiza o componente protegido
  return <Component />;
};

export default ProtectedRouteCliente;
