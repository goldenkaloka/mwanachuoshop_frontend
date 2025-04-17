// src/features/payment/paymentApiSlice.js
import { apiSlice } from '../../api/apiSlice';

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    processPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments/process/',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),
    
    initiateProductPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/product/payment/',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // Keep existing query
    checkPaymentStatus: builder.query({
      query: (paymentId) => `/payments/${paymentId}/`,
      providesTags: (result, error, arg) => [{ type: 'Payment', id: arg }],
    }),
    
    // Add mutation version if needed by your backend
    verifyPayment: builder.mutation({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/verify/`,
        method: 'POST',
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const {
  useProcessPaymentMutation,
  useInitiateProductPaymentMutation,
  useCheckPaymentStatusQuery,
  useVerifyPaymentMutation, // Now exported
} = paymentApiSlice;