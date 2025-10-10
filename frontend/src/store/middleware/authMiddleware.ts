import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { logout } from '../slices/authSlice';

/**
 * Middleware to handle 401 Unauthorized and 403 Forbidden errors globally
 * When a 401/403 error is received, automatically logout the user
 */
export const authMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  // Check if this is a rejected action with a 401 or 403 status
  if (isRejectedWithValue(action)) {
    const payload = action.payload as { status?: number; data?: unknown };
    const status = payload?.status;

    // If we get a 401 Unauthorized or 403 Forbidden, logout the user
    if (status === 401 || status === 403) {
      console.warn(`${status} ${status === 401 ? 'Unauthorized' : 'Forbidden'} - Logging out user`);
      console.log('Action that triggered logout:', action);
      storeAPI.dispatch(logout());

      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }

  return next(action);
};
