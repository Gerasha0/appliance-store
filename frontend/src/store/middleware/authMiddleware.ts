import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { logout } from '../slices/authSlice';

export const authMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as { status?: number; data?: unknown };
    const status = payload?.status;

    if (status === 401 || status === 403) {
      console.warn(`${status} ${status === 401 ? 'Unauthorized' : 'Forbidden'} - Logging out user`);
      console.log('Action that triggered logout:', action);
      storeAPI.dispatch(logout());

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }

  return next(action);
};