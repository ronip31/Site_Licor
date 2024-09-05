import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import api from '../../../utils/api';
import ImageEditDialog from '../../../components/ImageEditDialog';
import ProductDialog from '../../../components/ProductDialog';
import { useSnackbar } from 'notistack';



// Componente principal da página de produtos
const ProductsPage = () => {
  // Estados para armazenar produtos, categorias, status de carregamento e erros
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marks, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // Controle de abertura do diálogo de produtos
  const [imageDialogOpen, setImageDialogOpen] = useState(false); // Controle de abertura do diálogo de imagens
  const [selectedProduct, setSelectedProduct] = useState({
    nome: '',
        descricao: '',
        preco_custo: '',
        preco_venda: '',
        quantidade_estoque: '',
        categoria: '',
        marca: '',
        sku: '',
        status: 'Inativo', 
        teor_alcoolico: '',
        volume: '',
        altura: '',
        largura: '',
        comprimento: '',
        peso: '',
  });


  const { enqueueSnackbar } = useSnackbar(); // Hook para exibir notificações

  // Função para validar os campos do formulário de produtos
  const validateFields = () => {
    const { nome, descricao, preco_custo, preco_venda, quantidade_estoque, categoria, sku, status } = selectedProduct;
    
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!nome.trim() || !descricao.trim() || !preco_custo ||!preco_venda || !quantidade_estoque || !categoria || !sku.trim() || !status) {
      enqueueSnackbar('Todos os campos são obrigatórios.', { variant: 'warning' });
      return false; // Retorna false se algum campo estiver vazio
    }
    
    return true; // Retorna true se todos os campos estiverem preenchidos corretamente
  };

  // Efeito para buscar produtos e categorias quando o componente é montado
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Faz uma requisição para buscar todos os produtos
        const response = await api.get('/produtos/');
        const produtos = response.data;
  
        // Faz uma requisição para buscar todas as categorias
        const categoriaResponse = await api.get('/categories/list/');
        const categorias = categoriaResponse.data;
  
        // Faz uma requisição para buscar todas as marcas
        const marcasResponse = await api.get('/marca/');
        const marcas = marcasResponse.data;
  
        // Cria mapas para categorias e marcas
        const categoriaMap = {};
        categorias.forEach((categoria) => {
          categoriaMap[categoria.id] = categoria.nome;
        });
  
        const marcasMap = {};
        marcas.forEach((marca) => {
          marcasMap[marca.id] = marca.nome;
        });
  
        // Adiciona o nome da categoria e marca a cada produto
        const produtosComNomeCategoriaEMarca = produtos.map((produto) => ({
          ...produto,
          nome_categoria: categoriaMap[produto.categoria] || '',
          nome_marca: marcasMap[produto.marca] || '',
        }));
  
        setProducts(produtosComNomeCategoriaEMarca); // Armazena os produtos no estado
  
      } catch (error) {
        console.error('Erro ao buscar produtos, categorias ou marcas:', error);
        setError('Erro ao buscar produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false); // Desativa o estado de carregamento
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('categories/list/');
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    const fetchmarks = async () => {
      try {
        const response = await api.get('marca/');
        setMarcas(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchmarks();

  }, [enqueueSnackbar]);
  

  // Função para abrir o diálogo de criação/edição de produtos
  const handleOpenDialog = (product = null) => {
    setSelectedProduct(
      product || {
        nome: '',
        descricao: '',
        preco_custo: '',
        preco_venda: '',
        quantidade_estoque: '',
        categoria: '',
        marca: '',
        sku: '',
        status: 'Inativo', 
        teor_alcoolico: '',
        volume: '',
        altura: '',
        largura: '',
        comprimento: '',
        peso: '',
      }
    );
    setOpen(true);
  };

  // Função para fechar o diálogo de produtos e resetar o estado do produto selecionado
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProduct({
      nome: '',
      descricao: '',
      preco_custo: '',
      preco_venda: '',
      quantidade_estoque: '',
      categoria: '',
      marca: '',
      sku: '',
      status: 'Inativo', 
      teor_alcoolico: '',
      volume: '',
      altura: '',
      largura: '',
      comprimento: '',
      peso: '',
    });
  };

  // Função para abrir o diálogo de edição de imagens
  const handleOpenImageDialog = (product) => {
    setSelectedProduct(product);
    setImageDialogOpen(true);
  };

  // Função para fechar o diálogo de edição de imagens
  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
  };

  // Função para salvar as alterações de um produto (criação ou edição)
  const handleSaveEdit = async () => {
    if (!validateFields()) return false; // Interrompe se a validação falhar

    const formData = new FormData();
    formData.append('nome', selectedProduct.nome);
    formData.append('descricao', selectedProduct.descricao);
    formData.append('preco_custo', selectedProduct.preco_custo);
    formData.append('preco_venda', selectedProduct.preco_venda);
    formData.append('quantidade_estoque', selectedProduct.quantidade_estoque);
    formData.append('categoria', selectedProduct.categoria);
    formData.append('sku', selectedProduct.sku);
    formData.append('status', selectedProduct.status);
    formData.append('teor_alcoolico', selectedProduct.teor_alcoolico);
    formData.append('volume', selectedProduct.volume);
    formData.append('marca', selectedProduct.marca);
    formData.append('altura', selectedProduct.altura);
    formData.append('largura', selectedProduct.largura);
    formData.append('comprimento', selectedProduct.comprimento);
    formData.append('peso', selectedProduct.peso);

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

  // Função personalizada de toolbar para exportação com UTF-8 com BOM
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport csvOptions={{ utf8WithBom: true }} />
      </GridToolbarContainer>
    );
  }

  // Colunas do DataGrid que exibe a lista de produtos
  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'descricao', headerName: 'Descrição', width: 200 },
    { field: 'preco_custo', headerName: 'Preço Custo', type: 'number', width: 100 },
    { field: 'preco_venda', headerName: 'Preço Venda', type: 'number', width: 100 },
    { field: 'quantidade_estoque', headerName: 'Estoque', type: 'number', width: 80 },
    { field: 'nome_categoria', headerName: 'Categoria', width: 100 },
    { field: 'sku', headerName: 'SKU', width: 70 },
    { field: 'teor_alcoolico', headerName: 'Teor alcoolico', width: 110 },
    { field: 'volume', headerName: 'Volume', width: 70 },
    { field: 'nome_marca', headerName: 'Marca', width: 70 },
    { field: 'status', headerName: 'Status', width: 90 },
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
            Editar Fotos
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
          slots={{
          toolbar: CustomToolbar,

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

      {/* Diálogo para criar/editar produto */}
      <ProductDialog
        open={open}
        onClose={handleCloseDialog}
        selectedProduct={selectedProduct}
        handleSaveEdit={handleSaveEdit}
        categories={categories}
        marks={marks}
        setSelectedProduct={setSelectedProduct}
      />

      {/* Diálogo para visualizar/editar imagens */}
      <ImageEditDialog open={imageDialogOpen} onClose={handleCloseImageDialog} productId={selectedProduct?.id} />
    </div>
  );
};

export default ProductsPage;
