import type { AxiosError } from 'axios';
import { logout } from '@/store/slices/authSlice';
import type { AppDispatch } from '@/store/store';
import { showError, showWarning, showInfo } from './notifications';

/**
 * Centralized API Error Handler
 * Handles different HTTP error codes and provides user-friendly messages
 */

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: any;
}

/**
 * Extract error message from various error formats
 */
export const extractErrorMessage = (error: any): string => {
  // Check for response data message
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Check for response data error
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  // Check for error message
  if (error?.message) {
    return error.message;
  }

  // Check if error is a string
  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

/**
 * Get user-friendly error message based on status code
 */
export const getUserFriendlyMessage = (statusCode: number, defaultMessage?: string): string => {
  const messages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Your session has expired. Please log in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This operation conflicts with existing data.',
    422: 'Validation failed. Please check your input.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
    502: 'Bad gateway. The server is temporarily unavailable.',
    503: 'Service unavailable. Please try again later.',
    504: 'Gateway timeout. The request took too long.',
  };

  return messages[statusCode] || defaultMessage || 'An error occurred. Please try again.';
};

/**
 * Handle 401 Unauthorized - Log out user
 */
const handle401 = (dispatch: AppDispatch, error: AxiosError): void => {
  const message = extractErrorMessage(error) || 'Your session has expired. Please log in again.';
  showError(message);
  
  // Dispatch logout action
  dispatch(logout());
  
  // Redirect to login page
  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
};

/**
 * Handle 403 Forbidden - Show access denied message
 */
const handle403 = (error: AxiosError): void => {
  const message = extractErrorMessage(error) || 'You do not have permission to access this resource.';
  showError(message);
};

/**
 * Handle 404 Not Found
 */
const handle404 = (error: AxiosError): void => {
  const message = extractErrorMessage(error) || 'The requested resource was not found.';
  showWarning(message);
};

/**
 * Handle 422 Validation Error
 */
const handle422 = (error: AxiosError): void => {
  const message = extractErrorMessage(error) || 'Validation error. Please check your input.';
  showError(message);
};

/**
 * Handle 500 Server Error
 */
const handle500 = (error: AxiosError): void => {
  const message = extractErrorMessage(error) || 'Server error. Please try again later.';
  showError(message);
};

/**
 * Handle Network Error (no response from server)
 */
const handleNetworkError = (): void => {
  showError('Network error. Please check your internet connection.');
};

/**
 * Main error handler function
 * @param error - The error object from API call
 * @param dispatch - Redux dispatch function
 * @param customMessage - Optional custom error message
 * @returns ApiError object with details
 */
export const handleApiError = (
  error: any,
  dispatch?: AppDispatch,
  customMessage?: string
): ApiError => {
  // Handle Axios errors
  if (error?.isAxiosError || error?.response) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status;
    const errorMessage = extractErrorMessage(axiosError);

    // Handle different status codes
    if (statusCode) {
      switch (statusCode) {
        case 401:
          if (dispatch) {
            handle401(dispatch, axiosError);
          } else {
            showError(getUserFriendlyMessage(401));
          }
          break;

        case 403:
          handle403(axiosError);
          break;

        case 404:
          handle404(axiosError);
          break;

        case 422:
          handle422(axiosError);
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          handle500(axiosError);
          break;

        default: {
          // For other status codes, show the error message
          const message = customMessage || errorMessage || getUserFriendlyMessage(statusCode);
          showError(message);
          break;
        }
      }

      return {
        message: errorMessage,
        statusCode,
        details: axiosError.response?.data,
      };
    }

    // No response - network error
    handleNetworkError();
    return {
      message: 'Network error',
      statusCode: 0,
    };
  }

  // Handle non-Axios errors
  const message = customMessage || extractErrorMessage(error) || 'An unexpected error occurred';
  showError(message);

  return {
    message,
  };
};

/**
 * Handle API error with custom message
 */
export const handleApiErrorWithMessage = (
  error: any,
  message: string,
  dispatch?: AppDispatch
): void => {
  handleApiError(error, dispatch, message);
};

/**
 * Create an error handler with dispatch
 * Useful for creating a reusable error handler in components
 */
export const createErrorHandler = (dispatch: AppDispatch) => {
  return (error: any, customMessage?: string) => {
    return handleApiError(error, dispatch, customMessage);
  };
};

/**
 * Silent error handler - logs error but doesn't show notification
 * Useful for non-critical errors
 */
export const handleApiErrorSilently = (error: any): ApiError => {
  const statusCode = error?.response?.status;
  const errorMessage = extractErrorMessage(error);

  console.error('API Error (silent):', {
    message: errorMessage,
    statusCode,
    error,
  });

  return {
    message: errorMessage,
    statusCode,
    details: error?.response?.data,
  };
};

/**
 * Check if error is a specific status code
 */
export const isErrorStatus = (error: any, statusCode: number): boolean => {
  return error?.response?.status === statusCode;
};

/**
 * Check if error is unauthorized (401)
 */
export const isUnauthorizedError = (error: any): boolean => {
  return isErrorStatus(error, 401);
};

/**
 * Check if error is forbidden (403)
 */
export const isForbiddenError = (error: any): boolean => {
  return isErrorStatus(error, 403);
};

/**
 * Check if error is not found (404)
 */
export const isNotFoundError = (error: any): boolean => {
  return isErrorStatus(error, 404);
};

/**
 * Check if error is validation error (422)
 */
export const isValidationError = (error: any): boolean => {
  return isErrorStatus(error, 422);
};

/**
 * Check if error is server error (5xx)
 */
export const isServerError = (error: any): boolean => {
  const statusCode = error?.response?.status;
  return statusCode >= 500 && statusCode < 600;
};

/**
 * Check if error is network error (no response)
 */
export const isNetworkError = (error: any): boolean => {
  return error?.isAxiosError && !error?.response;
};

/**
 * Show validation errors from API response
 * Useful for form validation errors
 */
export const showValidationErrors = (error: any): void => {
  const validationErrors = error?.response?.data?.errors || error?.response?.data?.validationErrors;

  if (validationErrors && typeof validationErrors === 'object') {
    Object.entries(validationErrors).forEach(([field, messages]) => {
      const errorMessages = Array.isArray(messages) ? messages : [messages];
      errorMessages.forEach((message) => {
        showError(`${field}: ${message}`);
      });
    });
  } else {
    handleApiError(error);
  }
};

/**
 * Retry handler - shows info about retry attempt
 */
export const showRetryInfo = (attemptNumber: number, maxAttempts: number): void => {
  showInfo(`Retry attempt ${attemptNumber} of ${maxAttempts}...`);
};

/**
 * Export all error handling utilities as a single object
 */
export const errorHandler = {
  handle: handleApiError,
  handleWithMessage: handleApiErrorWithMessage,
  handleSilently: handleApiErrorSilently,
  createHandler: createErrorHandler,
  extractMessage: extractErrorMessage,
  getUserFriendlyMessage,
  showValidationErrors,
  showRetryInfo,
  // Status checkers
  isUnauthorized: isUnauthorizedError,
  isForbidden: isForbiddenError,
  isNotFound: isNotFoundError,
  isValidation: isValidationError,
  isServerError,
  isNetworkError,
};

export default errorHandler;
