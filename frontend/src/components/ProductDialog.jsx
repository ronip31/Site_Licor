import React from 'react';
import {
  Autocomplete,
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
  Grid,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProductDialog = ({ open, onClose, selectedProduct, handleSaveEdit, categories,marks, setSelectedProduct }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = async () => {
    const success = await handleSaveEdit();
    if (success) {
      enqueueSnackbar('Produto adicionado com sucesso', { variant: 'success' });
    }
  };

  // Função reutilizável para manipulação de entradas
  const handleInputChange = (event, fieldName) => {
    let value = event.target.value;

    // Substitui vírgulas por pontos
    value = value.replace(/,/g, '.');

    // Valida que o valor contém apenas números e um ponto decimal
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setSelectedProduct((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{selectedProduct?.id ? 'Editar Informações Produto' : 'Criar Novo Produto'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} columns={{ xs: 18, sm: 8, md: 16 }}>
          {/* Coluna Esquerda */}
          <Grid item xs={6} md={6}>
            <TextField
              autoFocus
              margin="dense"
              label="Nome"
              fullWidth
              value={selectedProduct?.nome || ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, nome: e.target.value })}
            />
            <InputLabel>Descrição:</InputLabel>
            <FormControl fullWidth margin="dense">
              <ReactQuill
                theme="snow"
                value={selectedProduct?.descricao || ''}
                onChange={(value) => setSelectedProduct({ ...selectedProduct, descricao: value })}
                style={{ height: '280px' }} // Ajusta a altura para 300px (ou o valor desejado)
              />
            </FormControl>
          </Grid>

          {/* Coluna Direita */}
          <Grid item xs={6} md={5}>
            <TextField
              autoFocus
              margin="dense"
              label="Preço Custo"
              fullWidth
              value={selectedProduct?.preco_custo || ''}
              onChange={(e) => handleInputChange(e, 'preco_custo')}
            />
            <TextField
              margin="dense"
              label="Preço Venda"
              fullWidth
              value={selectedProduct?.preco_venda || ''}
              onChange={(e) => handleInputChange(e, 'preco_venda')}
            />
            <TextField
              margin="dense"
              label="Estoque"
              fullWidth
              value={selectedProduct?.quantidade_estoque || ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, quantidade_estoque: parseFloat(e.target.value) })}
            />
            {/* <FormControl fullWidth margin="dense">
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
            </FormControl> */}
          <FormControl fullWidth margin="dense">
          <Autocomplete
              autoFocus
              multiple
              options={categories}
              value={categories.filter((category) => selectedProduct.categorias?.includes(category.id))}
              onChange={(event, newValue) => {
                setSelectedProduct({ ...selectedProduct, categorias: newValue.map((c) => c.id) });
              }}
              getOptionLabel={(option) => option.nome} // Exibe o nome da categoria
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    style={{ marginRight: 8 }}
                    checked={selectedProduct.categorias?.includes(option.id)}
                  />
                  <ListItemText primary={option.nome} /> {/* Exibe o nome da categoria */}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Categorias" placeholder="Buscar por categoria..." />
              )}
            />
          </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={selectedProduct?.status || 'Inativo'}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, status: e.target.value })}
              >
                <MenuItem value="Ativo">ATIVO</MenuItem>
                <MenuItem value="Inativo">INATIVO</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/*TERCEIRA COLUNA*/}
          <Grid item xs={6} md={4}>
            <TextField
              margin="dense"
              label="Teor Alcoólico (%)"
              fullWidth
              value={selectedProduct.teor_alcoolico}
              onChange={(e) => handleInputChange(e, 'teor_alcoolico')}
              inputProps={{ step: '0.00', min: '0', pattern: '[0-9]*[.,]?[0-9]*' }} // Define o passo e o mínimo
            />
            <TextField
              margin="dense"
              label="Volume"
              type="text"
              fullWidth
              value={selectedProduct?.volume || ''}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, volume: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Marca</InputLabel>
              <Select
                label="Marca"
                value={selectedProduct?.marca || ''}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, marca: e.target.value })}
              >
                {marks.map((mark) => (
                  <MenuItem key={mark.id} value={mark.id}>
                    {mark.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Altura"
              fullWidth
              value={selectedProduct?.altura || ''}
              onChange={(e) => handleInputChange(e, 'altura')}
            />
            <TextField
              margin="dense"
              label="Largura"
              fullWidth
              value={selectedProduct?.largura || ''}
              onChange={(e) => handleInputChange(e, 'largura')}
            />
            <TextField
              margin="dense"
              label="Comprimento"
              fullWidth
              value={selectedProduct?.comprimento || ''}
              onChange={(e) => handleInputChange(e, 'comprimento')}
            />
            <TextField
              margin="dense"
              label="Peso"
              fullWidth
              value={selectedProduct?.peso || ''}
              onChange={(e) => handleInputChange(e, 'peso')}

            />

          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} color="primary">
          {selectedProduct?.id ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
