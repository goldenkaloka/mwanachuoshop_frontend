import { apiSlice } from '../../api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/auth/login/',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        if (response.access) {
          localStorage.setItem('accessToken', response.access);
          if (response.refresh) {
            localStorage.setItem('refreshToken', response.refresh);
          }
        }
        return response;
      },
      invalidatesTags: ['User'],
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/users/auth/register/',
        method: 'POST',
        body: userData,
      }),
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          data: response.data?.detail || 
               (typeof response.data === 'object' 
                ? Object.entries(response.data).map(([k,v]) => `${k}: ${v}`).join('\n') 
                : 'Registration failed')
        };
      },
    }),

    getCurrentUser: builder.query({
      query: () => '/users/auth/user/',
      providesTags: ['User'],
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: '/users/auth/token/refresh/',
        method: 'POST',
        body: { refresh: localStorage.getItem('refreshToken') },
      }),
      transformResponse: (response) => {
        if (response.access) {
          localStorage.setItem('accessToken', response.access);
        }
        return response;
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/users/auth/logout/',
        method: 'POST',
      }),
      transformResponse: (response) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return response;
      },
      invalidatesTags: ['User'],
    }),

    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/users/auth/profile/',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation({
      query: (passwords) => ({
        url: '/users/auth/password/change/',
        method: 'POST',
        body: passwords,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApiSlice;