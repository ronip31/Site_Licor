import React, { useEffect, useState } from 'react';
import {
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
  FormControlLabel
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{selectedCoupon?.id ? 'Editar Cupom' : 'Criar Novo Cupom'}</DialogTitle>
      <DialogContent>
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
          label="Valor"
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
          <InputLabel>Produtos</InputLabel>
          <Select
            multiple
            value={selectedCoupon.produtos || []}
            onChange={(e) => setSelectedCoupon({ ...selectedCoupon, produtos: e.target.value })}
            renderValue={(selected) => selected.map((id) => products.find((p) => p.id === id)?.nome).join(', ')}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                <Checkbox checked={selectedCoupon.produtos?.includes(product.id)} />
                <ListItemText primary={product.nome} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Categorias</InputLabel>
          <Select
            multiple
            value={selectedCoupon.categorias || []}
            onChange={(e) => setSelectedCoupon({ ...selectedCoupon, categorias: e.target.value })}
            renderValue={(selected) => selected.map((id) => categories.find((c) => c.id === id)?.nome).join(', ')}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                <Checkbox checked={selectedCoupon.categorias?.includes(category.id)} />
                <ListItemText primary={category.nome} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Clientes Exclusivos</InputLabel>
          <Select
            multiple
            value={selectedCoupon.clientes_exclusivos || []}
            onChange={(e) => setSelectedCoupon({ ...selectedCoupon, clientes_exclusivos: e.target.value })}
            renderValue={(selected) => selected.map((id) => customers.find((c) => c.id === id)?.username).join(', ')}
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                <Checkbox checked={selectedCoupon.clientes_exclusivos?.includes(customer.id)} />
                <ListItemText primary={customer.username} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedCoupon.ativo}
              onChange={(e) => setSelectedCoupon({ ...selectedCoupon, ativo: e.target.checked })}
            />
          }
          label="Ativo"
        />
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
