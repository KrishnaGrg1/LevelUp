/**
 * API Request/Response Interceptors
 *
 * Centralizes common logic for:
 * - Adding authentication tokens
 * - Setting language headers
 * - Error transformation
 * - Logging (in development)
 */

import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { ApiClientError, ApiErrorType } from './types';

/**
 * Request Interceptor
 * Adds common headers and authentication tokens to all requests
 */
export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // Add timestamp for request tracking in development
  if (process.env.NODE_ENV === 'development') {
    config.headers['X-Request-Time'] = new Date().toISOString();
  }

  // Set default language header if not already set
  if (!config.headers['X-Language']) {
    const savedLanguage = localStorage.getItem('language-storage');
    if (savedLanguage) {
      try {
        const { state } = JSON.parse(savedLanguage);
        config.headers['X-Language'] = state?.language || 'en';
      } catch {
        config.headers['X-Language'] = 'en';
      }
    } else {
      config.headers['X-Language'] = 'en';
    }
  }

  // Log request in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
    });
  }

  return config;
};

/**
 * Request Error Interceptor
 * Handles errors that occur before the request is sent
 */
export const requestErrorInterceptor = (error: AxiosError) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('[API Request Error]', error);
  }

  return Promise.reject(
    new ApiClientError(
      'Failed to send request',
      ApiErrorType.NETWORK_ERROR,
      undefined,
      undefined,
      error,
    ),
  );
};

/**
 * Response Interceptor
 * Transforms successful responses and adds logging
 */
export const responseInterceptor = (response: AxiosResponse) => {
  // Log response in development
  if (process.env.NODE_ENV === 'development') {
    const requestTime = response.config.headers['X-Request-Time'];
    const duration = requestTime
      ? Date.now() - new Date(requestTime as string).getTime()
      : 'unknown';

    console.log(
      `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`,
      {
        status: response.status,
        data: response.data,
      },
    );
  }

  return response;
};

/**
 * Response Error Interceptor
 * Transforms API errors into consistent ApiClientError instances
 */
export const responseErrorInterceptor = (error: AxiosError) => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[API Response Error]', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
  }

  // Network error (no response)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(
        new ApiClientError('Request timeout', ApiErrorType.TIMEOUT, undefined, undefined, error),
      );
    }

    return Promise.reject(
      new ApiClientError(
        'Network error. Please check your connection.',
        ApiErrorType.NETWORK_ERROR,
        undefined,
        undefined,
        error,
      ),
    );
  }

  const { status, data } = error.response;

  // Extract error message from response
  const errorData = data as {
    body?: { message?: string; error?: string; details?: Record<string, string[]> };
    message?: string;
  };
  const errorMessage = errorData?.body?.message || errorData?.message || 'An error occurred';
  const errorDetails = errorData?.body?.details;

  // Map HTTP status codes to error types
  let errorType: ApiErrorType;

  switch (status) {
    case 400:
      errorType = ApiErrorType.VALIDATION_ERROR;
      break;
    case 401:
      errorType = ApiErrorType.AUTHENTICATION_ERROR;
      break;
    case 403:
      errorType = ApiErrorType.AUTHORIZATION_ERROR;
      break;
    case 404:
      errorType = ApiErrorType.NOT_FOUND;
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      errorType = ApiErrorType.SERVER_ERROR;
      break;
    default:
      errorType = ApiErrorType.UNKNOWN;
  }

  return Promise.reject(new ApiClientError(errorMessage, errorType, status, errorDetails, error));
};
