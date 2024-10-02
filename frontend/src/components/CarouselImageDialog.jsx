import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import api from '../utils/api';

const CarouselImageEditDialog = ({ open, onClose, carouselImageId }) => {
  const [existingImage, setExistingImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  // Função para buscar imagem do carrossel
  const handleFetchImage = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/carousel-admin/${carouselImageId}/`);
      setExistingImage(response.data.imagem); // Define a imagem existente
    } catch (error) {
      console.error('Erro ao carregar imagem do carrossel:', error);
      enqueueSnackbar('Erro ao carregar imagem', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [carouselImageId, enqueueSnackbar]);

  // Atualiza a imagem quando o diálogo é aberto
  useEffect(() => {
    if (open && carouselImageId) {
      handleFetchImage();
    }
  }, [open, carouselImageId, handleFetchImage]);

  // Lida com a mudança da imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        enqueueSnackbar(`Tipo de arquivo não permitido: ${file.type}`, { variant: 'error' });
      } else if (file.size > MAX_IMAGE_SIZE) {
        enqueueSnackbar(`Arquivo ${file.name} é muito grande. O tamanho máximo permitido é 5MB.`, { variant: 'error' });
      } else {
        setNewImage(file);
        setSelectedFileName(file.name);
      }
    }
  };

  // Excluir imagem
  const handleDeleteImage = async () => {
    setLoading(true);
    try {
      await api.patch(`/carousel-admin/${carouselImageId}/`, { imagem: null });
      setExistingImage(null); // Remove a imagem existente da visualização
      setDeleteConfirmOpen(false);
      enqueueSnackbar('Imagem excluída com sucesso', { variant: 'success' });
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      enqueueSnackbar('Erro ao excluir imagem', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Salvar nova imagem
  const handleSaveImage = async () => {
    if (!newImage) {
      enqueueSnackbar('Selecione uma imagem para adicionar.', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('imagem', newImage);

    setLoading(true);
    try {
      await api.patch(`/carousel-admin/${carouselImageId}/`, formData);
      enqueueSnackbar('Imagem atualizada com sucesso', { variant: 'success' });
      setNewImage(null);
      setSelectedFileName('');
      handleFetchImage(); // Atualiza a imagem após salvar
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      enqueueSnackbar('Erro ao salvar imagem', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmDialog = () => {
    setDeleteConfirmOpen(true);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Editar Imagem do Carrossel</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {existingImage ? (
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <img
                    src={existingImage}
                    alt="Imagem atual"
                    onClick={() => setSelectedImage(existingImage)} // Clicável para visualização maior
                    style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', cursor: 'pointer', borderRadius: 8 }}
                  />
                  <IconButton
                    onClick={openDeleteConfirmDialog}
                    color="secondary"
                    style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#fff' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ) : (
                <p>Nenhuma imagem adicionada.</p>
              )}

              <Button variant="contained" component="label">
                Selecionar nova imagem
                <input type="file" hidden onChange={handleImageChange} accept="image/*" />
              </Button>
              {selectedFileName && (
                <div style={{ marginTop: '8px' }}>
                  <p>Arquivo selecionado: {selectedFileName}</p>
                </div>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
          <Button onClick={handleSaveImage} color="primary" disabled={loading || !newImage}>
            Salvar Imagem
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para visualizar a imagem ampliada */}
      <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)} maxWidth="md" fullWidth>
        <DialogContent>
          <img src={selectedImage ? `${selectedImage}` : ''} alt="Imagem ampliada" style={{ width: '100%', height: 'auto' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedImage(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmação para exclusão */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <p>Tem certeza de que deseja excluir esta imagem?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteImage} color="secondary" disabled={loading}>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CarouselImageEditDialog;
