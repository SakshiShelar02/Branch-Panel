// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    email: '',
    password: '',
    isLoading: false,
    error: null,
    isAuthenticated: false,
    user: null
  },
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.error = null;
      state.user = action.payload;
      state.email = '';
      state.password = '';
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.email = '';
      state.password = '';
      state.error = null;
    }
  }
});

export const { 
  setEmail, 
  setPassword, 
  setLoading, 
  setError, 
  loginStart,
  loginSuccess, 
  loginFailure,
  logout 
} = authSlice.actions;

export default authSlice.reducer;