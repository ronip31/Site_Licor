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
  Checkbox,
  ListItemText,
  FormControlLabel,
  Grid
} from '@mui/material';



const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const CouponDialog = ({ open, onClose, selectedCoupon, handleSaveEdit, products, categories, customers, setSelectedCoupon }) => {
  const handleSave = () => {
    handleSaveEdit();
  };

const getValorLabel = () => {
  switch (selectedCoupon.tipo) {
    case 'percentual':
      return 'Percentual de Desconto (%)';
    case 'valor':
      return 'Valor Fixo do Desconto';
    default:
      return 'Valor';
  }
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{selectedCoupon?.id ? 'Editar Cupom' : 'Criar Novo Cupom'}</DialogTitle>
      <DialogContent>
      <Grid container spacing={3} columns={{ xs: 18, sm: 8, md: 16 }}>
          {/* Coluna Esquerda */}
        <Grid item xs={6} md={8}>
        <TextField
          autoFocus
          margin="dense"
          label="Código do Cupom"
          fullWidth
          value={selectedCoupon.codigo}
          onChange={(e) => setSelectedCoupon({ ...selectedCoupon, codigo: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Descrição"
          fullWidth
          value={selectedCoupon.descricao}
          onChange={(e) => setSelectedCoupon({ ...selectedCoupon, descricao: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo de Cupom</InputLabel>
            <Select
            label="Tipo de Cupom"
            value={selectedCoupon.tipo}
            onChange={(e) => setSelectedCoupon({ ...selectedCoupon, tipo: e.target.value })}
          >
            <MenuItem value="percentual">Percentual</MenuItem>
            <MenuItem value="valor">Valor Fixo</MenuItem>
            <MenuItem value="frete_gratis">Frete Grátis</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label={getValorLabel()}
          type="number"
          fullWidth
          value={selectedCoupon.valor}
          onChange={(e) => setSelectedCoupon({ ...selectedCoupon, valor: e.target.value })}
          disabled={selectedCoupon.tipo === 'frete_gratis'}
        />
        <TextField
          margin="dense"
          label="Data Início"
          type="datetime-local"
          fullWidth
          value={formatDate(selectedCoupon.data_inicio)}
          onChange={(e) => setSelectedCoupon({ ...selectedCoupon, data_inicio: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Data Fim"
          type="datetime-local"
          fullWidth
          value={formatDate(selectedCoupon.data_fim)}
          onChange={(e) => setSelectedCoupon({ ...selectedCoupon, data_fim: e.target.value })}
        />
        {/* Adicionando o campo para permitir a combinação com promoções */}
        <FormControlLabel
            control={
              <Checkbox
                checked={selectedCoupon.permitir_combinacao_com_promocoes}
                onChange={(e) =>
                  setSelectedCoupon({
                    ...selectedCoupon,
                    permitir_combinacao_com_promocoes: e.target.checked,
                  })
                }
              />
            }
            label="Permitir combinação com promoções"
          />

        </Grid>
        <Grid item xs={6} md={8}>
        <TextField
          margin="dense"
          label="Uso Máximo"
          type="number"
          fullWidth
          value={selectedCoupon.uso_maximo}
          onChange={(e) => setSelectedCoupon({ ...selectedCoupon, uso_maximo: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Uso por Cliente"
          type="number"
          fullWidth
          value={selectedCoupon.uso_por_cliente}
          onChange={(e) => setSelectedCoupon({ ...selectedCoupon, uso_por_cliente: e.target.value })}
        />
        <FormControl fullWidth margin="dense">
          
          <Autocomplete
            autoFocus
            multiple
            label="Produtos"
            fullWidth
            options={products}
            value={products.filter((product) => selectedCoupon.produtos?.includes(product.id))}
            onChange={(event, newValue) => {
              setSelectedCoupon({ ...selectedCoupon, produtos: newValue.map((p) => p.id) });
            }}
            getOptionLabel={(option) => option.nome}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selectedCoupon.produtos?.includes(option.id)}
                />
                <ListItemText primary={option.nome} />
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Produtos" placeholder="Buscar produtos..." />
            )}
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <Autocomplete
            autoFocus
            multiple
            options={categories}
            value={categories.filter((category) => selectedCoupon.categorias?.includes(category.id))}
            onChange={(event, newValue) => {
              setSelectedCoupon({ ...selectedCoupon, categorias: newValue.map((c) => c.id) });
            }}
            getOptionLabel={(option) => option.nome} // Exibe o nome da categoria
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selectedCoupon.categorias?.includes(option.id)}
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
        <Autocomplete
          autoFocus
          multiple
          options={customers}
          value={customers.filter((customer) => selectedCoupon.clientes_exclusivos?.includes(customer.uuid))}
          onChange={(event, newValue) => {
            setSelectedCoupon({ ...selectedCoupon, clientes_exclusivos: newValue.map((c) => c.uuid) });
          }}
          getOptionLabel={(option) => option.email} // Exibe o e-mail como opção
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                style={{ marginRight: 8 }}
                checked={selectedCoupon.clientes_exclusivos?.includes(option.uuid)}
              />
              <ListItemText primary={option.email} /> {/* Exibe o e-mail do cliente */}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Clientes" placeholder="Buscar por e-mail..." />
          )}
        />
        </FormControl>
        
        <TextField
          margin="dense"
          label="Valor Minimo Compra"
          type="number"
          fullWidth
          value={selectedCoupon.valor_minimo_compra}
          onChange={(e) => setSelectedCoupon({ ...selectedCoupon, valor_minimo_compra: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Valor Maximo Desconto"
          type="number"
          fullWidth
          value={selectedCoupon.valor_maximo_desconto}
          onChange={(e) => setSelectedCoupon({ ...selectedCoupon, valor_maximo_desconto: e.target.value })}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedCoupon.ativo}
              onChange={(e) => setSelectedCoupon({ ...selectedCoupon, ativo: e.target.checked })}
            />
          }
          label="Ativo"
        />
        </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CouponDialog;
