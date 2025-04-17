import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../../features/auth/authApiSlice';
import { useGetUserProductsQuery } from '../../features/products/productsApiSlice';
import { useSnackbar } from 'notistack';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  CircularProgress,
  Avatar,
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  // Fetch current user data
  const { 
    data: user, 
    isLoading: userLoading, 
    isError: userError 
  } = useGetCurrentUserQuery();
  
  // Fetch user's products
  const { 
    data: products = [], 
    isLoading: productsLoading, 
    isError: productsError,
    refetch: refetchProducts
  } = useGetUserProductsQuery(user?.id, {
    skip: !user?.id
  });

  // Handle errors
  useEffect(() => {
    if (userError) {
      enqueueSnackbar('Failed to load user data', { variant: 'error' });
    }
    if (productsError) {
      enqueueSnackbar('Failed to load products', { variant: 'error' });
    }
  }, [userError, productsError, enqueueSnackbar]);

  if (userLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* User Profile Section */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Avatar 
          src={user?.profile?.image} 
          sx={{ width: 80, height: 80, mr: 3 }}
        >
          {user?.firstname?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1">
            Welcome, {user?.firstname || 'User'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user?.email}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={user?.has_shop ? 'Shop Owner' : 'Individual Seller'} 
              color={user?.has_shop ? 'primary' : 'default'} 
              size="small" 
            />
          </Box>
        </Box>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Products Posted</Typography>
              <Typography variant="h4">{user?.products_posted || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Free Listings Left</Typography>
              <Typography variant="h4">{user?.remaining_free_products || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Products Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your Products
      </Typography>
      
      {productsLoading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You haven't posted any products yet
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/products/new')}
          >
            Add Your First Product
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    {product.category}
                  </Typography>
                  <Typography variant="body2">
                    Price: {product.price} TZS
                  </Typography>
                  <Chip 
                    label={product.is_active ? 'Active' : 'Inactive'} 
                    size="small" 
                    color={product.is_active ? 'success' : 'default'}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    View
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DashboardPage;