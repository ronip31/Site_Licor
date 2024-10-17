import api from '../utils/api'; // API para se comunicar com o backend


export const fetchSessionId = async () => {
  const screenInfo = `${window.screen.height}x${window.screen.width}-${window.screen.colorDepth}`;
  const language = window.navigator.language;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const response = await api.get('/generate-session-id/', {
    params: { screen_info: screenInfo, language: language, time_zone: timeZone },
  });

  const sessionId = response.data.session_id;

  // Armazena no localStorage para persistência
  localStorage.setItem('sessionId', sessionId);

  return sessionId;
};


// Função para recuperar o session_id do localStorage ou gerar um novo se não existir
export const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    // Se não houver sessionId no localStorage, gera um novo via API
    sessionId = fetchSessionId();
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
