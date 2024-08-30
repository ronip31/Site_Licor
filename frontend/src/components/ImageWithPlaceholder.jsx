import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';

const ImageWithPlaceholder = ({ src, alt, onClick }) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={onClick}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={24} />
        </div>
      )}
      <img
        src={src ? `${'http://localhost:8000'}${src}` : ''}
        alt={alt}
        onLoad={handleImageLoad}
        style={{ display: loading ? 'none' : 'block', width: '100px', height: '100px' }}
      />
    </div>
  );
};

export default ImageWithPlaceholder;
