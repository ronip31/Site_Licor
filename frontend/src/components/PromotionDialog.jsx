import React, { useState } from 'react';
import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  ListItemText,
  FormControl,
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

const PromotionDialog = ({
  open,
  onClose,
  selectedPromotion,
  handleSaveEdit,
  products,
  categories,
  setSelectedPromotion,
}) => {
  const [startDate, setStartDate] = useState(selectedPromotion.data_inicio || null);
  const [endDate, setEndDate] = useState(selectedPromotion.data_fim || null);

  const handleSave = () => {
    setSelectedPromotion({
      ...selectedPromotion,
      data_inicio: startDate,
      data_fim: endDate,
    });
    handleSaveEdit();
  };

  const handlePercentualChange = (e) => {
    setSelectedPromotion({
      ...selectedPromotion,
      percentual: e.target.value,
      valor_promocao: e.target.value ? '' : selectedPromotion.valor_promocao, // Limpa o valor do campo oposto
    });
  };

  const handleValorChange = (e) => {
    setSelectedPromotion({
      ...selectedPromotion,
      valor_promocao: e.target.value,
      percentual: e.target.value ? '' : selectedPromotion.percentual, // Limpa o valor do campo oposto
    });
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
          onChange={handlePercentualChange}
          disabled={Boolean(selectedPromotion.valor_promocao)} // Desabilita se o valor de desconto estiver preenchido
        />
        <TextField
          margin="dense"
          label="Valor de Desconto"
          type="number"
          fullWidth
          value={selectedPromotion.valor_promocao}
          onChange={handleValorChange}
          disabled={Boolean(selectedPromotion.percentual)} // Desabilita se o percentual de desconto estiver preenchido
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

        {/* Campo para seleção múltipla de produtos */}
        <Autocomplete
          multiple
          options={products}
          getOptionLabel={(option) => option.nome}
          value={products.filter((product) => selectedPromotion.produtos.includes(product.id))}
          onChange={(event, newValue) => {
            setSelectedPromotion({ ...selectedPromotion, produtos: newValue.map((p) => p.id) });
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox checked={selected} />
              <ListItemText primary={option.nome} />
            </li>
          )}
          renderInput={(params) => <TextField {...params} label="Produtos" placeholder="Selecionar produtos" />}
        />

        {/* Campo para seleção múltipla de categorias */}
        <FormControl fullWidth margin="dense">
          <Autocomplete
            multiple
            options={categories}
            value={categories.filter((category) => selectedPromotion.categorias?.includes(category.id))} // Mudado para plural
            onChange={(event, newValue) => {
              setSelectedPromotion({ ...selectedPromotion, categorias: newValue.map((c) => c.id) }); // Mudado para plural
            }}
            getOptionLabel={(option) => option.nome} // Exibe o nome da categoria
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} />
                <ListItemText primary={option.nome} />
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Categorias" placeholder="Buscar por categoria..." />
            )}
          />
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
