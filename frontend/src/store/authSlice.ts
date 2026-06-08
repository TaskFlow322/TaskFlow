import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    updateProfile: (state, action: PayloadAction<{ name?: string; email?: string; avatar?: string }>) => {
      if (state.user) {
        if (action.payload.name) state.user.name = action.payload.name;
        if (action.payload.email) state.user.email = action.payload.email;
        if (action.payload.avatar) state.user.avatar = action.payload.avatar;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;