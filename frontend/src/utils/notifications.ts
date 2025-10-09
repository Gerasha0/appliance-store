import { enqueueSnackbar, closeSnackbar } from 'notistack';
import type { VariantType } from 'notistack';

/**
 * Notification System Utilities
 * Provides helper functions for showing notifications using notistack
 */

export interface NotificationOptions {
  /**
   * Duration in milliseconds. Default is 3000ms (3 seconds)
   */
  duration?: number;
  /**
   * Position of the notification
   */
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  /**
   * Persist the notification (doesn't auto-dismiss)
   */
  persist?: boolean;
  /**
   * Allow user to dismiss by clicking
   */
  preventDuplicate?: boolean;
}

/**
 * Show a success notification
 * @param message - The message to display
 * @param options - Optional configuration
 * @returns The snackbar key (can be used to close it manually)
 */
export const showSuccess = (
  message: string,
  options?: NotificationOptions
): string | number => {
  return enqueueSnackbar(message, {
    variant: 'success',
    autoHideDuration: options?.duration ?? 3000,
    anchorOrigin: options?.anchorOrigin ?? {
      vertical: 'top',
      horizontal: 'right',
    },
    persist: options?.persist ?? false,
    preventDuplicate: options?.preventDuplicate ?? true,
  });
};

/**
 * Show an error notification
 * @param message - The message to display
 * @param options - Optional configuration
 * @returns The snackbar key (can be used to close it manually)
 */
export const showError = (
  message: string,
  options?: NotificationOptions
): string | number => {
  return enqueueSnackbar(message, {
    variant: 'error',
    autoHideDuration: options?.duration ?? 5000, // Errors stay longer
    anchorOrigin: options?.anchorOrigin ?? {
      vertical: 'top',
      horizontal: 'right',
    },
    persist: options?.persist ?? false,
    preventDuplicate: options?.preventDuplicate ?? true,
  });
};

/**
 * Show a warning notification
 * @param message - The message to display
 * @param options - Optional configuration
 * @returns The snackbar key (can be used to close it manually)
 */
export const showWarning = (
  message: string,
  options?: NotificationOptions
): string | number => {
  return enqueueSnackbar(message, {
    variant: 'warning',
    autoHideDuration: options?.duration ?? 4000,
    anchorOrigin: options?.anchorOrigin ?? {
      vertical: 'top',
      horizontal: 'right',
    },
    persist: options?.persist ?? false,
    preventDuplicate: options?.preventDuplicate ?? true,
  });
};

/**
 * Show an info notification
 * @param message - The message to display
 * @param options - Optional configuration
 * @returns The snackbar key (can be used to close it manually)
 */
export const showInfo = (
  message: string,
  options?: NotificationOptions
): string | number => {
  return enqueueSnackbar(message, {
    variant: 'info',
    autoHideDuration: options?.duration ?? 3000,
    anchorOrigin: options?.anchorOrigin ?? {
      vertical: 'top',
      horizontal: 'right',
    },
    persist: options?.persist ?? false,
    preventDuplicate: options?.preventDuplicate ?? true,
  });
};

/**
 * Show a default notification (no specific variant)
 * @param message - The message to display
 * @param options - Optional configuration
 * @returns The snackbar key (can be used to close it manually)
 */
export const showNotification = (
  message: string,
  variant?: VariantType,
  options?: NotificationOptions
): string | number => {
  return enqueueSnackbar(message, {
    variant: variant ?? 'default',
    autoHideDuration: options?.duration ?? 3000,
    anchorOrigin: options?.anchorOrigin ?? {
      vertical: 'top',
      horizontal: 'right',
    },
    persist: options?.persist ?? false,
    preventDuplicate: options?.preventDuplicate ?? true,
  });
};

/**
 * Close a specific notification by key
 * @param key - The key returned from showing a notification
 */
export const closeNotification = (key: string | number): void => {
  closeSnackbar(key);
};

/**
 * Close all notifications
 */
export const closeAllNotifications = (): void => {
  closeSnackbar();
};

// Predefined common notification messages
export const NotificationMessages = {
  // Success messages
  SUCCESS: {
    SAVED: 'Successfully saved!',
    CREATED: 'Successfully created!',
    UPDATED: 'Successfully updated!',
    DELETED: 'Successfully deleted!',
    LOGIN: 'Successfully logged in!',
    LOGOUT: 'Successfully logged out!',
    REGISTERED: 'Successfully registered!',
    APPROVED: 'Successfully approved!',
    CANCELED: 'Successfully canceled!',
  },
  // Error messages
  ERROR: {
    GENERIC: 'An error occurred. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access forbidden.',
    NOT_FOUND: 'Resource not found.',
    SERVER: 'Server error. Please try again later.',
    VALIDATION: 'Validation error. Please check your input.',
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
  },
  // Warning messages
  WARNING: {
    UNSAVED_CHANGES: 'You have unsaved changes.',
    SESSION_EXPIRING: 'Your session is about to expire.',
    INCOMPLETE_DATA: 'Some data is incomplete.',
  },
  // Info messages
  INFO: {
    LOADING: 'Loading...',
    PROCESSING: 'Processing...',
    NO_DATA: 'No data available.',
    EMPTY_LIST: 'The list is empty.',
  },
};

/**
 * Helper function to show API error notifications
 * Extracts error message from various error formats
 */
export const showApiError = (error: any): string | number => {
  let message = NotificationMessages.ERROR.GENERIC;

  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  return showError(message);
};

/**
 * Helper to show loading notification that needs manual dismissal
 * @param message - Loading message
 * @returns Key to close the notification later
 */
export const showLoading = (message: string = NotificationMessages.INFO.LOADING): string | number => {
  return showInfo(message, { persist: true });
};

/**
 * Helper to update a loading notification to success
 * @param loadingKey - The key from showLoading
 * @param message - Success message
 */
export const updateLoadingToSuccess = (
  loadingKey: string | number,
  message: string = NotificationMessages.SUCCESS.SAVED
): void => {
  closeNotification(loadingKey);
  showSuccess(message);
};

/**
 * Helper to update a loading notification to error
 * @param loadingKey - The key from showLoading
 * @param message - Error message
 */
export const updateLoadingToError = (
  loadingKey: string | number,
  message: string = NotificationMessages.ERROR.GENERIC
): void => {
  closeNotification(loadingKey);
  showError(message);
};

// Export all notification functions as a single object for convenience
export const notifications = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  show: showNotification,
  close: closeNotification,
  closeAll: closeAllNotifications,
  apiError: showApiError,
  loading: showLoading,
  updateToSuccess: updateLoadingToSuccess,
  updateToError: updateLoadingToError,
};

export default notifications;
