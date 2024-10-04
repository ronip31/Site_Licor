import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import api from '../../../utils/api';
import CouponDialog from '../../../components/CouponDialog';
import { useSnackbar } from 'notistack';
import './CouponsPage.css';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState({
    codigo: '',
    descricao: '',
    tipo: '',
    valor: '',
    data_inicio: '',
    data_fim: '',
    uso_maximo: '',
    uso_por_cliente: '',
    produtos: [],
    categorias: [],
    clientes_exclusivos: [],
    valor_minimo_compra: '',
    valor_maximo_desconto: '',
    ativo: true,
  });

  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      const [cuponsResponse, produtosResponse, categoriasResponse, clientesResponse] = await Promise.all([
        api.get('/cupons/'),
        api.get('/produtos/'),
        api.get('/categorias/'),
        api.get('/usuarios/lista/'),
      ]);

      const coupons = cuponsResponse.data;
      const products = produtosResponse.data;
      const categories = categoriasResponse.data;
      const customers = clientesResponse.data;

      // Ordena os cupons por ordem de validade: ativos, que vão começar, que já terminaram
      const sortedCoupons = coupons.sort((a, b) => {
        const now = new Date();
        const startDateA = new Date(a.data_inicio);
        const endDateA = new Date(a.data_fim);
        const startDateB = new Date(b.data_inicio);
        const endDateB = new Date(b.data_fim);

        const isActiveA = startDateA <= now && endDateA >= now;
        const isActiveB = startDateB <= now && endDateB >= now;

        const isFutureA = startDateA > now;
        const isFutureB = startDateB > now;

        if (isActiveA && !isActiveB) return -1;
        if (!isActiveA && isActiveB) return 1;
        if (isFutureA && !isFutureB) return -1;
        if (!isFutureA && isFutureB) return 1;

        return startDateA - startDateB;
      });

      setCoupons(sortedCoupons);
      setProducts(products);
      setCategories(categories);
      setCustomers(customers);
    } catch (error) {
      console.error('Erro ao buscar cupons, produtos, categorias ou clientes:', error);
      setError('Erro ao buscar cupons. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [enqueueSnackbar]);

  const handleOpenDialog = (coupon = null) => {
    setSelectedCoupon(
      coupon || {
        codigo: '',
        descricao: '',
        tipo: '',
        valor: '',
        data_inicio: '',
        data_fim: '',
        uso_maximo: '',
        uso_por_cliente: '',
        produtos: [],
        categorias: [],
        clientes_exclusivos: [],
        valor_minimo_compra: '',
        valor_maximo_desconto: '',
        ativo: true,
      }
    );
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCoupon({
      codigo: '',
      descricao: '',
      tipo: '',
      valor: '',
      data_inicio: '',
      data_fim: '',
      uso_maximo: '',
      uso_por_cliente: '',
      produtos: [],
      categorias: [],
      clientes_exclusivos: [],
      valor_minimo_compra: '',
      valor_maximo_desconto: '',
      ativo: true,
    });
  };

  const handleSaveEdit = async () => {
    const { codigo, descricao, tipo, valor, data_inicio, data_fim, uso_maximo, uso_por_cliente, produtos, categorias, clientes_exclusivos, valor_minimo_compra, valor_maximo_desconto, ativo } = selectedCoupon;

    if (!codigo.trim() || !tipo || !data_inicio || !data_fim) {
      enqueueSnackbar('Preencha todos os campos obrigatórios.', { variant: 'warning' });
      return false;
    }

    const payload = {
      codigo,
      descricao,
      tipo,
      valor: valor ? parseFloat(valor) : null,
      data_inicio,
      data_fim,
      uso_maximo: uso_maximo ? parseInt(uso_maximo) : null,
      uso_por_cliente: uso_por_cliente ? parseInt(uso_por_cliente) : null,
      produtos,
      categorias,
      clientes_exclusivos,
      ativo,
      valor_minimo_compra,
      valor_maximo_desconto,
    };

    try {
      const response = selectedCoupon.id
        ? await api.put(`/cupons/${selectedCoupon.id}/`, payload)
        : await api.post('/cupons/', payload);

      setCoupons((prev) =>
        selectedCoupon.id ? prev.map((c) => (c.id === selectedCoupon.id ? response.data : c)) : [...prev, response.data]
      );
      handleCloseDialog();
      fetchData(); // Recarrega os dados após a ação de salvamento
      return true;
    } catch (error) {
      enqueueSnackbar('Erro ao salvar cupom', { variant: 'error' });
      return false;
    }
  };

  const getRowClassName = (params) => {
    const now = new Date();
    const startDate = new Date(params.row.data_inicio);
    const endDate = new Date(params.row.data_fim);

    if (startDate > now) {
      return 'coupon-starting'; // Cupom que vai começar
    } else if (endDate < now) {
      return 'coupon-ended'; // Cupom que terminou
    } else {
      return 'coupon-active'; // Cupom ativo
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
    { field: 'codigo', headerName: 'Código', width: 150 },
    { field: 'descricao', headerName: 'Descrição', width: 200 },
    { field: 'tipo', headerName: 'Tipo', width: 100 },
    { field: 'valor', headerName: 'Valor', type: 'number', width: 100 },
    { field: 'data_inicio', headerName: 'Data Início', width: 210 },
    { field: 'data_fim', headerName: 'Data Fim', width: 210 },
    { field: 'uso_maximo', headerName: 'Uso Máximo', type: 'number', width: 100 },
    { field: 'uso_por_cliente', headerName: 'Uso por Cliente', type: 'number', width: 130 },
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

  if (loading) return <p>Carregando cupons...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 >Criação e configuração de Cupons</h2>
      <h3> Tipos de cupons pode ser por porcentual, valor fixo, ou frete grátis.</h3>
      <h3> Cupons podem ser criados por produtos, categoria ou clientes específicos.</h3>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 4, alignSelf: 'flex-start', ml: 6 }}
          onClick={() => handleOpenDialog()}
        >
          Criar Novo Cupom
        </Button>
        <Box sx={{ height: 600, width: '95%' }}>
          <DataGrid
            rows={coupons}
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
          />
        </Box>

        <CouponDialog
          open={open}
          onClose={handleCloseDialog}
          selectedCoupon={selectedCoupon}
          handleSaveEdit={handleSaveEdit}
          products={products}
          categories={categories}
          customers={customers}
          setSelectedCoupon={setSelectedCoupon}
        />
      </Box>
    </div>
  );
};

export default CouponsPage;
