// components/products/ProductImageGallery.jsx

import React, { useState } from 'react';
import { 
  Box,
  ImageList,
  ImageListItem,
  Modal,
  IconButton
} from '@mui/material';
import { ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from '@mui/icons-material';

const ProductImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);

  const handleOpen = (img) => {
    setSelectedImage(img);
    setZoom(1);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <>
      <ImageList cols={3} gap={8}>
        {images.map((img, index) => (
          <ImageListItem key={index}>
            <img
              src={img.url || img.image}
              alt={img.alt_text}
              loading="lazy"
              style={{ 
                cursor: 'pointer',
                borderRadius: '4px',
                aspectRatio: '1/1',
                objectFit: 'cover'
              }}
              onClick={() => handleOpen(img)}
            />
          </ImageListItem>
        ))}
      </ImageList>
      
      <Modal
        open={Boolean(selectedImage)}
        onClose={handleClose}
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ 
          position: 'relative',
          outline: 'none'
        }}>
          <img
            src={selectedImage?.url || selectedImage?.image}
            alt={selectedImage?.alt_text}
            style={{ 
              maxHeight: '90vh',
              maxWidth: '90vw',
              transform: `scale(${zoom})`,
              transition: 'transform 0.3s ease'
            }}
          />
          
          <Box sx={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1
          }}>
            <IconButton 
              onClick={handleZoomIn}
              color="primary"
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            >
              <ZoomInIcon />
            </IconButton>
            <IconButton 
              onClick={handleZoomOut}
              color="primary"
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            >
              <ZoomOutIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ProductImageGallery;