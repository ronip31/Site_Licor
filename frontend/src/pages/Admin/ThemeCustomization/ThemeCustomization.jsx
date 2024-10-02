import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, Paper, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem } from '@mui/material';
import { SketchPicker } from 'react-color';
import api from '../../../utils/api';
import { Edit as EditIcon, CheckCircleOutline as CheckIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const ThemeCustomization = () => {
  const [localTheme, setLocalTheme] = useState(null); // Inicia como null
  const [colorPickerOpen, setColorPickerOpen] = useState(null); // Controla qual picker está aberto
  const [loading, setLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const colorPickerRef = useRef(null);

  const { enqueueSnackbar } = useSnackbar();

  // Função para buscar o tema do servidor
  const fetchThemeConfig = async () => {
    try {
      const response = await api.get('/theme-config/1/');
      setLocalTheme(response.data);
    } catch (error) {
      console.error('Erro ao carregar configurações de tema:', error);
    }
  };

  useEffect(() => {
    fetchThemeConfig();
  }, []);

  // Event listener para fechar o seletor de cores quando clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setColorPickerOpen(null); // Fecha o seletor de cores se o clique for fora
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorPickerOpen]);

  if (!localTheme) {
    return <CircularProgress />;
  }

  const handleColorChange = (color, field) => {
    setLocalTheme({ ...localTheme, [field]: color.hex });
  };

  const handleFontChange = (e, field) => {
    setLocalTheme({ ...localTheme, [field]: e.target.value });
  };

  const handleInputChange = (e, field) => {
    setLocalTheme({ ...localTheme, [field]: e.target.value });
  };

  const handleSaveTheme = async () => {
    setLoading(true);
    try {
      await api.put('/theme-config/1/', localTheme);
      enqueueSnackbar('Tema salvo com sucesso', { variant: 'success' });
      setTimeout(() => setSavedMessage(''), 3000); // Limpa a mensagem após 3 segundos
    } catch (error) {
      console.error('Erro ao salvar o tema:', error);
      enqueueSnackbar('Erro ao salvar o tema', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderColorOption = (label, field, colorValue) => (
    <TableRow key={field}>
      <TableCell>{label}</TableCell>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: colorValue,
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            onClick={() => setColorPickerOpen(field)}
          />
          <IconButton onClick={() => setColorPickerOpen(field)}>
            <EditIcon />
          </IconButton>
          {colorPickerOpen === field && (
            <Box position="absolute" zIndex={1000} mt={1} ref={colorPickerRef}>
              <SketchPicker
                color={colorValue}
                onChangeComplete={(color) => handleColorChange(color, field)}
              />
            </Box>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Configuração de Tema</Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Personalize as cores, a tipografia e a aparência do seu site.
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Propriedade</TableCell>
              <TableCell>Configuração</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Cores */}
            {renderColorOption('Cor Primária', 'primary_color', localTheme.primary_color)}
            {renderColorOption('Cor Secundária', 'secondary_color', localTheme.secondary_color)}
            {renderColorOption('Cor de Fundo', 'background_color', localTheme.background_color)}
            {renderColorOption('Cor do Texto', 'text_color', localTheme.text_color)}
            {renderColorOption('Cor de Fundo do Header', 'header_background_color', localTheme.header_background_color)}
            {renderColorOption('Cor de Fundo do Footer', 'footer_background_color', localTheme.footer_background_color)}
            {renderColorOption('Cor do Texto do Footer', 'footer_text_color', localTheme.footer_text_color)}

            {/* Configurações de Tipografia */}
            <TableRow>
              <TableCell>Fonte Principal</TableCell>
              <TableCell>
                <Select
                  value={localTheme.font_family || ''}
                  onChange={(e) => handleFontChange(e, 'font_family')}
                  fullWidth
                >
                  <MenuItem value="Roboto, Arial, sans-serif">Roboto</MenuItem>
                  <MenuItem value="Arial, Helvetica, sans-serif">Arial</MenuItem>
                  <MenuItem value="Georgia, serif">Georgia</MenuItem>
                  <MenuItem value="Courier New, Courier, monospace">Courier New</MenuItem>
                </Select>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Tamanho do Texto Principal</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={localTheme.font_size || 16}
                  onChange={(e) => handleInputChange(e, 'font_size')}
                  fullWidth
                />
              </TableCell>
            </TableRow>

            {/* Espaçamento */}
            <TableRow>
              <TableCell>Espaçamento (Padding)</TableCell>
              <TableCell>
                <TextField
                  type="text"
                  value={localTheme.padding || '10px'}
                  onChange={(e) => handleInputChange(e, 'padding')}
                  fullWidth
                />
              </TableCell>
            </TableRow>

            {/* Bordas */}
            <TableRow>
              <TableCell>Raio da Borda</TableCell>
              <TableCell>
                <TextField
                  type="text"
                  value={localTheme.border_radius || '4px'}
                  onChange={(e) => handleInputChange(e, 'border_radius')}
                  fullWidth
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Sombra da Borda</TableCell>
              <TableCell>
                <TextField
                  type="text"
                  value={localTheme.box_shadow || 'none'}
                  onChange={(e) => handleInputChange(e, 'box_shadow')}
                  fullWidth
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveTheme}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={24} /> : <CheckIcon />}
        >
          {loading ? 'Salvando...' : 'Salvar Tema'}
        </Button>
      </Box>
    </Box>
  );
};

export default ThemeCustomization;
