import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
  
    const { enqueueSnackbar } = useSnackbar(); // Usa o hook useSnackbar
  
    useEffect(() => {
      if (open && productId) {
        const fetchImages = async () => {
          try {
            const response = await api.get(`/imagens/por_produto/${productId}/`);
            setExistingImages(response.data);
          } catch (error) {
            console.error('Erro ao carregar imagens:', error);
            enqueueSnackbar('Erro ao carregar imagens', { variant: 'error' });
          }
        };
    
        fetchImages();
      }
    }, [open, productId, enqueueSnackbar]);
  
    const handleImageChange = (e) => {
      const files = [...e.target.files];
      setImages(files);
      setSelectedFileNames(files.map((file) => file.name));
    };
  
    const handleDeleteImage = async () => {
      try {
        await api.delete(`/imagens/${imageToDelete}/`);
        setExistingImages((prev) => prev.filter((img) => img.id !== imageToDelete));
        setDeleteConfirmOpen(false);
        enqueueSnackbar('Imagem excluída com sucesso', { variant: 'warning' }); // Notificação de sucesso
      } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        enqueueSnackbar('Erro ao excluir imagem', { variant: 'error' }); // Notificação de erro
      }
    };
  
    const handleAddImages = async () => {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('imagens', image);
      });
    
      try {
        console.log('Enviando imagens:', images);
        const response = await api.post(`/imagens/por_produto/${productId}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
    
        console.log('Resposta do servidor:', response.data);
        enqueueSnackbar('Imagem adicionada com sucesso', { variant: 'success' });
        
        // Limpar os estados após adicionar as imagens
        setImages([]);
        setSelectedFileNames([]); // Limpa os nomes dos arquivos selecionados
    
        const reloadResponse = await api.get(`/imagens/por_produto/${productId}/`);
        setExistingImages(reloadResponse.data);
      } catch (error) {
        console.error('Erro ao adicionar imagens:', error);
        enqueueSnackbar('Erro ao adicionar imagens', { variant: 'error' }); // Notificação de erro
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
            {existingImages.map((image) => (
              <div key={image.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <ImageWithPlaceholder
                  src={image.imagem}
                  alt={image.descricao_imagem || 'Imagem do produto'}
                  onClick={() => setSelectedImage(image.imagem)}
                />
                <IconButton onClick={() => openDeleteConfirmDialog(image.id)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
  
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
              <div style={{ marginTop: '8px' }}>
                <p>Arquivos selecionados: {selectedFileNames.join(', ')}</p>
              </div>
            )}
          </DialogContent>
  
          <DialogActions>
            <Button onClick={onClose}>Fechar</Button>
            <Button onClick={handleAddImages} color="primary">
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
            <Button onClick={handleDeleteImage} color="secondary">
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
  
  export default ImageEditDialog;