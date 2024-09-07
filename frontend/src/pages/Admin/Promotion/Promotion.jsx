import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import api from '../../../utils/api';
import PromotionDialog from '../../../components/PromotionDialog';
import { useSnackbar } from 'notistack';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState({
    nome_promo: '',
    percentual: '',
    valor_promocao: '',
    data_inicio: '',
    data_fim: '',
    produto: '',
    categoria: ''
  });

  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      const [promocoesResponse, produtosResponse, categoriasResponse] = await Promise.all([
        api.get('/promocoes/'),
        api.get('/produtos/'),
        api.get('/categories/list/')
      ]);

      setPromotions(promocoesResponse.data);
      setProducts(produtosResponse.data);
      setCategories(categoriasResponse.data);
    } catch (error) {
      console.error('Erro ao buscar promoções, produtos ou categorias:', error);
      setError('Erro ao buscar promoções. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [enqueueSnackbar]);

  const handleOpenDialog = (promotion = null) => {
    setSelectedPromotion(
      promotion || {
        nome_promo: '',
        percentual: '',
        valor_promocao: '',
        data_inicio: '',
        data_fim: '',
        produto: '',
        categoria: ''
      }
    );
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedPromotion({
      nome_promo: '',
      percentual: '',
      valor_promocao: '',
      data_inicio: '',
      data_fim: '',
      produto: '',
      categoria: ''
    });
  };

  const handleSaveEdit = async () => {
    const { nome_promo, percentual, valor_promocao, data_inicio, data_fim, produto, categoria } = selectedPromotion;

    if (!nome_promo.trim() || (!percentual && !valor_promocao) || !data_inicio || !data_fim) {
      enqueueSnackbar('Preencha todos os campos obrigatórios.', { variant: 'warning' });
      return false;
    }

    const payload = {
      nome_promo,
      percentual: percentual ? parseFloat(percentual) : null,
      valor_promocao: valor_promocao ? parseFloat(valor_promocao) : null,
      data_inicio,
      data_fim,
      produto: produto || null,
      categoria: categoria || null
    };

    try {
      const response = selectedPromotion.id
        ? await api.put(`/promocoes/${selectedPromotion.id}/`, payload)
        : await api.post('/promocoes/', payload);

      setPromotions((prev) =>
        selectedPromotion.id ? prev.map((p) => (p.id === selectedPromotion.id ? response.data : p)) : [...prev, response.data]
      );
      handleCloseDialog();
      fetchData(); // Recarrega os dados após a ação de salvamento
      return true;
    } catch (error) {
      enqueueSnackbar('Erro ao salvar promoção', { variant: 'error' });
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
    { field: 'nome_promo', headerName: 'Nome', width: 200 },
    { field: 'percentual', headerName: 'Percentual', type: 'number', width: 100 },
    { field: 'valor_promocao', headerName: 'Valor Promoção', type: 'number', width: 120 },
    { field: 'data_inicio', headerName: 'Data Início', width: 180 },
    { field: 'data_fim', headerName: 'Data Fim', width: 180 },
    { field: 'produto', headerName: 'Produto', width: 150 },
    { field: 'categoria', headerName: 'Categoria', width: 150 },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 250,
      renderCell: (params) => (
        <div>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog(params.row)}>
            Editar
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <p>Carregando promoções...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 4, alignSelf: 'flex-start', ml: 6 }}
        onClick={() => handleOpenDialog()}
      >
        Criar Nova Promoção
      </Button>
      <Box sx={{ height: 600, width: '95%' }}>
        <DataGrid
          rows={promotions}
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
          checkboxSelection
        />
      </Box>

      <PromotionDialog
        open={open}
        onClose={handleCloseDialog}
        selectedPromotion={selectedPromotion}
        handleSaveEdit={handleSaveEdit}
        products={products}
        categories={categories}
        setSelectedPromotion={setSelectedPromotion}
      />
    </Box>
  );
};

export default PromotionsPage;
