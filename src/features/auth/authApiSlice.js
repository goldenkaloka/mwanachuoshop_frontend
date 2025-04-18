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
          return {
            user: response.user,
            access: response.access,
            refresh: response.refresh,
          };
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
    }),

    getCurrentUser: builder.query({
      query: () => '/users/auth/user/',
      providesTags: ['User'],
      // Retry with fresh token if 401 occurs
      extraOptions: { maxRetries: 1 },
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/users/auth/logout/',
        method: 'POST',
      }),
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
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApiSlice;