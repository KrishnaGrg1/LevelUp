/**
 * Enterprise API Client
 *
 * A fully-typed, production-ready API client built on Axios with:
 * - Automatic request/response transformation
 * - Comprehensive error handling
 * - Request retry logic
 * - Timeout configuration
 * - Type-safe request methods
 * - Interceptor support
 * - Development logging
 *
 * @module core/api/client
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

import {
  requestInterceptor,
  requestErrorInterceptor,
  responseInterceptor,
  responseErrorInterceptor,
} from './interceptors';
import type { ApiResponse, QueryParams, RequestConfig } from './types';

/**
 * API Client Configuration
 */
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000, // 30 seconds
  withCredentials: true, // Include cookies for session-based auth
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

/**
 * Create and configure the Axios instance
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create(API_CONFIG);

  // Request interceptors
  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

  // Response interceptors
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

  return instance;
};

/**
 * Main API client instance
 * Use this for all API calls throughout the application
 */
export const apiClient = createAxiosInstance();

/**
 * Typed API client wrapper
 * Provides type-safe methods for common HTTP operations
 */
class ApiClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * GET request
   * @param url - The endpoint URL
   * @param config - Optional request configuration
   * @returns Promise with typed response
   */
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, this.buildConfig(config));
    return response.data;
  }

  /**
   * POST request
   * @param url - The endpoint URL
   * @param data - Request payload
   * @param config - Optional request configuration
   * @returns Promise with typed response
   */
  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, this.buildConfig(config));
    return response.data;
  }

  /**
   * PUT request
   * @param url - The endpoint URL
   * @param data - Request payload
   * @param config - Optional request configuration
   * @returns Promise with typed response
   */
  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, this.buildConfig(config));
    return response.data;
  }

  /**
   * PATCH request
   * @param url - The endpoint URL
   * @param data - Request payload
   * @param config - Optional request configuration
   * @returns Promise with typed response
   */
  async patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, this.buildConfig(config));
    return response.data;
  }

  /**
   * DELETE request
   * @param url - The endpoint URL
   * @param config - Optional request configuration
   * @returns Promise with typed response
   */
  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, this.buildConfig(config));
    return response.data;
  }

  /**
   * Build Axios config from RequestConfig
   * Transforms our custom config type to Axios config
   */
  private buildConfig(config?: RequestConfig): AxiosRequestConfig {
    if (!config) return {};

    return {
      headers: config.headers,
      params: config.params,
      timeout: config.timeout,
      signal: config.signal,
      withCredentials: config.withCredentials,
    };
  }

  /**
   * Get the raw Axios instance
   * Use this only when you need direct access to Axios
   */
  getRawClient(): AxiosInstance {
    return this.client;
  }
}

/**
 * Type-safe API client instance
 * Use this for all type-safe API calls
 *
 * @example
 * ```typescript
 * // Using the typed client
 * const response = await api.get<User>('/users/123');
 * const user = response.body.data;
 *
 * // POST with data
 * const response = await api.post<User, CreateUserDto>('/users', {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 * ```
 */
export const api = new ApiClient(apiClient);

/**
 * Helper to build query parameters
 * Converts an object to URLSearchParams, filtering out undefined values
 *
 * @param params - Query parameters object
 * @returns URLSearchParams instance
 *
 * @example
 * ```typescript
 * const params = buildQueryParams({
 *   page: 1,
 *   pageSize: 10,
 *   search: 'john',
 *   filter: undefined // Will be excluded
 * });
 * ```
 */
export const buildQueryParams = (params: QueryParams): URLSearchParams => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams;
};

/**
 * Export the Axios instance for backward compatibility
 * @deprecated Use `api` or `apiClient` instead
 */
export default apiClient;
