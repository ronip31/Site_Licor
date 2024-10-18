import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtém o token do localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setErrorMessage('Você precisa estar logado para acessar esta página.');
          navigate('/login');  // Redireciona para a página de login se não houver token
          return;
        }

        // Faz a requisição com o token JWT no header
        const response = await api.get('/usuarios/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Atualiza os dados do usuário
        setUserData(response.data);
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
        setErrorMessage('Falha ao carregar as informações do perfil.');
      }
    };

    fetchUserData();
  }, [navigate]);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  if (!userData) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <p><strong>Nome:</strong> {userData.nome}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      {/* Exibir outras informações do usuário aqui */}
    </div>
  );
};

export default Perfil;
