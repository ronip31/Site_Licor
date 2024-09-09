import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';
import { Button, TextField, Checkbox, Box, Link  } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSnackbar } from 'notistack';
import './DeliveryConfig.css';



const DeliveryConfig = () => {
  const [config, setConfig] = useState({
    cep_origem: '',
    desconto_frete: 0.00,
    acrescimo_frete: 0.00,
    dias_adicionais_entrega: 0
  });
  const [shippingOptions, setShippingOptions] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Obter opções de frete e configuração atual
    api.get('/opcoes-frete/') 
      .then(response => setShippingOptions(response.data))
      .catch(error => console.error('Erro ao buscar opções de frete:', error));
    
    api.get('/configuracao-frete/') 
      .then(response => setConfig(response.data))
      .catch(error => console.error('Erro ao buscar configuração de frete:', error));
  }, []);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: value
    }));
  };

  const handleToggleOption = (id) => {
    setShippingOptions(prevOptions =>
      prevOptions.map(option =>
        option.id === id ? { ...option, ativo: !option.ativo } : option
      )
    );
  };

  const handleSaveConfig = () => {
    // Salva a configuração geral de frete
    api.post('/configuracao-frete/', { 
      config, 
      shippingOptions 
    })
    .then(() => {
      // Atualiza cada opção de frete
      const updateRequests = shippingOptions.map(option => {
        if (option.id !== undefined) {  // Verifica se o ID é válido antes de enviar a requisição
          return api.patch(`/opcoes-frete/${option.id}/`, { ativo: option.ativo });
        } else {
          console.error('ID de opção de frete não encontrado:', option);
          return Promise.reject(new Error('ID de opção de frete não encontrado.'));
        }
      });
  
      // Espera todas as requisições de atualização serem concluídas
      Promise.all(updateRequests)
        .then(() => {
          enqueueSnackbar('Configurações de frete salvas com sucesso!', { variant: 'success' });
        })
        .catch(error => {
          console.error('Erro ao salvar algumas opções de frete:', error);
          enqueueSnackbar('Erro ao salvar configurações de frete.', { variant: 'error' });
        });
    })
    .catch(error => {
      console.error('Erro ao salvar configurações gerais de frete:', error);
      enqueueSnackbar('Erro ao salvar configurações de frete.', { variant: 'error' });
    });
  };
  
  


  return (
    <div>
      <h2 >Configuração de Entrega</h2>
      <h3> Pagina destina a configuração do entrega, calculo de entregas são feitas pelo <Link href="www.melhorenvio.com.br" target="_blank">www.melhorenvio.com.br</Link></h3>
      <h3> Essas configrações serão refletidas para o cliente.</h3>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 2, width: '25ch' } }}
        noValidate
        autoComplete="off"
        alignItems="center" // Centraliza horizontalmente
        justifyContent="center" // Centraliza verticalmente
        display="flex"
        >
        
        <div>
        <TextField
        margin="normal"
        label="CEP de Origem:"
        type="text"
        fullWidth
        name="cep_origem"
        value={config.cep_origem || ''}
        onChange={handleConfigChange}
        variant="outlined"
        sx={{
            width: '300px', // Ajusta a largura
            marginBottom: '16px', // Margem inferior
            marginTop: '16px' // Margem superior
        }}
        />
        <TextField
        margin="normal"
        label="Desconto de Frete (%):"
        type="Number"
        fullWidth
        name="desconto_frete"
        value={config.desconto_frete || ''}
        onChange={handleConfigChange}
        variant="outlined"
        sx={{
            width: '300px', // Ajusta a largura
            marginBottom: '16px', // Margem inferior
            marginTop: '16px' // Margem superior
        }}
        />
        <TextField
        margin="normal"
        label="Acréscimo de Frete (%):"
        type="number"
        fullWidth
        name="acrescimo_frete"
        value={config.acrescimo_frete || ''}
        onChange={handleConfigChange}
        variant="outlined"
        sx={{
            width: '300px', // Ajusta a largura
            marginBottom: '16px', // Margem inferior
            marginTop: '16px' // Margem superior
        }}
        />
        <TextField
        margin="normal"
        label="Dias Adicionais de Entrega:"
        helperText="Apenas números inteiros"
        type="number"
        fullWidth
        name="dias_adicionais_entrega"
        value={config.dias_adicionais_entrega || ''}
        onChange={handleConfigChange}
        variant="outlined"
        sx={{
            width: '300px', // Ajusta a largura
            marginBottom: '16px', // Margem inferior
            marginTop: '16px' // Margem superior
        }}
        />
        </div>
      </Box>
      <h2 >Opções de Frete</h2>
      <h4>Opções de frete que irá apresentar para o cliente escolher</h4>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 2, width: '25ch' } }}
        noValidate
        autoComplete="off"
        alignItems="center" // Centraliza horizontalmente
        justifyContent="center" // Centraliza verticalmente
        display="flex"
        >
      <FormGroup>
        {shippingOptions.map(option => (
          <FormControlLabel
            key={option.id}
            control={
              <Checkbox
                checked={option.ativo}
                onChange={() => handleToggleOption(option.id)}
                inputProps={{ 'aria-label': option.nome }}
              />
            }
            label={option.nome}
          />
        ))}
      </FormGroup>
      </Box>
      <Button 
        variant="contained"
        color="primary"
        style={{ 
          marginTop: 32,     // Margem superior de 16px
          marginLeft: 32     // Margem esquerda de 16px para afastar da borda lateral
        }}
        onClick={handleSaveConfig}
      >
        Salvar Configurações
      </Button>
    </div>
  );
};

export default DeliveryConfig;
