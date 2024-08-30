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
  InputLabel,
} from '@mui/material';
import { useSnackbar } from 'notistack';


const ProductDialog = ({ open, onClose, selectedProduct, handleSaveEdit, categories, setSelectedProduct }) => {
  const { enqueueSnackbar } = useSnackbar(); 

  const handleSave = async () => {
    const success = await handleSaveEdit(); // Aguarda a execução de handleSaveEdit e verifica o retorno
    if (success) {
      enqueueSnackbar('Produto adicionado com sucesso', { variant: 'success' });
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{selectedProduct?.id ? 'Editar Produto' : 'Criar Novo Produto'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome"
          fullWidth
          value={selectedProduct?.nome || ''}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, nome: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Descrição"
          fullWidth
          value={selectedProduct?.descricao || ''}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, descricao: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Preço"
          type="number"
          fullWidth
          value={selectedProduct?.preco || ''}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, preco: parseFloat(e.target.value) })}
        />
        <TextField
          margin="dense"
          label="Estoque"
          fullWidth
          value={selectedProduct?.quantidade_estoque || ''}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, quantidade_estoque: parseFloat(e.target.value) })}
        />
        <FormControl fullWidth margin="dense">
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
        </FormControl>
        <TextField
          margin="dense"
          label="SKU"
          fullWidth
          value={selectedProduct?.sku || ''}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, sku: e.target.value })}
        />
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
