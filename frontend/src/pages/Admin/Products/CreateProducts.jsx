import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import api from '../../../utils/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/product/lista/');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setError('Erro ao buscar produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  // Função para salvar edição de produto existente
  const handleSaveEdit = async () => {
    if (selectedProduct.id) {
      try {
        const response = await api.put(`/product/${selectedProduct.id}/`, selectedProduct);
        setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? response.data : p)));
        handleCloseDialog();
      } catch (error) {
        console.error('Erro ao editar produto:', error);
        setError('Erro ao editar produto. Tente novamente mais tarde.');
      }
    } else {
      handleCreateProduct();
    }
  };

  // Função para criar um novo produto
  const handleCreateProduct = async () => {
    try {
      const response = await api.post('/createproduct/', selectedProduct);
      setProducts([...products, response.data]);
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      setError('Erro ao criar produto. Tente novamente mais tarde.');
    }
  };

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
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog(params.row)}>
          Editar
        </Button>
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
          <TextField
            margin="dense"
            label="Categoria"
            fullWidth
            value={selectedProduct?.categoria || ''}
            onChange={(e) => setSelectedProduct({ ...selectedProduct, categoria: e.target.value })}
          />
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
    </div>
  );
};

export default ProductsPage;
