import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { 
  useGetProductQuery,
  useUpdateProductMutation 
} from '../../features/products/productsApiSlice';
import ProductForm from '../../components/products/ProductForm';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Container,
  Paper,
  Avatar,
  Button
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../../features/auth/authSlice';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: product, isLoading: isLoadingProduct } = useGetProductQuery(id);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      // ... (keep your existing formData logic)
      
      await updateProduct({ id, data: formData }).unwrap();
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      navigate(`/products/${id}`);
    } catch (error) {
      enqueueSnackbar('Failed to update product', { variant: 'error' });
      console.error('Product update error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Unauthorized Access
          </Typography>
          <Typography paragraph>
            Please log in to edit products.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/login', { state: { from: `/products/edit/${id}` } })}
          >
            Login
          </Button>
        </Paper>
      </Container>
    );
  }

  if (isLoadingProduct) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar 
          src={user?.profile?.image} 
          sx={{ width: 56, height: 56, mr: 2 }}
        >
          {user?.firstname?.charAt(0)}
        </Avatar>
        <Typography variant="h4">
          Edit Product
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <ProductForm 
          initialValues={product} 
          onSubmit={handleSubmit}
          isEditing={true}
          isLoading={isLoading}
        />
      </Paper>
    </Container>
  );
};

export default ProductEditPage;