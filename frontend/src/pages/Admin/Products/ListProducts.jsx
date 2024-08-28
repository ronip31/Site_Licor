import api from '../../../utils/api';

const fetchProducts = async () => {
  try {
    const response = await api.get('/listproduct/');
    console.log(response.data);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
};
