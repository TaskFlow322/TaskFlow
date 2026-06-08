import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/axiosInstance';
import { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Реальный логин
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }
);

// Реальная регистрация
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, username }: { email: string; password: string; username: string }) => {
    const response = await api.post('/auth/register', { email, password, username });
    return response.data;
  }
);

// Восстановление сессии
export const restoreSession = createAsyncThunk(
  'auth/restore',
  async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Нет токена');
    const response = await api.get('/auth/me');
    return response.data;
  }
);

// Обновление профиля
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ username, email, avatar }: { username?: string; email?: string; avatar?: string }) => {
    const response = await api.patch('/auth/profile', { username, email, avatar });
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      // restoreSession
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка обновления профиля';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;