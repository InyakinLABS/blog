// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoggedIn = true;
        localStorage.setItem('token', action.payload.token);
      },
    loginFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
        state.token = null;
        state.user = null;
        state.isLoggedIn = false;
        localStorage.removeItem('token');
      },
      checkAuth(state) {
        const token = localStorage.getItem('token');
        if (token) {
          state.token = token;
          state.isLoggedIn = true;
        }
      },
  }
});

export const { loginStart, loginSuccess, loginFailure,checkAuth, logout } = authSlice.actions;
export default authSlice.reducer;