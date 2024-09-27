import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageWithPlaceholder from './ImageWithPlaceholder';
import { useSnackbar } from 'notistack';
import api from '../utils/api';

const ImageEditDialog = ({ open, onClose, productId }) => {
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  // Centraliza o carregamento de imagens
  const handleFetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/imagens/por_produto/${productId}/`);
      setExistingImages(response.data);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
      enqueueSnackbar('Erro ao carregar imagens', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [productId, enqueueSnackbar]);

  // Carrega as imagens sempre que o diálogo é aberto e o productId está disponível
  useEffect(() => {
    if (open && productId) {
      handleFetchImages();
    }
  }, [open, productId, handleFetchImages]);

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    const validFiles = [];

    files.forEach((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        enqueueSnackbar(`Tipo de arquivo não permitido: ${file.type}`, { variant: 'error' });
      } else if (file.size > MAX_IMAGE_SIZE) {
        enqueueSnackbar(`Arquivo ${file.name} é muito grande. O tamanho máximo permitido é 5MB.`, { variant: 'error' });
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setImages(validFiles);
      setSelectedFileNames(validFiles.map((file) => file.name));
    } else {
      setImages([]);
      setSelectedFileNames([]);
    }
  };

  const handleDeleteImage = async () => {
    setLoading(true);
    try {
      await api.delete(`/imagens/${imageToDelete}/`);
      setExistingImages((prev) => prev.filter((img) => img.uuid !== imageToDelete));
      setDeleteConfirmOpen(false);
      enqueueSnackbar('Imagem excluída com sucesso', { variant: 'success' });
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      enqueueSnackbar('Erro ao excluir imagem', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddImages = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('imagens', image);
    });

    setLoading(true);
    try {
      await api.post(`/imagens/por_produto/${productId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      enqueueSnackbar('Imagem adicionada com sucesso', { variant: 'success' });

      setImages([]);
      setSelectedFileNames([]);

      await handleFetchImages(); // Recarrega as imagens após adicionar
    } catch (error) {
      console.error('Erro ao adicionar imagens:', error);
      enqueueSnackbar('Erro ao adicionar imagens', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmDialog = (imageId) => {
    setImageToDelete(imageId);
    setDeleteConfirmOpen(true);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Visualizar e Editar Fotos</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={1}>
              {existingImages.map((image) => (
                <Grid item xs={6} md={2} key={image.uuid}>
                  <div style={{ position: 'relative' }}>
                    <ImageWithPlaceholder
                      src={image.imagem}
                      alt={image.descricao_imagem || 'Imagem do produto'}
                      onClick={() => setSelectedImage(image.imagem)}
                      style={{ width: '100%', cursor: 'pointer', borderRadius: 8 }}
                    />
                    <IconButton
                      onClick={() => openDeleteConfirmDialog(image.uuid)}
                      color="secondary"
                      style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#fff' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Grid>
              ))}
            </Grid>
          )}

          <Button
            variant="contained"
            component="label"
            style={{ marginTop: '16px' }}
          >
            Escolher arquivos
            <input
              type="file"
              multiple
              hidden
              onChange={handleImageChange}
              accept="image/*"
            />
          </Button>
          {selectedFileNames.length > 0 && (
            <div style={{ marginTop: '9px' }}>
              <p>Arquivos selecionados: {selectedFileNames.join(', ')}</p>
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
          <Button onClick={handleAddImages} color="primary" disabled={loading || images.length === 0}>
            Adicionar Imagens
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)} maxWidth="md" fullWidth>
        <DialogContent>
          <img src={selectedImage ? `${'http://localhost:8000'}${selectedImage}` : ''} alt="Imagem ampliada" style={{ width: '100%', height: 'auto' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedImage(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <p>Tem certeza que deseja excluir esta imagem?</p>
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

export default ImageEditDialog;
