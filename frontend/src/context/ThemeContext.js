import { createContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import api from '../utils/api';
import { useSnackbar } from 'notistack';

// Criação do contexto
export const ThemeContext = createContext();

// Provedor do contexto
export const ThemeProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [themeConfig, setThemeConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar e aplicar as configurações do tema
  const fetchThemeConfig = async () => {
    try {
      const response = await api.get('/theme-config/1/');
      setThemeConfig(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // Se o tema não existe, criar um tema padrão
        const defaultTheme = {
          primary_color: '#232f3e',
          secondary_color: '#ffffff',
          background_color: '#f4f4f4',
          text_color: '#000000',
          font_family: 'Roboto, Arial, sans-serif',
          padding: '10px',
          border_radius: '4px',
          box_shadow: 'none',
        };
        try {
          const createResponse = await api.post('/theme-config/', defaultTheme);
          setThemeConfig(createResponse.data);
        } catch (createError) {
          enqueueSnackbar('Erro ao criar tema padrão', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Erro ao carregar configurações de tema', { variant: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemeConfig();
  }, []);

  const updateThemeConfig = async (newConfig) => {
    try {
      await api.put('/theme-config/1/', newConfig);
      setThemeConfig(newConfig);
      enqueueSnackbar('Configurações de tema atualizadas com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar configurações de tema', { variant: 'error' });
    }
  };

  // Criação do tema MUI baseado nas configurações
  const muiTheme = themeConfig
    ? createTheme({
        palette: {
          primary: {
            main: themeConfig.primary_color,
            contrastText: themeConfig.secondary_color,
          },
          secondary: {
            main: themeConfig.secondary_color,
            contrastText: themeConfig.primary_color,
          },
          background: {
            default: themeConfig.background_color,
          },
          text: {
            primary: themeConfig.text_color,
          },
        },
        typography: {
          fontFamily: themeConfig.font_family,
        },
        spacing: themeConfig.padding,
        shape: {
          borderRadius: themeConfig.border_radius,
        },
        shadows: [themeConfig.box_shadow],
      })
    : createTheme(); // Tema padrão enquanto carrega

  if (loading) {
    return null; // Adicionar uma interface de carregamento
  }

  return (
    <ThemeContext.Provider value={{ themeConfig, updateThemeConfig }}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
