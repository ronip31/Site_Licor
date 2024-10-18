import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button, Stack } from '@mui/material';
import api from '../../../utils/api';
import ImageEditDialog from '../../../components/ImageEditDialog';
import ProductDialog from '../../../components/ProductDialog';
import { useSnackbar } from 'notistack';

const ProductsPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marks, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedFileNames, setSelectedFileNames] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    nome: '',
    descricao: '',
    preco_custo: '',
    preco_venda: '',
    quantidade_estoque: '',
    categoria: [],
    marca: '',
    status: 'Inativo',
    teor_alcoolico: '',
    volume: '',
    altura: '',
    largura: '',
    comprimento: '',
    peso: '',
  });

  // Função para baixar o template XLSX
  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get('/produtos/template/download/', {
        responseType: 'blob',  // Importante para baixar arquivos binários
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'produtos_template.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      enqueueSnackbar('Erro ao baixar o template.', { variant: 'error' });
    }
  };

  // Função para enviar o arquivo XLSX
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImportProducts = async () => {
    if (!selectedFile) {
      enqueueSnackbar('Selecione um arquivo antes de importar.', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await api.post('/produtos/import/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      enqueueSnackbar('Produtos importados com sucesso!', { variant: 'success' });
      setSelectedFile(null);  // Limpa o nome do arquivo após importação
      fetchData();  // Recarrega os dados após importação
    } catch (error) {
      enqueueSnackbar('Erro ao importar produtos.', { variant: 'error' });
    }
  };

  const validateFields = () => {
    const { nome, descricao, preco_custo, preco_venda, categoria, status } = selectedProduct;

    if (!nome.trim() || !descricao.trim() || !preco_custo || !preco_venda || !categoria || !status) {
      enqueueSnackbar('Todos os campos são obrigatórios.', { variant: 'warning' });
      return false;
    }
    return true;
  };

  const fetchData = async () => {
    try {
      const [produtosResponse, categoriasResponse, marcasResponse] = await Promise.all([
        api.get('/produtos/'),
        api.get('/categorias/'),
        api.get('/marcas/'),
      ]);

      const produtos = produtosResponse.data;
      const categorias = categoriasResponse.data;
      const marcas = marcasResponse.data;

      // Mapeamento para categorias e marcas
      const categoriaMap = categorias.reduce((map, categoria) => {
        map[categoria.id] = categoria.nome;
        return map;
      }, {});

      const marcasMap = marcas.reduce((map, marca) => {
        map[marca.id] = marca.nome;
        return map;
      }, {});

      // Adiciona o nome da categoria e marca a cada produto
      const produtosComNomeCategoriaEMarca = produtos.map((produto) => ({
        ...produto,
        nome_categoria: categoriaMap[produto.categoria] || '',
        nome_marca: marcasMap[produto.marca] || '',
      }));

      setProducts(produtosComNomeCategoriaEMarca);
      setCategories(categorias); // Define as categorias para o estado
      setMarcas(marcas); // Define as marcas para o estado

    } catch (error) {
      console.error('Erro ao buscar produtos, categorias ou marcas:', error);
      setError('Erro ao buscar produtos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [enqueueSnackbar]);

  // Funções de diálogo e salvar
  const handleOpenDialog = (product = null) => {
    setSelectedProduct(
      product || {
        nome: '',
        descricao: '',
        preco_custo: '',
        preco_venda: '',
        quantidade_estoque: '',
        categorias: [],
        marca: '',
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

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedProduct({
      nome: '',
      descricao: '',
      preco_custo: '',
      preco_venda: '',
      quantidade_estoque: '',
      categorias: [],
      marca: '',
      status: 'Inativo',
      teor_alcoolico: '',
      volume: '',
      altura: '',
      largura: '',
      comprimento: '',
      peso: '',
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
    formData.append('preco_custo', selectedProduct.preco_custo);
    formData.append('preco_venda', selectedProduct.preco_venda);
    formData.append('quantidade_estoque', selectedProduct.quantidade_estoque);
    formData.append('categoria', selectedProduct.categoria);
    formData.append('status', selectedProduct.status);
    formData.append('teor_alcoolico', selectedProduct.teor_alcoolico);
    formData.append('volume', selectedProduct.volume);
    formData.append('marca', selectedProduct.marca);
    formData.append('altura', selectedProduct.altura);
    formData.append('largura', selectedProduct.largura);
    formData.append('comprimento', selectedProduct.comprimento);
    formData.append('peso', selectedProduct.peso);

    try {
      const response = selectedProduct.uuid 
        ? await api.put(`/produtos/${selectedProduct.uuid}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await api.post('/produtos/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          setProducts((prev) =>
          selectedProduct.uuid
              ? prev.map((p) => (p.uuid === selectedProduct.uuid ? response.data : p))
              : [...prev, response.data]
      );
      handleCloseDialog();
      fetchData(); // Recarrega os dados após a ação de salvamento
      return true;
    } catch (error) {
      enqueueSnackbar('Erro ao salvar produto', { variant: 'error' });
      return false;
    }
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport csvOptions={{ utf8WithBom: true }} />
      </GridToolbarContainer>
    );
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'descricao', headerName: 'Descrição', width: 130 },
    { field: 'preco_custo', headerName: 'Preço Custo', type: 'number', width: 90 },
    { field: 'preco_venda', headerName: 'Preço Venda', type: 'number', width: 90 },
    { field: 'quantidade_estoque', headerName: 'Estoque', type: 'number', width: 70 },
    { field: 'nome_categoria', headerName: 'Categoria', width: 100 },
    { field: 'teor_alcoolico', headerName: 'Teor Alcoólico', width: 100 },
    { field: 'volume', headerName: 'Volume', width: 90 },
    { field: 'nome_marca', headerName: 'Marca', width: 90 },
    { field: 'status', headerName: 'Status', width: 90 },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 250,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center" gap={1} height="100%">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleOpenDialog(params.row)}
          >
            Editar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleOpenImageDialog(params.row)}
          >
            Editar Fotos
          </Button>
        </Box>

      ),
    },
  ];

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Stack direction="row" spacing={4} sx={{ mb: 2, alignSelf: 'flex-start', ml: 6 }}>
        <Button
          variant="contained"
          color="secondary"
          style={{ marginTop: '9px' }}
          onClick={() => handleOpenDialog()}
        >
          Criar Novo Produto
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '9px' }}
          onClick={handleDownloadTemplate}
        >
          Baixar Template XLSX
        </Button>

        <Button
          variant="contained"
          component="label"
          style={{ marginTop: '9px' }}
        >
          Escolher Arquivo
          <input
            type="file"
            accept=".xlsx"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        {selectedFile && (
          <div style={{ marginTop: '9px' }}>
            <p>Arquivo selecionado: {selectedFile.name}</p>
          </div>
        )}

        <Button
          variant="contained"
          color="secondary"
          onClick={handleImportProducts}
          style={{ marginTop: '9px' }}
        >
          Importar Produtos
        </Button>
      </Stack>

      <Box sx={{ height: 500, width: '100%', fontSize: '0.875rem' }}>
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
          pageSizeOptions={[5, 10, 20]}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontSize: '0.875rem',
            },
            '& .MuiDataGrid-cell': {
              fontSize: '0.875rem',
            },
            '& .MuiButton-root': {
              fontSize: '0.75rem',
            },
          }}
        />
      </Box>

      <ProductDialog
        open={open}
        onClose={handleCloseDialog}
        selectedProduct={selectedProduct}
        handleSaveEdit={handleSaveEdit}
        categories={categories}
        marks={marks}
        setSelectedProduct={setSelectedProduct}
      />

      <ImageEditDialog open={imageDialogOpen} onClose={handleCloseImageDialog} productId={selectedProduct.uuid} />
    </Box>
  );
};

export default ProductsPage;
