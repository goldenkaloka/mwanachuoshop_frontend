import React, { useEffect } from 'react';
import { useVerifyPaymentMutation } from '../../features/payment/paymentSlice';
import { useSnackbar } from 'notistack';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PaymentStatus = ({ paymentId }) => {
  const [verifyPayment, { isLoading }] = useVerifyPaymentMutation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const result = await verifyPayment({ payment_id: paymentId }).unwrap();
        if (result.status === 'completed') {
          enqueueSnackbar('Payment completed successfully!', { variant: 'success' });
          navigate('/dashboard');
        }
      } catch (error) {
        enqueueSnackbar(error.data?.error || 'Payment verification failed', { variant: 'error'});
      }
    };

    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [paymentId, verifyPayment, enqueueSnackbar, navigate]);

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <CircularProgress size={80} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Verifying your payment...
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Please wait while we confirm your payment.
      </Typography>
      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        onClick={() => navigate('/dashboard')}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default PaymentStatus;