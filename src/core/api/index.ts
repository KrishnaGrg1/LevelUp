/**
 * Core API Module
 *
 * Central export point for all API-related functionality.
 * Import from this file rather than individual modules.
 *
 * @example
 * ```typescript
 * import { api, ApiClientError, ApiErrorType } from '@/core/api';
 *
 * try {
 *   const response = await api.get<User>('/users/123');
 *   // Handle success
 * } catch (error) {
 *   if (error instanceof ApiClientError) {
 *     if (error.is(ApiErrorType.AUTHENTICATION_ERROR)) {
 *       // Handle auth error
 *     }
 *   }
 * }
 * ```
 */

// Main API client
export { api, apiClient, buildQueryParams } from './client';

// Types
export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  PaginationMetadata,
  QueryParams,
  RequestConfig,
  HttpMethod,
} from './types';

export { ApiClientError, ApiErrorType } from './types';

// Interceptors (for advanced usage)
export {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor,
} from './interceptors';
