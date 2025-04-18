import { createSlice } from '@reduxjs/toolkit';
import { authApiSlice } from './authApiSlice';

const initialState = {
  user: null,
  token: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setCredentials: (state, action) => {
      const { user, access } = action.payload;
      localStorage.setItem('accessToken', access);
      state.user = user;
      state.token = access;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiSlice.endpoints.login.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.getCurrentUser.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.access;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.getCurrentUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.login.matchRejected,
        (state, { error }) => {
          state.error = error.data;
          state.isLoading = false;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.getCurrentUser.matchRejected,
        (state, { error }) => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = error.data;
        }
      );
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.isLoading;