import axios from 'axios';

// Crie uma instância do axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // URL do backend
});

// Intercepta as respostas para verificar erros de autenticação
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se a resposta for 401 (Unauthorized) ou 403 (Forbidden), o token é inválido ou expirou
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      // Redireciona para a página de login
      window.location.href = '/loginadmin'; // ou use uma navegação programática no React
    }
    return Promise.reject(error);
  }
);

export default api;
