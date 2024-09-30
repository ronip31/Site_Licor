import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

const ImageUpload = ({ onImageChange, existingImage }) => {
  const [selectedFileName, setSelectedFileName] = useState('');

  useEffect(() => {
    if (existingImage) {
      // Se houver uma imagem existente, exiba seu nome
      const imageName = existingImage.split('/').pop();
      setSelectedFileName(imageName);
    }
  }, [existingImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file);
      setSelectedFileName(file.name);
    }
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <Button variant="contained" component="label">
        Selecionar Imagem
        <input type="file" hidden onChange={handleImageChange} accept="image/*" />
      </Button>
      {selectedFileName && (
        <div style={{ marginTop: '8px' }}>
          <p>Arquivo selecionado: {selectedFileName}</p>
        </div>
      )}
      {existingImage && (
        <div style={{ marginTop: '8px' }}>
          <img src={`http://localhost:8000${existingImage}`} alt="Imagem atual" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
