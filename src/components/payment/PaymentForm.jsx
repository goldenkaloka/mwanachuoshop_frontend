import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInitiateProductPaymentMutation } from '../../features/payment/paymentSlice';
import { setCurrentPayment } from '../../features/payment/paymentSlice';
import { useSnackbar } from 'notistack';
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box,
  Typography,
  CircularProgress
} from '@mui/material';

const PaymentForm = ({ productId, productPrice, onSuccess }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [initiatePayment, { isLoading }] = useInitiateProductPaymentMutation();
  const { paymentMethods } = useSelector((state) => state.payment);
  const [paymentMethod, setPaymentMethod] = useState('azampay');
  const [amount, setAmount] = useState(productPrice || '');
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form whenever amount or paymentMethod changes
  useEffect(() => {
    setIsFormValid(
      amount > 0 && 
      paymentMethod && 
      paymentMethods.includes(paymentMethod)
    );
  }, [amount, paymentMethod, paymentMethods]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      enqueueSnackbar('Please fill all required fields correctly', { variant: 'warning' });
      return;
    }

    try {
      const paymentData = {
        product_id: productId,
        amount: parseFloat(amount),
        payment_method: paymentMethod
      };
      
      const result = await initiatePayment(paymentData).unwrap();
      dispatch(setCurrentPayment(result));
      enqueueSnackbar('Payment initiated successfully!', { variant: 'success' });
      onSuccess(result);
    } catch (error) {
      enqueueSnackbar(
        error.data?.error?.message || 
        error.data?.error || 
        'Payment failed. Please try again.',
        { variant: 'error' }
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>

      <TextField
        label="Amount (TZS)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        fullWidth
        margin="normal"
        disabled={isLoading || productPrice} // Disable if price is fixed
        inputProps={{ 
          min: 1,
          step: "any"
        }}
        error={amount <= 0}
        helperText={amount <= 0 ? "Amount must be greater than 0" : ""}
      />
      
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Payment Method</InputLabel>
        <Select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          disabled={isLoading}
          label="Payment Method"
          error={!paymentMethod}
        >
          {paymentMethods?.map((method) => (
            <MenuItem key={method} value={method}>
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isFormValid || isLoading}
        fullWidth
        sx={{ mt: 2, py: 1.5 }}
      >
        {isLoading ? (
          <>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            Processing Payment...
          </>
        ) : (
          'Confirm Payment'
        )}
      </Button>
    </Box>
  );
};

export default PaymentForm;