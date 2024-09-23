import axios from 'axios';
import isTokenExpired from './isTokenExpired';

// Construir a baseURL dinamicamente usando o hostname atual
const baseURL = `http://${window.location.hostname}:8000/api`;
console.log(baseURL)

const api = axios.create({
  baseURL: baseURL,
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
