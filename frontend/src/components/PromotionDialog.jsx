import React from 'react';
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
  InputLabel
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

const PromotionDialog = ({ open, onClose, selectedPromotion, handleSaveEdit, products, categories, setSelectedPromotion }) => {
  const handleSave = () => {
    handleSaveEdit();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{selectedPromotion?.id ? 'Editar Promoção' : 'Criar Nova Promoção'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome da Promoção"
          fullWidth
          value={selectedPromotion.nome_promo}
          onChange={(e) => setSelectedPromotion({ ...selectedPromotion, nome_promo: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Percentual de Desconto (%)"
          type="number"
          fullWidth
          value={selectedPromotion.percentual}
          onChange={(e) => setSelectedPromotion({ ...selectedPromotion, percentual: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Valor de Desconto"
          type="number"
          fullWidth
          value={selectedPromotion.valor_promocao}
          onChange={(e) => setSelectedPromotion({ ...selectedPromotion, valor_promocao: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Data Início"
          type="datetime-local"
          fullWidth
          value={formatDate(selectedPromotion.data_inicio)}
          onChange={(e) => setSelectedPromotion({ ...selectedPromotion, data_inicio: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Data Fim"
          type="datetime-local"
          fullWidth
          value={formatDate(selectedPromotion.data_fim)}
          onChange={(e) => setSelectedPromotion({ ...selectedPromotion, data_fim: e.target.value })}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Produto</InputLabel>
          <Select
            value={selectedPromotion.produto}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, produto: e.target.value })}
          >
            <MenuItem value=""><em>Nenhum</em></MenuItem>
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Categoria</InputLabel>
          <Select
            value={selectedPromotion.categoria}
            onChange={(e) => setSelectedPromotion({ ...selectedPromotion, categoria: e.target.value })}
          >
            <MenuItem value=""><em>Nenhuma</em></MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default PromotionDialog;
