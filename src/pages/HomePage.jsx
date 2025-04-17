import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid,
  Paper,
  Avatar,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../features/auth/authSlice';
import ProductGrid from '../pages/Products/ProductGrid';
import HeroSection from '../components/ui/HeroSection';

const HomePage = () => {
  const theme = useTheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection isAuthenticated={isAuthenticated} user={user} />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Message for Logged-in Users */}
        {isAuthenticated && (
          <Box sx={{ 
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            p: 3,
            borderRadius: 2,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Avatar 
              src={user?.profile?.image} 
              alt={user?.firstname}
              sx={{ width: 56, height: 56 }}
            />
            <Box>
              <Typography variant="h5" component="h2">
                Welcome back, {user?.firstname}!
              </Typography>
              <Typography variant="body1">
                Ready to discover our latest products?
              </Typography>
            </Box>
          </Box>
        )}

        {/* Call to Action for Guests */}
        {!isAuthenticated && (
          <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Join our community today!
            </Typography>
            <Typography variant="body1" paragraph>
              Sign up to get personalized recommendations and exclusive deals.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                component={Link}
                to="/register"
                variant="contained"
                size="large"
              >
                Create Account
              </Button>
              <Button 
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
              >
                Sign In
              </Button>
            </Box>
          </Paper>
        )}

        {/* Featured Products */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {isAuthenticated ? 'Recommended For You' : 'Featured Products'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            {isAuthenticated 
              ? 'Products we think you\'ll love based on your preferences'
              : 'Discover our latest collection'}
          </Typography>
          <ProductGrid />
        </Box>

        {/* Seller CTA */}
        {isAuthenticated && (
          <Paper elevation={3} sx={{ p: 3, mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Have products to sell?
            </Typography>
            <Typography variant="body1" paragraph>
              Start your own shop and reach thousands of potential customers.
            </Typography>
            <Button 
              component={Link}
              to="/dashboard"
              variant="contained"
              size="large"
              color="secondary"
            >
              Go to Seller Dashboard
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;