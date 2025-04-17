// pages/Products/ProductDetailPage.jsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { 
  useGetProductQuery,
  useDeleteProductMutation 
} from '../../features/products/productsApiSlice';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ProductImageGallery from '../../components/products/ProductImageGallery';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: product, isLoading, isError } = useGetProductQuery(id);
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        enqueueSnackbar('Product deleted successfully', { variant: 'success' });
        navigate('/dashboard');
      } catch (error) {
        enqueueSnackbar('Failed to delete product', { variant: 'error' });
        console.error('Product deletion error:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !product) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">Failed to load product</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">{product.name}</Typography>
                <Box display="flex" gap={1}>
                  {product.is_featured && (
                    <Chip label="Featured" color="primary" />
                  )}
                  <Chip 
                    label={product.is_active ? 'Active' : 'Inactive'} 
                    color={product.is_active ? 'success' : 'default'} 
                  />
                </Box>
              </Box>
              
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {product.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Brand</Typography>
                  <Typography>{product.brand}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Category</Typography>
                  <Typography>{product.category}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Type</Typography>
                  <Typography>{product.type}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Created</Typography>
                  <Typography>
                    {new Date(product.created_at).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Variants
              </Typography>
              
              {product.product_lines.map((line, index) => (
                <Box key={line.id} mb={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1">
                      Variant #{index + 1}
                    </Typography>
                    <Chip 
                      label={line.is_active ? 'Active' : 'Inactive'} 
                      size="small" 
                      color={line.is_active ? 'success' : 'default'}
                    />
                  </Box>
                  
                  <Grid container spacing={2} sx={{ mb: 1 }}>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2">Price</Typography>
                      <Typography>
                        {line.price} {line.sale_price && (
                          <span style={{ textDecoration: 'line-through', color: 'red', marginLeft: '8px' }}>
                            {line.sale_price}
                          </span>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2">SKU</Typography>
                      <Typography>{line.sku}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle2">Stock</Typography>
                      <Typography>{line.stock_qty}</Typography>
                    </Grid>
                  </Grid>
                  
                  {line.attribute_values.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Attributes</Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {line.attribute_values.map(attr => (
                          <Chip 
                            key={attr.id}
                            label={`${attr.attribute}: ${attr.value}`}
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {line.images.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Images
                      </Typography>
                      <ProductImageGallery images={line.images} />
                    </Box>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Owner Information
              </Typography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar 
                  src={product.owner_profile.image} 
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography>{product.owner_profile.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.owner_profile.email}
                  </Typography>
                </Box>
              </Box>
              
              {product.shop && (
                <Box mb={2}>
                  <Typography variant="subtitle2">Shop</Typography>
                  <Typography>{product.shop.name}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              
              <Button
                fullWidth
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/products/edit/${id}`)}
                sx={{ mb: 2 }}
              >
                Edit Product
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete Product
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetailPage;