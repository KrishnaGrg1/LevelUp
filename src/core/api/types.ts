/**
 * Core API Types
 *
 * Defines the standard structure for API requests and responses
 * across the application. All API interactions should conform to these types.
 */

/**
 * Standard API response wrapper
 * All API responses from the backend follow this structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  body: {
    data?: T;
    message?: string;
    error?: string;
  };
  status?: number;
}

/**
 * Pagination metadata returned from list endpoints
 */
export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  body: {
    data: T[];
    pagination: PaginationMetadata;
    message?: string;
  };
}

/**
 * API error response structure
 */
export interface ApiError {
  success: false;
  body: {
    message: string;
    error?: string;
    statusCode?: number;
    details?: Record<string, string[]>; // Validation errors
  };
}

/**
 * Query parameters for list/search endpoints
 */
export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined;
}

/**
 * Request configuration options
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: QueryParams;
  timeout?: number;
  signal?: AbortSignal;
  withCredentials?: boolean;
}

/**
 * HTTP methods supported
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API client error types for better error handling
 */
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Structured error class for API errors
 */
export class ApiClientError extends Error {
  public readonly type: ApiErrorType;
  public readonly statusCode?: number;
  public readonly details?: Record<string, string[]>;
  public readonly originalError?: unknown;

  constructor(
    message: string,
    type: ApiErrorType = ApiErrorType.UNKNOWN,
    statusCode?: number,
    details?: Record<string, string[]>,
    originalError?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiClientError);
    }
  }

  /**
   * Check if error is a specific type
   */
  is(type: ApiErrorType): boolean {
    return this.type === type;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    switch (this.type) {
      case ApiErrorType.NETWORK_ERROR:
        return 'Unable to connect. Please check your internet connection.';
      case ApiErrorType.AUTHENTICATION_ERROR:
        return 'Please log in to continue.';
      case ApiErrorType.AUTHORIZATION_ERROR:
        return 'You do not have permission to perform this action.';
      case ApiErrorType.NOT_FOUND:
        return 'The requested resource was not found.';
      case ApiErrorType.SERVER_ERROR:
        return 'A server error occurred. Please try again later.';
      case ApiErrorType.TIMEOUT:
        return 'Request timed out. Please try again.';
      case ApiErrorType.VALIDATION_ERROR:
        return this.message || 'Please check your input and try again.';
      default:
        return this.message || 'An unexpected error occurred.';
    }
  }
}
