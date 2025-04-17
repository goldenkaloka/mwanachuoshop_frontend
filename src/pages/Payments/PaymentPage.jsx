// pages/Payments/PaymentPage.jsx

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useInitiateProductPaymentMutation } from '../../features/products/productsApiSlice';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Card,
  CardContent,
  Button,
  Divider
} from '@mui/material';
import { Check as CheckIcon, Error as ErrorIcon } from '@mui/icons-material';

const PaymentPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [initiatePayment, { data: paymentResponse, isLoading, isError }] = 
    useInitiateProductPaymentMutation();

  useEffect(() => {
    const initiate = async () => {
      try {
        await initiatePayment({ productId }).unwrap();
      } catch (error) {
        enqueueSnackbar('Failed to initiate payment', { variant: 'error' });
        console.error('Payment initiation error:', error);
      }
    };
    
    initiate();
  }, [productId, initiatePayment, enqueueSnackbar]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Card sx={{ maxWidth: 500, width: '100%' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Payment Failed
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              We couldn't initiate your payment. Please try again.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(`/products/${productId}`)}
            >
              Back to Product
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (paymentResponse?.azampay_response) {
    // Redirect to AzamPay payment page
    window.location.href = paymentResponse.azampay_response.checkout_url;
    return null;
  }

  if (paymentResponse?.status === 'completed') {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Card sx={{ maxWidth: 500, width: '100%' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Payment Successful
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your product has been successfully activated.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(`/products/${productId}`)}
            >
              View Product
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return null;
};

export default PaymentPage;