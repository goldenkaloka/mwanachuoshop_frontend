import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, Container, Typography, Avatar, Grid, Paper } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import RegisterForm from '../../components/auth/RegisterForm';
import { useRegisterMutation } from '../../features/auth/authApiSlice';


const RegisterPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (formData) => {
    if (formData.password !== formData.password2) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }

    try {
      await register({
        email: formData.email,
        username: formData.username,
        firstname: formData.firstname,
        phonenumber: formData.phonenumber,
        password1: formData.password,
        password2: formData.password2
      }).unwrap();
      
      enqueueSnackbar('Registration successful! Please login.', { variant: 'success' });
      navigate('/login');
    } catch (err) {
      enqueueSnackbar(err.data?.error || 'Registration failed', { variant: 'error' });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box sx={{ mt: 3, width: '100%' }}>
          <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
        </Box>
        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="body2">
                Already have an account? Sign in
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default RegisterPage;