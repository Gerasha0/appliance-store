import type { AxiosError } from 'axios';
import { logout } from '@/store/slices/authSlice';
import type { AppDispatch } from '@/store/store';
import { showError, showWarning, showInfo } from './notifications';

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: any;
}

export const extractErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

   if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

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

const handle401 = (dispatch: AppDispatch, error: AxiosError): void => {
  const message = extractErrorMessage(error) || 'Your session has expired. Please log in again.';
  showError(message);
  
  dispatch(logout());
  
  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
};

const handle403 = (error: AxiosError): void => {
  const message = extractErrorMessage(error) || 'You do not have permission to access this resource.';
  showError(message);
};

const handle404 = (error: AxiosError): void => {
  const message = extractErrorMessage(error) || 'The requested resource was not found.';
  showWarning(message);
};

const handle422 = (error: AxiosError): void => {
  const message = extractErrorMessage(error) || 'Validation error. Please check your input.';
  showError(message);
};

const handle500 = (error: AxiosError): void => {
  const message = extractErrorMessage(error) || 'Server error. Please try again later.';
  showError(message);
};

const handleNetworkError = (): void => {
  showError('Network error. Please check your internet connection.');
};

export const handleApiError = (
  error: any,
  dispatch?: AppDispatch,
  customMessage?: string
): ApiError => {
  if (error?.isAxiosError || error?.response) {
    const axiosError = error as AxiosError;
    const statusCode = axiosError.response?.status;
    const errorMessage = extractErrorMessage(axiosError);

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

    handleNetworkError();
    return {
      message: 'Network error',
      statusCode: 0,
    };
  }

  const message = customMessage || extractErrorMessage(error) || 'An unexpected error occurred';
  showError(message);

  return {
    message,
  };
};

export const handleApiErrorWithMessage = (
  error: any,
  message: string,
  dispatch?: AppDispatch
): void => {
  handleApiError(error, dispatch, message);
};

export const createErrorHandler = (dispatch: AppDispatch) => {
  return (error: any, customMessage?: string) => {
    return handleApiError(error, dispatch, customMessage);
  };
};

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

export const isErrorStatus = (error: any, statusCode: number): boolean => {
  return error?.response?.status === statusCode;
};

export const isUnauthorizedError = (error: any): boolean => {
  return isErrorStatus(error, 401);
};

export const isForbiddenError = (error: any): boolean => {
  return isErrorStatus(error, 403);
};

export const isNotFoundError = (error: any): boolean => {
  return isErrorStatus(error, 404);
};

export const isValidationError = (error: any): boolean => {
  return isErrorStatus(error, 422);
};

export const isServerError = (error: any): boolean => {
  const statusCode = error?.response?.status;
  return statusCode >= 500 && statusCode < 600;
};

export const isNetworkError = (error: any): boolean => {
  return error?.isAxiosError && !error?.response;
};

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

export const showRetryInfo = (attemptNumber: number, maxAttempts: number): void => {
  showInfo(`Retry attempt ${attemptNumber} of ${maxAttempts}...`);
};

export const errorHandler = {
  handle: handleApiError,
  handleWithMessage: handleApiErrorWithMessage,
  handleSilently: handleApiErrorSilently,
  createHandler: createErrorHandler,
  extractMessage: extractErrorMessage,
  getUserFriendlyMessage,
  showValidationErrors,
  showRetryInfo,
  isUnauthorized: isUnauthorizedError,
  isForbidden: isForbiddenError,
  isNotFound: isNotFoundError,
  isValidation: isValidationError,
  isServerError,
  isNetworkError,
};

export default errorHandler;