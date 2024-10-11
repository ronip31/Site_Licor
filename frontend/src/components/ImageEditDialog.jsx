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
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { useSnackbar } from 'notistack';
import api from '../utils/api';

// Definir a base da URL para os arquivos de mídia (substituindo localhost pelo IP correto)
const mediaBaseURL = `http://${window.location.hostname}:8000`; // ou substitua diretamente pelo seu IP, se necessário

const ImageEditDialog = ({ open, onClose, productId }) => {
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rotationAngles, setRotationAngles] = useState({}); // Estado para guardar os ângulos de rotação

  const { enqueueSnackbar } = useSnackbar();
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  // Função para carregar as imagens existentes
  const handleFetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/imagens/por_produto/${productId}/`);
      setExistingImages(response.data);
      setRotationAngles(response.data.reduce((acc, img) => {
        acc[img.uuid] = 0; // Inicializa o ângulo de rotação para cada imagem
        return acc;
      }, {}));
    } catch (error) {
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
        enqueueSnackbar(`Arquivo ${file.name} é muito grande. O tamanho máximo permitido é 10MB.`, { variant: 'error' });
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

  const rotateImage = async (imageId) => {
    setRotationAngles((prevAngles) => ({
      ...prevAngles,
      [imageId]: prevAngles[imageId] + 90,
    }));
  
    // Enviar rotação para o backend
    try {
      await api.post(`/imagens/${imageId}/rotacionar/`, {
        rotation: 90, // Envia um valor de rotação de 90 graus
      }, {
        headers: {
          'Content-Type': 'application/json', // Certifique-se de enviar como JSON
        },
      });
      enqueueSnackbar('Imagem rotacionada e salva com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao salvar rotação da imagem', { variant: 'error' });
    }
  };

  const handleDialogClose = () => {
    setImages([]);  // Limpa as imagens selecionadas
    setSelectedFileNames([]);  // Limpa os nomes dos arquivos
    onClose();  // Fecha o diálogo
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
      >
        <DialogTitle id="customized-dialog-title">Visualizar e Editar Fotos</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={3}>
              {existingImages.map((image) => {
                const imageUrl = `${mediaBaseURL}${image.imagem}`; // Monta o caminho completo da imagem
                return (
                  <Grid item xs={6} md={3} key={image.uuid}>
                    <div style={{ position: 'relative' }}>
                    <img
                        src={imageUrl}
                        alt={image.descricao_imagem || 'Imagem do produto'}
                        style={{
                          width: '100%',
                          cursor: 'pointer',
                          borderRadius: 8,
                          transform: `rotate(${rotationAngles[image.uuid]}deg)`, // Aplica a rotação
                          transition: 'transform 0.3s ease',
                        }}
                        onClick={() => setSelectedImage(image.imagem)}
                      />
                      <IconButton
                        onClick={() => openDeleteConfirmDialog(image.uuid)}
                        color="secondary"
                        style={{ position: 'absolute', top: 0, right: -25, backgroundColor: '#fff' }}
                      >
                        <DeleteIcon />
                        </IconButton>
                      {/* Botão único de rotação */}
                      <IconButton
                        onClick={() => rotateImage(image.uuid)}
                        style={{ position: 'absolute', bottom: 0, right: -25, backgroundColor: '#fff' }}
                      >
                        <RotateLeftIcon />
                      </IconButton>
                    </div>
                  </Grid>
                );
              })}
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
          <Button onClick={handleDialogClose}>Fechar</Button>
          <Button onClick={handleAddImages} color="primary" disabled={loading || images.length === 0}>
            Adicionar Imagens
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)} maxWidth="md" fullWidth>
        <DialogContent>
          <img src={selectedImage ? `${mediaBaseURL}${selectedImage}` : ''} alt="Imagem ampliada" style={{ width: '100%', height: 'auto' }} />
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
