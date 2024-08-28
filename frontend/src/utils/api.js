import axios from 'axios';
import isTokenExpired from './isTokenExpired';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Interceptor de requisição para adicionar o token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Se o token estiver expirado, remova-o do localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
