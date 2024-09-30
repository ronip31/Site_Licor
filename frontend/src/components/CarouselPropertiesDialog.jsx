import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useSnackbar } from 'notistack';
import api from '../utils/api';

const CarouselPropertiesDialog = ({ open, onClose, selectedImage }) => {
  const [titulo, setTitulo] = useState('');
  const [ordem, setOrdem] = useState(0);
  const [ativo, setAtivo] = useState(true);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  // Função para formatar a data para o campo de datetime-local
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (selectedImage) {
      setTitulo(selectedImage.titulo || '');
      setOrdem(selectedImage.ordem || 0);
      setAtivo(selectedImage.ativo || false);
      setDataInicio(formatDate(selectedImage.data_inicio) || '');
      setDataFim(formatDate(selectedImage.data_fim) || '');
      setLinkUrl(selectedImage.link_url || '');
    } else {
      // Resetar os campos ao adicionar uma nova imagem
      setTitulo('');
      setOrdem(0);
      setAtivo(true);
      setDataInicio('');
      setDataFim('');
      setLinkUrl('');
    }
  }, [selectedImage]);

  const handleSave = async () => {
    const payload = {
      titulo,
      ordem,
      ativo,
      data_inicio: dataInicio,
      data_fim: dataFim,
      link_url: linkUrl,  // Incluindo o campo URL
    };

    try {
      if (selectedImage) {
        // Atualizar imagem existente
        await api.put(`/carousel-admin/${selectedImage.id}/`, payload);
      } else {
        // Criar nova imagem
        await api.post('/carousel-admin/', payload);
      }
      enqueueSnackbar('Propriedades do carrossel salvas com sucesso', { variant: 'success' });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar propriedades do carrossel:', error);
      enqueueSnackbar('Erro ao salvar propriedades do carrossel', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedImage ? 'Editar Propriedades' : 'Adicionar Nova Imagem'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Título"
          fullWidth
          margin="normal"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <TextField
          label="Ordem"
          fullWidth
          margin="normal"
          type="number"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              color="primary"
            />
          }
          label="Ativo"
        />
        <TextField
          label="Data Início"
          fullWidth
          margin="normal"
          type="datetime-local"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Data Fim"
          fullWidth
          margin="normal"
          type="datetime-local"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="URL (Opcional)"
          fullWidth
          margin="normal"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CarouselPropertiesDialog;
