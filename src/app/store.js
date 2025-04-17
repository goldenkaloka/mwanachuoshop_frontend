import { configureStore } from '@reduxjs/toolkit';
import {apiSlice} from '../api/apiSlice';


import authReducer from '../features/auth/authSlice';
import paymentReducer from '../features/payment/paymentSlice';
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});