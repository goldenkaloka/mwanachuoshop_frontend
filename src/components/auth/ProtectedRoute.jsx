import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectAuthLoading } from '../../features/auth/authSlice';
import { useGetCurrentUserQuery } from '../../features/auth/authApiSlice';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const { isLoading: isUserLoading, isFetching, isError } = useGetCurrentUserQuery();

  // Show loading state if any auth process is ongoing
  if (isLoading || isUserLoading || isFetching) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated or if user fetch failed
  if (!isAuthenticated || isError) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children only when fully authenticated
  return children;
};

export default ProtectedRoute;