// App.js

import React from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Dashboard & Core Pages
import DashboardPage from './pages/Dashboard/DashboardPage';
import HomePage from './pages/HomePage';

// Product Pages
import ProductGrid from './pages/Products/ProductGrid';
import ProductDetailPage from './pages/Products/ProductDetailPage';
import ProductCreatePage from './pages/Products/ProductCreatePage';
import ProductEditPage from './pages/Products/ProductEditPage';

// Payment Pages
import PaymentPage from './pages/Payments/PaymentPage';
import PaymentStatusPage from './pages/Payments/PaymentStatusPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useGetCurrentUserQuery } from './features/auth/authApiSlice';
import { setCredentials } from './features/auth/authSlice';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AuthWrapper({ children }) {
  const { data: user, isLoading, isSuccess } = useGetCurrentUserQuery();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isSuccess && user) {
      dispatch(setCredentials(user));
    }
  }, [isSuccess, user, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
}




function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            <AuthWrapper>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductGrid />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/products/create" element={<ProductCreatePage />} />
                  <Route path="/products/edit/:id" element={<ProductEditPage />} />
                  <Route path="/payment/:productId" element={<PaymentPage />} />
                  <Route path="/payment-status/:paymentId" element={<PaymentStatusPage />} />
                </Route>

                {/* Redirects */}
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/marketplace" element={<Navigate to="/products" replace />} />
              </Routes>
            </AuthWrapper>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;