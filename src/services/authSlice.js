// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { api } from './api';
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
        state.user=action.payload;
        state.isLoggedIn = true;        
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
        localStorage.removeItem('user');
        api.util.invalidateTags(['Article']);
        api.util.resetApiState();
      },
      checkAuth(state) {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
          state.token = token;
          state.isLoggedIn = true;
          state.user=JSON.parse(user)
        }
      },
      updateUser(state){
        const user=JSON.parse(localStorage.getItem('user'))
        if(user){
            state.token=user.token
            state.user=user;
        }
      }
  }
});

export const { loginStart, loginSuccess, loginFailure,checkAuth, logout ,updateUser} = authSlice.actions;
export default authSlice.reducer;