import axios from 'axios';
import isTokenExpired from './isTokenExpired';
import { jwtDecode } from 'jwt-decode';

// Construir a baseURL dinamicamente usando o hostname atual
const baseURL = `http://${window.location.hostname}:8000/api`;
console.log(baseURL);

const api = axios.create({
  baseURL: baseURL,
});

// Função para tentar renovar o token usando o refreshToken
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return false;
    }

    const response = await axios.post(`${baseURL}/token/refresh/`, {
      refresh: refreshToken,
    });
    const newAccessToken = response.data.access;

    // Atualizar o token no localStorage
    localStorage.setItem('token', newAccessToken);
    return true;
  } catch (error) {
    console.error('Erro ao renovar o token:', error);
    return false;
  }
};

// Interceptor de requisição para adicionar o token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Tenta decodificar o token para ver se ele é válido
        jwtDecode(token);
        
        // Verifica se o token expirou
        if (!isTokenExpired(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          throw new Error('Token expirado');
        }
      } catch (error) {
        console.error('Token inválido ou expirado:', error);
        
        // Se o token estiver inválido ou malformado, remova-o do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // Redireciona para a página de login
        window.location.href = '/loginadmin';
        return Promise.reject(error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para lidar com 401 (token expirado ou inválido)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e o token não foi renovado ainda
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const success = await refreshToken();

      if (success) {
        const newToken = localStorage.getItem('token');
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // Reenvia a requisição original
      }
    }

    // Caso o token não possa ser renovado, remover o token e redirecionar para o login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/loginadmin';
    }

    return Promise.reject(error);
  }
);

export default api;
