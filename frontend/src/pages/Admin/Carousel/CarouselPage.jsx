import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import api from '../../../utils/api';
import CarouselPropertiesDialog from '../../../components/CarouselPropertiesDialog'; // Componente para editar as propriedades
import CarouselImageEditDialog from '../../../components/CarouselImageDialog'; // Componente para editar a imagem
import { useSnackbar } from 'notistack';
import './CarouselImagesPage.css';

const CarouselImagesPage = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPropertiesDialog, setOpenPropertiesDialog] = useState(false); // Propriedades
  const [openImageEditDialog, setOpenImageEditDialog] = useState(false); // Imagem
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCarouselImageId, setSelectedCarouselImageId] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  // Função para abrir o diálogo de edição de propriedades
  const handleOpenPropertiesDialog = (carouselImage) => {
    setSelectedImage(carouselImage);
    setOpenPropertiesDialog(true);
  };

  // Função para fechar o diálogo de propriedades
  const handleClosePropertiesDialog = () => {
    setOpenPropertiesDialog(false);
    setSelectedImage(null);
    fetchCarouselImages(); // Atualiza a lista após alterações
  };

  // Função para abrir o diálogo de edição de imagens
  const handleOpenImageEditDialog = (carouselImageId) => {
    setSelectedCarouselImageId(carouselImageId);
    setOpenImageEditDialog(true);
  };

  // Função para fechar o diálogo de edição de imagens
  const handleCloseImageEditDialog = () => {
    setOpenImageEditDialog(false);
    setSelectedCarouselImageId(null);
    fetchCarouselImages(); // Atualiza a lista após alterações
  };

  const fetchCarouselImages = async () => {
    try {
      const response = await api.get('/carousel-admin/');
      setCarouselImages(response.data);
    } catch (error) {
      console.error('Erro ao buscar imagens do carrossel:', error);
      setError('Erro ao buscar imagens do carrossel. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'titulo', headerName: 'Título', width: 200 },
    { field: 'ordem', headerName: 'Ordem', type: 'number', width: 80 },
    { field: 'ativo', headerName: 'Ativo', type: 'boolean', width: 80 },
    { field: 'data_inicio', headerName: 'Data Início', width: 200 },
    { field: 'data_fim', headerName: 'Data Fim', width: 200 },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 220,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleOpenPropertiesDialog(params.row)}>
          Editar Propriedades
        </Button>
      ),
    },
    {
      field: 'editar_imagem',
      headerName: 'Imagem',
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpenImageEditDialog(params.row.id)}
        >
          Editar Imagem
        </Button>
      ),
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport csvOptions={{ utf8WithBom: true }} />
      </GridToolbarContainer>
    );
  }

  if (loading) return <p>Carregando imagens do carrossel...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Gerenciar Imagens do Carrossel</h2>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 4, alignSelf: 'flex-start', ml: 6 }}
          onClick={() => handleOpenPropertiesDialog(null)}
        >
          Adicionar Nova Imagem
        </Button>
        <Box sx={{ height: 600, width: '95%' }}>
          <DataGrid
            rows={carouselImages}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            components={{
              Toolbar: CustomToolbar,
            }}
          />
        </Box>
      </Box>
      <CarouselPropertiesDialog
        open={openPropertiesDialog}
        onClose={handleClosePropertiesDialog}
        selectedImage={selectedImage}
      />
      <CarouselImageEditDialog
        open={openImageEditDialog}
        onClose={handleCloseImageEditDialog}
        carouselImageId={selectedCarouselImageId}
      />
    </div>
  );
};

export default CarouselImagesPage;
