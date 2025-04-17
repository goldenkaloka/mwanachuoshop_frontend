import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../features/auth/authApiSlice';
import { useSnackbar } from 'notistack';
import { 
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography
} from '@mui/material';

// Static component prevents unnecessary re-renders
const LoginHeader = React.memo(() => (
  <Typography 
    variant="h4" 
    component="h1"
    sx={{ 
      mb: 3,
      fontDisplay: 'swap', // Ensure text remains visible during webfont load
      willChange: 'transform' // Hint for browser optimization
    }}
  >
    Welcome Back
  </Typography>
));

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [login, { isLoading }] = useLoginMutation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Memoized change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Optimized submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const userData = await login(formData).unwrap();
      enqueueSnackbar('Login successful', { 
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      });
      navigate('/dashboard');
    } catch (err) {
      enqueueSnackbar(err.data?.error || 'Login failed', { 
        variant: 'error',
        autoHideDuration: 3000
      });
    }
  }, [formData, login, navigate, enqueueSnackbar]);

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        mt: 3,
        maxWidth: 400,
        mx: 'auto',
        '& .MuiTextField-root': { mb: 2 }
      }}
    >
      <LoginHeader />
      
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        variant="outlined"
        inputProps={{
          'aria-label': 'Email input',
          'data-testid': 'email-input',
          'autocomplete': 'email' // Helps browser autofill
        }}
      />
      
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        variant="outlined"
        inputProps={{
          'aria-label': 'Password input',
          'data-testid': 'password-input',
          'autocomplete': 'current-password'
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{ 
          mt: 2,
          py: 1.5,
          '&.Mui-disabled': { opacity: 0.7 }
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Login'
        )}
      </Button>
    </Box>
  );
};

export default React.memo(LoginForm);