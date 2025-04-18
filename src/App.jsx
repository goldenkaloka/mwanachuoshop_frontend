import React from 'react';
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

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#1976d2',
        },
      },
    },
  },
});
// Remove the ProtectedRoute import and usage
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<ProductGrid />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              
              {/* These routes will handle their own auth checks */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products/create" element={<ProductCreatePage />} />
              <Route path="/products/edit/:id" element={<ProductEditPage />} />
              <Route path="/payment/:productId" element={<PaymentPage />} />
              <Route path="/payment-status/:paymentId" element={<PaymentStatusPage />} />
              
              {/* Redirects */}
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/marketplace" element={<Navigate to="/products" replace />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}


export default App;