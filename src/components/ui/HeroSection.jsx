import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  useTheme,
  Container
} from '@mui/material';
import { Link } from 'react-router-dom';

const HeroSection = ({ isAuthenticated, user }) => {
  const theme = useTheme();

  return (
    <Box sx={{
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      py: 8,
      mb: 4,
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      textAlign: 'center'
    }}>
      <Container maxWidth="md">
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            mb: 2
          }}
        >
          {isAuthenticated 
            ? `Welcome back, ${user?.firstname || 'Valued Customer'}!`
            : 'Discover Amazing Products'}
        </Typography>
        <Typography 
          variant="h5" 
          component="p"
          sx={{ 
            mb: 4,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          {isAuthenticated
            ? 'Check out our latest collection tailored just for you'
            : 'Join thousands of satisfied customers shopping with us today'}
        </Typography>
        {!isAuthenticated && (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              sx={{ 
                color: 'inherit',
                borderColor: 'inherit',
                '&:hover': {
                  borderColor: 'inherit',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
              size="large"
            >
              Browse Products
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HeroSection;