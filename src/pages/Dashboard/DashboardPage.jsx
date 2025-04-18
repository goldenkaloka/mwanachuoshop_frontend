import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useGetCurrentUserQuery } from '../../features/auth/authApiSlice';
import { useGetUserProductsQuery } from '../../features/products/productsApiSlice';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
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
  Chip,
  Container,
  Paper
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
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
  } = useGetUserProductsQuery(undefined, {
    skip: !isAuthenticated // Only fetch products if authenticated
  });

  // Handle errors
  React.useEffect(() => {
    if (userError) {
      enqueueSnackbar('Failed to load user data', { variant: 'error' });
    }
    if (productsError) {
      enqueueSnackbar('Failed to load products', { variant: 'error' });
    }
  }, [userError, productsError, enqueueSnackbar]);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Please Log In
          </Typography>
          <Typography paragraph>
            You need to be logged in to access your dashboard.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/login', { state: { from: '/dashboard' } })}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
    );
  }

  if (userLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* User Profile Section */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        alignItems: 'center',
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
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

      {/* Products Section */}
      <Box sx={{ 
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        mb: 4
      }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
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
              sx={{ mt: 2 }}
            >
              Add Your First Product
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      {product.category}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Price: {product.price} TZS
                    </Typography>
                    <Chip 
                      label={product.is_active ? 'Active' : 'Inactive'} 
                      size="small" 
                      color={product.is_active ? 'success' : 'default'}
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
    </Container>
  );
};

export default DashboardPage;