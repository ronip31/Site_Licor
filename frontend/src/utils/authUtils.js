import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';

const NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341'; // Namespace fixo arbitrário

// Função para gerar um session_id a partir de informações estáveis (exemplo: navegador e características do dispositivo)
export const generateSessionId = () => {
  const navigatorInfo = window.navigator.userAgent;
  const screenInfo = `${window.screen.height}x${window.screen.width}-${window.screen.colorDepth}`;
  
  const stringToHash = `${navigatorInfo}-${screenInfo}`;
  const sessionId = uuidv5(stringToHash, NAMESPACE);
  
  // Armazena o session_id no localStorage
  localStorage.setItem('sessionId', sessionId);
  return sessionId;
};

// Função para recuperar o session_id do localStorage ou gerar um novo se não existir
export const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = generateSessionId();
  }
  return sessionId;
};

// Função para salvar o token no localStorage
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// Função para recuperar o token do localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Função para verificar se o token existe e ainda é válido
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  // Aqui você pode adicionar uma lógica para validar a expiração do token, caso seja JWT
  // Exemplo: decodificar o token e verificar sua validade (com alguma biblioteca como jwt-decode)
  
  return true; // Assuma que o token é válido se estiver presente
};

// Função para remover o token do localStorage (logout)
export const removeToken = () => {
  localStorage.removeItem('token');
};
