import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '@/types/models';
import type { RootState } from '../store';

interface AuthState {
  token: string | null;
  email: string | null;
  role: UserRole | null;
  userId: number | null;
  firstName: string | null;
  lastName: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  email: localStorage.getItem('email'),
  role: localStorage.getItem('role') as UserRole | null,
  userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
  firstName: localStorage.getItem('firstName'),
  lastName: localStorage.getItem('lastName'),
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; email: string; role: string; userId: number; firstName: string; lastName: string }>
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.role = action.payload.role as UserRole;
      state.userId = action.payload.userId;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('role', action.payload.role);
      localStorage.setItem('userId', action.payload.userId.toString());
      localStorage.setItem('firstName', action.payload.firstName);
      localStorage.setItem('lastName', action.payload.lastName);
    },
    logout: state => {
      state.token = null;
      state.email = null;
      state.role = null;
      state.userId = null;
      state.firstName = null;
      state.lastName = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectToken = (state: RootState) => state.auth.token;
export const selectEmail = (state: RootState) => state.auth.email;
export const selectRole = (state: RootState) => state.auth.role;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsEmployee = (state: RootState) => state.auth.role === UserRole.EMPLOYEE;
export const selectIsClient = (state: RootState) => state.auth.role === UserRole.CLIENT;

export default authSlice.reducer;
