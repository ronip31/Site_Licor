import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import api from '../../../utils/api';
import PromotionDialog from '../../../components/PromotionDialog';
import { useSnackbar } from 'notistack';
import './PromotionPage.css';

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
    produtos: [],
    categorias: [],
  });

  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      const [promocoesResponse, produtosResponse, categoriasResponse] = await Promise.all([
        api.get('/promocoes/'),
        api.get('/product_cupom/'),
        api.get('/categorias/')
      ]);

      const promotions = promocoesResponse.data;
      const products = produtosResponse.data;
      const categories = categoriasResponse.data;

      // Ordena as promoções de acordo com a regra: ativas, que vão começar, que já terminaram
      const sortedPromotions = promotions.sort((a, b) => {
        const now = new Date();
        const startDateA = new Date(a.data_inicio);
        const endDateA = new Date(a.data_fim);
        const startDateB = new Date(b.data_inicio);
        const endDateB = new Date(b.data_fim);

        // Promoção ativa
        const isActiveA = startDateA <= now && endDateA >= now;
        const isActiveB = startDateB <= now && endDateB >= now;

        // Promoção futura
        const isFutureA = startDateA > now;
        const isFutureB = startDateB > now;

        if (isActiveA && !isActiveB) return -1;
        if (!isActiveA && isActiveB) return 1;
        if (isFutureA && !isFutureB) return -1;
        if (!isFutureA && isFutureB) return 1;

        // Se ambas são do mesmo tipo (ativas ou futuras), ordena por data de início
        return startDateA - startDateB;
      });

      setPromotions(sortedPromotions);
      setProducts(products);
      setCategories(categories);
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
        produtos: [],
        categorias: [],
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
      produtos: [],
      categorias: [],
    });
  };

  const handleSaveEdit = async () => {
    const { nome_promo, percentual, valor_promocao, data_inicio, data_fim, produtos, categorias } = selectedPromotion;

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
      produtos,
      categorias,
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
      enqueueSnackbar('Promoção salva com sucesso!', { variant: 'success' });
      return true;
    } catch (error) {
      enqueueSnackbar('Erro ao salvar promoção', { variant: 'error' });
      return false;
    }
  };

  const getRowClassName = (params) => {
    const now = new Date();
    const startDate = new Date(params.row.data_inicio);
    const endDate = new Date(params.row.data_fim);

    if (startDate > now) {
      return 'promotion-starting'; // Promoção que vai começar
    } else if (endDate < now) {
      return 'promotion-ended'; // Promoção que terminou
    } else {
      return 'promotion-active'; // Promoção ativa
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
    { field: 'data_inicio', headerName: 'Data Início', width: 210 },
    { field: 'data_fim', headerName: 'Data Fim', width: 210 },
    { field: 'produtos', headerName: 'Produto', width: 150 },
    { field: 'categorias', headerName: 'Categoria', width: 150 },
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
          getRowClassName={getRowClassName}
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
          autoHeight
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
