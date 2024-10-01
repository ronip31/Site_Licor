import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from '@mui/material';
import api from '../../../utils/api';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';

const CategoriaMarcaPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false);
  const [marcaDialogOpen, setMarcaDialogOpen] = useState(false);
  const [editCategoria, setEditCategoria] = useState(null);
  const [editMarca, setEditMarca] = useState(null);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [descricaoCategoria, setDescricaoCategoria] = useState('');
  const [nomeMarca, setNomeMarca] = useState('');
  const [descricaoMarca, setDescricaoMarca] = useState('');

  // Funções para carregar os dados de Categorias e Marcas
  const fetchCategorias = async () => {
    try {
      const response = await api.get('/categorias/');
      setCategorias(response.data);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar categorias', { variant: 'error' });
    }
  };

  const fetchMarcas = async () => {
    try {
      const response = await api.get('/marcas/');
      setMarcas(response.data);
    } catch (error) {
      enqueueSnackbar('Erro ao carregar marcas', { variant: 'error' });
    }
  };

  // Função para abrir o diálogo de edição/criação de Categoria
  const handleOpenCategoriaDialog = (categoria = null) => {
    if (categoria) {
      setEditCategoria(categoria);
      setNomeCategoria(categoria.nome);
      setDescricaoCategoria(categoria.descricao);
    } else {
      setEditCategoria(null);
      setNomeCategoria('');
      setDescricaoCategoria('');
    }
    setCategoriaDialogOpen(true);
  };

  // Função para abrir o diálogo de edição/criação de Marca
  const handleOpenMarcaDialog = (marca = null) => {
    if (marca) {
      setEditMarca(marca);
      setNomeMarca(marca.nome);
      setDescricaoMarca(marca.descricao);
    } else {
      setEditMarca(null);
      setNomeMarca('');
      setDescricaoMarca('');
    }
    setMarcaDialogOpen(true);
  };

  // Função para salvar Categoria
  const handleSaveCategoria = async () => {
    const payload = { nome: nomeCategoria, descricao: descricaoCategoria };

    try {
      if (editCategoria) {
        await api.put(`/categorias/${editCategoria.id}/`, payload);
        enqueueSnackbar('Categoria atualizada com sucesso', { variant: 'success' });
      } else {
        await api.post('/categorias/', payload);
        enqueueSnackbar('Categoria criada com sucesso', { variant: 'success' });
      }
      setCategoriaDialogOpen(false);
      fetchCategorias();
    } catch (error) {
      enqueueSnackbar('Erro ao salvar categoria', { variant: 'error' });
    }
  };

  // Função para salvar Marca
  const handleSaveMarca = async () => {
    const payload = { nome: nomeMarca, descricao: descricaoMarca };

    try {
      if (editMarca) {
        await api.put(`/marcas/${editMarca.id}/`, payload);
        enqueueSnackbar('Marca atualizada com sucesso', { variant: 'success' });
      } else {
        await api.post('/marcas/', payload);
        enqueueSnackbar('Marca criada com sucesso', { variant: 'success' });
      }
      setMarcaDialogOpen(false);
      fetchMarcas();
    } catch (error) {
      enqueueSnackbar('Erro ao salvar marca', { variant: 'error' });
    }
  };

  // Carrega categorias e marcas ao montar o componente
  useEffect(() => {
    fetchCategorias();
    fetchMarcas();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Gestão de Categorias e Marcas</Typography>

      <Grid container spacing={3}>
        {/* Tabela de Categorias */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Categorias</Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Button variant="contained" color="primary" onClick={() => handleOpenCategoriaDialog()}>Nova Categoria</Button>
          </Box>
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={categorias}
              columns={[
                { field: 'id', headerName: 'ID', width: 90 },
                { field: 'nome', headerName: 'Nome', width: 150 },
                { field: 'descricao', headerName: 'Descrição', width: 200 },
                {
                  field: 'actions',
                  headerName: 'Ações',
                  width: 120,
                  renderCell: (params) => (
                    <Button variant="contained" onClick={() => handleOpenCategoriaDialog(params.row)}>Editar</Button>
                  ),
                },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
            />
          </Box>
        </Grid>

        {/* Tabela de Marcas */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Marcas</Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Button variant="contained" color="primary" onClick={() => handleOpenMarcaDialog()}>Nova Marca</Button>
          </Box>
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={marcas}
              columns={[
                { field: 'id', headerName: 'ID', width: 90 },
                { field: 'nome', headerName: 'Nome', width: 150 },
                { field: 'descricao', headerName: 'Descrição', width: 200 },
                {
                  field: 'actions',
                  headerName: 'Ações',
                  width: 120,
                  renderCell: (params) => (
                    <Button variant="contained" onClick={() => handleOpenMarcaDialog(params.row)}>Editar</Button>
                  ),
                },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
            />
          </Box>
        </Grid>
      </Grid>

      {/* Diálogo para Cadastro/Edição de Categoria */}
      <Dialog open={categoriaDialogOpen} onClose={() => setCategoriaDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editCategoria ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={nomeCategoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
          />
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            value={descricaoCategoria}
            onChange={(e) => setDescricaoCategoria(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoriaDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveCategoria} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Cadastro/Edição de Marca */}
      <Dialog open={marcaDialogOpen} onClose={() => setMarcaDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMarca ? 'Editar Marca' : 'Nova Marca'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={nomeMarca}
            onChange={(e) => setNomeMarca(e.target.value)}
          />
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            value={descricaoMarca}
            onChange={(e) => setDescricaoMarca(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMarcaDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveMarca} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoriaMarcaPage;
