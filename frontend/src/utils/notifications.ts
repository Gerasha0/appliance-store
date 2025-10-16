import { enqueueSnackbar, closeSnackbar } from 'notistack';
import type { VariantType } from 'notistack';

export interface NotificationOptions {
  duration?: number;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  persist?: boolean;
  preventDuplicate?: boolean;
}

export const showSuccess = (
  message: string,
  options?: NotificationOptions
): string | number => {
  return enqueueSnackbar(message, {
    variant: 'success',
    autoHideDuration: options?.duration ?? 2000,
    anchorOrigin: options?.anchorOrigin ?? {
      vertical: 'top',
      horizontal: 'right',
    },
    persist: options?.persist ?? false,
    preventDuplicate: options?.preventDuplicate ?? true,
  });
};

export const showError = (
  message: string,
  options?: NotificationOptions
): string | number => {
  return enqueueSnackbar(message, {
    variant: 'error',
    autoHideDuration: options?.duration ?? 5000,
    anchorOrigin: options?.anchorOrigin ?? {
      vertical: 'top',
      horizontal: 'right',
    },
    persist: options?.persist ?? false,
    preventDuplicate: options?.preventDuplicate ?? true,
  });
};

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

export const showInfo = (
  message: string,
  options?: NotificationOptions
): string | number => {
  return enqueueSnackbar(message, {
    variant: 'info',
    autoHideDuration: options?.duration ?? 2000,
    anchorOrigin: options?.anchorOrigin ?? {
      vertical: 'top',
      horizontal: 'right',
    },
    persist: options?.persist ?? false,
    preventDuplicate: options?.preventDuplicate ?? true,
  });
};

export const showNotification = (
  message: string,
  variant?: VariantType,
  options?: NotificationOptions
): string | number => {
  return enqueueSnackbar(message, {
    variant: variant ?? 'default',
    autoHideDuration: options?.duration ?? 2000,
    anchorOrigin: options?.anchorOrigin ?? {
      vertical: 'top',
      horizontal: 'right',
    },
    persist: options?.persist ?? false,
    preventDuplicate: options?.preventDuplicate ?? true,
  });
};

export const closeNotification = (key: string | number): void => {
  closeSnackbar(key);
};

export const closeAllNotifications = (): void => {
  closeSnackbar();
};

export const NotificationMessages = {
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
  WARNING: {
    UNSAVED_CHANGES: 'You have unsaved changes.',
    SESSION_EXPIRING: 'Your session is about to expire.',
    INCOMPLETE_DATA: 'Some data is incomplete.',
  },
  INFO: {
    LOADING: 'Loading...',
    PROCESSING: 'Processing...',
    NO_DATA: 'No data available.',
    EMPTY_LIST: 'The list is empty.',
  },
};

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

export const showLoading = (message: string = NotificationMessages.INFO.LOADING): string | number => {
  return showInfo(message, { persist: true });
};

export const updateLoadingToSuccess = (
  loadingKey: string | number,
  message: string = NotificationMessages.SUCCESS.SAVED
): void => {
  closeNotification(loadingKey);
  showSuccess(message);
};

export const updateLoadingToError = (
  loadingKey: string | number,
  message: string = NotificationMessages.ERROR.GENERIC
): void => {
  closeNotification(loadingKey);
  showError(message);
};

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