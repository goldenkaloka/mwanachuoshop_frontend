import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:8000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token || localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Handle 401 errors
    if (result?.error?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        // Try to refresh the token
        const refreshResult = await baseQuery(
          {
            url: '/users/auth/token/refresh/',
            method: 'POST',
            body: { refresh: refreshToken },
          },
          api,
          extraOptions
        );
        
        if (refreshResult.data?.access) {
          // Store the new token
          localStorage.setItem('accessToken', refreshResult.data.access);
          
          // Retry the original request with new token
          const retryResult = await baseQuery(args, api, extraOptions);
          return retryResult;
        } else {
          // Refresh failed - clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          api.dispatch({ type: 'auth/logout' });
        }
      }
    }
    return result;
  },
  tagTypes: ['User', 'Auth', 'Product'],
  endpoints: () => ({}),
});