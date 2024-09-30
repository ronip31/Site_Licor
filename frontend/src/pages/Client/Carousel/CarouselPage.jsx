import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/carousel/lista/')
      .then(response => {
        setImages(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar imagens do carrossel:', error);
      });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {images.map(image => (
        <div key={image.uuid}>
          {image.link_url ? (
            <a href={image.link_url}>
              <img src={`http://localhost:8000${image.imagem}`} alt={image.titulo} style={{ width: '100%' }} />
            </a>
          ) : (
            <img src={`http://localhost:8000${image.imagem}`} alt={image.titulo} style={{ width: '100%' }} />
          )}
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
