import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../../features/auth/authApiSlice';
import { useSnackbar } from 'notistack';
import { Box, Container, Typography, Avatar, Grid, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (formData) => {
    try {
      const userData = await login(formData).unwrap();
      enqueueSnackbar('Login successful', { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      enqueueSnackbar(err.data?.error || 'Login failed', { variant: 'error' });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box sx={{ mt: 3, width: '100%' }}>
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
        </Box>
        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="body2">
                Don't have an account? Sign up
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LoginPage;