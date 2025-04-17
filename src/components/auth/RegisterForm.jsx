import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../features/auth/authApiSlice';
import { useSnackbar } from 'notistack';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Grid, 
  Link, 
  InputAdornment, 
  IconButton,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Person,
  Email,
  Phone,
  Lock
} from '@mui/icons-material';
import * as yup from 'yup';
import { useFormik } from 'formik';

// Validation schema
const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  username: yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
  firstname: yup.string().required('First name is required'),
  phonenumber: yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, 'Must be at least 10 digits')
    .required('Phone number is required'),
  password1: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
      'Must contain uppercase, lowercase, number and special character'
    )
    .required('Password is required'),
  password2: yup.string()
    .oneOf([yup.ref('password1'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const RegisterForm = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      firstname: '',
      phonenumber: '',
      password1: '',
      password2: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const registrationData = {
          username: values.username,
          email: values.email,
          password1: values.password1,
          password2: values.password2,
          firstname: values.firstname,
          phonenumber: values.phonenumber
        };
        
        await register(registrationData).unwrap();
        enqueueSnackbar('Registration successful! Please check your email to verify your account.', { 
          variant: 'success',
          autoHideDuration: 5000
        });
        navigate('/login');
      } catch (err) {
        // Handle API errors
        if (err.data) {
          if (typeof err.data === 'object') {
            // Transform Django error response to formik errors
            const apiErrors = {};
            Object.entries(err.data).forEach(([key, value]) => {
              apiErrors[key] = Array.isArray(value) ? value.join(' ') : value;
            });
            setErrors(apiErrors);
          } else {
            enqueueSnackbar(err.data, { variant: 'error' });
          }
        } else {
          enqueueSnackbar('Registration failed. Please try again.', { variant: 'error' });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box 
      component="form" 
      onSubmit={formik.handleSubmit}
      sx={{ 
        mt: 3,
        maxWidth: '500px',
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2
      }}
      noValidate
    >
      <Typography variant="h5" align="center" gutterBottom>
        Create an Account
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstname"
            value={formik.values.firstname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstname && Boolean(formik.errors.firstname)}
            helperText={formik.touched.firstname && formik.errors.firstname}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Phone Number"
        name="phonenumber"
        value={formik.values.phonenumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.phonenumber && Boolean(formik.errors.phonenumber)}
        helperText={formik.touched.phonenumber && formik.errors.phonenumber}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Password"
        name="password1"
        type={showPassword ? 'text' : 'password'}
        value={formik.values.password1}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password1 && Boolean(formik.errors.password1)}
        helperText={formik.touched.password1 && formik.errors.password1}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Confirm Password"
        name="password2"
        type={showPassword ? 'text' : 'password'}
        value={formik.values.password2}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password2 && Boolean(formik.errors.password2)}
        helperText={formik.touched.password2 && formik.errors.password2}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.5 }}
        disabled={formik.isSubmitting || isLoading}
        startIcon={formik.isSubmitting || isLoading ? <CircularProgress size={20} /> : null}
      >
        {formik.isSubmitting || isLoading ? 'Registering...' : 'Register'}
      </Button>

      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link href="/login" variant="body2">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterForm;