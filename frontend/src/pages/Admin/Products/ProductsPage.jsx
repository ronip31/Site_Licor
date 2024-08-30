import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import api from '../../../utils/api';
import ImageEditDialog from '../../../components/ImageEditDialog';
import ProductDialog from '../../../components/ProductDialog';
import { useSnackbar } from 'notistack';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidade_estoque: '',
    categoria: '',
    sku: '',
    status: 'Inativo',
  });

  const { enqueueSnackbar } = useSnackbar(); 

  const validateFields = () => {
    const { nome, descricao, preco, quantidade_estoque, categoria, sku, status } = selectedProduct;
    
    if (!nome.trim() || !descricao.trim() || !preco || !quantidade_estoque || !categoria || !sku.trim() || !status) {
      enqueueSnackbar('Todos os campos são obrigatórios.', { variant: 'warning' });
      return false; // Retorna false se algum campo estiver vazio
    }
    
    return true; // Retorna true se todos os campos estiverem preenchidos corretamente
  };
    

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/produtos/');
        console.log("Produtos carregados:", response.data);
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
        console.log('Categorias carregadas:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };
  
    fetchProducts();
    fetchCategories();
  }, [enqueueSnackbar]);
  
  

  const handleOpenDialog = (product = null) => {
    setSelectedProduct(
      product || {
        nome: '',
        descricao: '',
        preco: '',
        quantidade_estoque: '',
        categoria: '',
        sku: '',
        status: 'Inativo', // Define o padrão como 'Inativo'
      }
    );
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProduct({
      nome: '',
      descricao: '',
      preco: '',
      quantidade_estoque: '',
      categoria: '',
      sku: '',
      status: 'Inativo',
    });
  };

  const handleOpenImageDialog = (product) => {
    setSelectedProduct(product);
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!validateFields()) return false;


    const formData = new FormData();
      formData.append('nome', selectedProduct.nome);
      formData.append('descricao', selectedProduct.descricao);
      formData.append('preco', selectedProduct.preco);
      formData.append('quantidade_estoque', selectedProduct.quantidade_estoque);
      formData.append('categoria', selectedProduct.categoria);
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
  
        setProducts((prev) =>
          selectedProduct.id ? prev.map((p) => (p.id === selectedProduct.id ? response.data : p)) : [...prev, response.data]
        );
        handleCloseDialog();
        return true; // Retorna true indicando sucesso
      } catch (error) {
        enqueueSnackbar('Erro ao salvar produto', { variant: 'error' });
        return false; // Retorna false indicando falha
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
        onClick={() => handleOpenDialog()}
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

      <ProductDialog
        open={open}
        onClose={handleCloseDialog}
        selectedProduct={selectedProduct}
        handleSaveEdit={handleSaveEdit}
        categories={categories}
        setSelectedProduct={setSelectedProduct}
      />

      <ImageEditDialog open={imageDialogOpen} onClose={handleCloseImageDialog} productId={selectedProduct?.id} />
    </div>
  );
};

export default ProductsPage;
