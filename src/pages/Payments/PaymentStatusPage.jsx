// pages/Payments/PaymentStatusPage.jsx

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
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

const PaymentStatusPage = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // In a real app, you would query the payment status from your API
  const [paymentStatus, setPaymentStatus] = React.useState('pending');
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Simulate checking payment status
    const timer = setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, we'll randomly set success or failure
      setPaymentStatus(Math.random() > 0.5 ? 'success' : 'failed');
    }, 2000);

    return () => clearTimeout(timer);
  }, [paymentId]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Checking payment status...
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          {paymentStatus === 'success' ? (
            <>
              <CheckIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Payment Successful
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Thank you for your payment. Your product is now active.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </>
          ) : (
            <>
              <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Payment Failed
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                We couldn't process your payment. Please try again.
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => navigate('/dashboard')}
              >
                Try Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentStatusPage;