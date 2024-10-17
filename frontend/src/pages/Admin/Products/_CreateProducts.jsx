import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../../utils/api';

// Componente para exibir imagem com placeholder de carregamento
const ImageWithPlaceholder = ({ src, alt, onClick }) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={onClick}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={24} />
        </div>
      )}
      <img
        src={src ? `${window.location.hostname}${src}` : ''}
        alt={alt}
        onLoad={handleImageLoad}
        style={{ display: loading ? 'none' : 'block', width: '100px', height: '100px' }}
      />
    </div>
  );
};

// Componente para o diálogo de visualização e edição de fotos
const ImageEditDialog = ({ open, onClose, productId }) => {
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false); // Estado para o modal de confirmação
  const [imageToDelete, setImageToDelete] = useState(null); // Estado para armazenar a imagem a ser excluída

  useEffect(() => {
    if (open && productId) {
      const fetchImages = async () => {
        try {
          const response = await api.get(`/imagens/por_produto/${productId}/`);
          console.log('Imagens carregadas:', response.data);
          setExistingImages(response.data);
        } catch (error) {
          console.error('Erro ao carregar imagens:', error);
        }
      };

      fetchImages();
    }
  }, [open, productId]);

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    console.log('Imagens selecionadas:', files);
    setImages(files);
  };

  const handleDeleteImage = async () => {
    try {
      await api.delete(`/imagens/${imageToDelete}/`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageToDelete));
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
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
      setImages([]);
      const reloadResponse = await api.get(`/imagens/por_produto/${productId}/`);
      setExistingImages(reloadResponse.data);
    } catch (error) {
      console.error('Erro ao adicionar imagens:', error);
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
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
          <Button onClick={handleAddImages} color="primary">
            Adicionar Imagens
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para visualização ampliada da imagem */}
      <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)} maxWidth="md" fullWidth>
        <DialogContent>
          <img src={selectedImage ? `http://${window.location.hostname}${selectedImage}` : ''} alt="Imagem ampliada" style={{ width: '100%', height: 'auto' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedImage(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
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


// Página de produtos
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Estado para categorias
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  // Busca os produtos e categorias quando o componente é montado
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/produtos/');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Erro ao buscar produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/list/');
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchProducts();
    fetchCategories(); // Carrega as categorias disponíveis
  }, []);

  // Abre o diálogo para criar ou editar um produto
  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  // Fecha o diálogo e limpa os estados
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  // Abre o diálogo para visualizar e editar fotos
  const handleOpenImageDialog = (product) => {
    setSelectedProduct(product);
    setImageDialogOpen(true);
  };

  // Fecha o diálogo de visualização de fotos
  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
  };

  // Salva as alterações do produto, seja criando ou editando
  const handleSaveEdit = async () => {
    const formData = new FormData();
    formData.append('nome', selectedProduct.nome);
    formData.append('descricao', selectedProduct.descricao);
    formData.append('preco', selectedProduct.preco);
    formData.append('quantidade_estoque', selectedProduct.quantidade_estoque);
    formData.append('categoria', selectedProduct.categoria); // Categoria como ID
    formData.append('sku', selectedProduct.sku);
    formData.append('status', selectedProduct.status);

    try {
      const response = selectedProduct.id
        ? await api.put(`/produtos/${selectedProduct.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await api.post('/produtos/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

      // Atualiza a lista de produtos com o produto salvo/atualizado
      setProducts((prev) =>
        selectedProduct.id ? prev.map((p) => (p.id === selectedProduct.id ? response.data : p)) : [...prev, response.data]
      );
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      setError('Erro ao salvar produto. Tente novamente mais tarde.');
    }
  };

  // Colunas para o DataGrid que exibe a lista de produtos
  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'nome', headerName: 'Nome', width: 300 },
    { field: 'descricao', headerName: 'Descrição', width: 250 },
    { field: 'preco', headerName: 'Preço', type: 'number', width: 90 },
    { field: 'quantidade_estoque', headerName: 'Estoque', type: 'number', width: 110 },
    { field: 'categoria', headerName: 'Categoria', width: 110 },
    { field: 'sku', headerName: 'SKU', width: 110 },
    { field: 'status', headerName: 'Status', width: 110 },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 350,
      renderCell: (params) => (
        <div>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog(params.row)}>
            Editar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            style={{ marginLeft: 8 }}
            onClick={() => handleOpenImageDialog(params.row)}
          >
            Visualizar e Editar Fotos
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Produtos</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog({ nome: '', descricao: '', preco: '', quantidade_estoque: '' })}
      >
        Criar Novo Produto
      </Button>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={products}
          columns={columns}
          components={{
            Toolbar: GridToolbar,
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>

      {/* Dialog para criar ou editar produto */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{selectedProduct?.id ? 'Editar Produto' : 'Criar Novo Produto'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={selectedProduct?.nome || ''}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, nome: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descrição"
            fullWidth
            value={selectedProduct?.descricao || ''}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, descricao: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Preço"
            type="number"
            fullWidth
            value={selectedProduct?.preco || ''}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, preco: parseFloat(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Estoque"
            fullWidth
            value={selectedProduct?.quantidade_estoque || ''}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, quantidade_estoque: parseFloat(e.target.value) })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Categoria</InputLabel>
            <Select
              label="Categoria"
              value={selectedProduct?.categoria || ''}
              
              onChange={(e) => setSelectedProduct({ ...selectedProduct, categoria: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="SKU"
            fullWidth
            value={selectedProduct?.sku || ''}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, sku: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={selectedProduct?.status || 'Ativo'}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, status: e.target.value })}
            >
              <MenuItem value="Ativo">ATIVO</MenuItem>
              <MenuItem value="Inativo">INATIVO</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveEdit} color="primary">
            {selectedProduct?.id ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para visualizar e editar fotos */}
      <ImageEditDialog open={imageDialogOpen} onClose={handleCloseImageDialog} productId={selectedProduct?.id} />
    </div>
  );
};

export default ProductsPage;
