import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 3
      }
    }}>
      {product.primary_image && (
        <CardMedia
          component="img"
          height="200"
          image={product.primary_image.url}
          alt={product.primary_image.alternative_text || product.name}
          sx={{ 
            objectFit: 'contain', 
            p: 1,
            backgroundColor: '#f5f5f5'
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h3">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand}
        </Typography>
        {product.price_range && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle1">
              ${product.price_range.min.toFixed(2)}
              {product.price_range.max > product.price_range.min && 
                ` - $${product.price_range.max.toFixed(2)}`}
            </Typography>
          </Box>
        )}
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button 
          component={Link}
          to={`/products/${product.id}`}
          variant="outlined"
          fullWidth
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;