import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductQuery } from '../../features/products/productsApiSlice';
import { useInitiateProductPaymentMutation } from '../../features/payment/paymentApiSlice';
import { useSnackbar } from 'notistack';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  CircularProgress,
  Divider,
  Chip,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import PaymentForm from '../../components/payment/PaymentForm';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Fetch product data
  const { 
    data: product, 
    isLoading, 
    isError,
  } = useGetProductQuery(id);
  
  // Payment mutation - now using the correct hook
  const [initiatePayment, { isLoading: isPaymentLoading }] = useInitiateProductPaymentMutation();

  // Handle errors
  useEffect(() => {
    if (isError) {
      enqueueSnackbar('Failed to load product', { variant: 'error' });
      navigate('/dashboard');
    }
  }, [isError, enqueueSnackbar, navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePaymentInitiation = async (paymentData) => {
    try {
      const result = await initiatePayment({
        product_id: id,
        amount: product.price,
        payment_method: paymentData.payment_method
      }).unwrap();
      
      enqueueSnackbar('Payment initiated successfully!', { variant: 'success' });
      navigate(`/payment-status/${result.transaction_id}`);
    } catch (error) {
      enqueueSnackbar(error.data?.message || 'Payment failed', { 
        variant: 'error' 
      });
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
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

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={product?.images?.[0]?.image || '/placeholder-product.jpg'}
              alt={product?.name}
            />
            <Box sx={{ display: 'flex', p: 1 }}>
              {product?.images?.slice(0, 4).map((img, index) => (
                <Box key={index} sx={{ width: 80, height: 80, m: 1 }}>
                  <img 
                    src={img.image} 
                    alt={`Thumbnail ${index}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1">
              {product?.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Chip 
                label={product?.category?.name} 
                color="primary" 
                size="small" 
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Posted {new Date(product?.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
            {product?.price} TZS
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<ShoppingCartIcon />}
              onClick={() => setShowPaymentForm(true)}
              sx={{ mr: 2 }}
              disabled={isPaymentLoading}
            >
              {isPaymentLoading ? 'Processing...' : 'Buy Now'}
            </Button>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </Box>

          {showPaymentForm && (
            <Box sx={{ mb: 3, p: 3, border: '1px solid #eee', borderRadius: 1 }}>
              <PaymentForm 
                productId={id} 
                amount={product?.price}
                onSuccess={handlePaymentInitiation}
                isLoading={isPaymentLoading}
              />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Description" />
            <Tab label="Details" />
            <Tab label="Seller Info" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && (
              <Typography>{product?.description || 'No description provided'}</Typography>
            )}
            {activeTab === 1 && (
              <Box component="dl">
                {product?.attributes?.map((attr) => (
                  <React.Fragment key={attr.id}>
                    <Typography component="dt" fontWeight="bold">
                      {attr.attribute.name}:
                    </Typography>
                    <Typography component="dd" sx={{ mb: 1 }}>
                      {attr.value}
                    </Typography>
                  </React.Fragment>
                ))}
              </Box>
            )}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6">{product?.seller?.firstname}</Typography>
                <Typography color="text.secondary">
                  Member since {new Date(product?.seller?.date_joined).toLocaleDateString()}
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/users/${product?.seller?.id}`)}
                >
                  View Seller Profile
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductPage;