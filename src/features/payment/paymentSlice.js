import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../../api/apiSlice';

const initialState = {
  currentPayment: null,
  paymentMethods: ['azampay', 'mpesa', 'card'],
  status: 'idle',
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setCurrentPayment: (state, action) => {
      state.currentPayment = action.payload;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
});

export const { setCurrentPayment, clearCurrentPayment } = paymentSlice.actions;

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    initiateProductPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/product/',
        method: 'POST',
        body: paymentData,
      }),
    }),
    initiateSubscriptionPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/subscription/',
        method: 'POST',
        body: paymentData,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (verificationData) => ({
        url: '/verify-payment/',
        method: 'POST',
        body: verificationData,
      }),
    }),
    getPaymentMethods: builder.query({
      query: () => '/payment-methods/',
    }),
  }),
});

export const {
  useInitiateProductPaymentMutation,
  useInitiateSubscriptionPaymentMutation,
  useVerifyPaymentMutation,
  useGetPaymentMethodsQuery,
} = paymentApiSlice;

export default paymentSlice.reducer;