/**
 * TanStack Query Configuration
 *
 * Centralized configuration for React Query including:
 * - Default query options
 * - Cache configuration
 * - Retry logic
 * - Error handling
 * - Development tools
 *
 * @module core/config/query-client
 */

import { QueryClient, type DefaultOptions, type QueryClientConfig } from '@tanstack/react-query';

import { ApiClientError, ApiErrorType } from '../api/types';

/**
 * Default query options applied to all queries
 */
const queryConfig: DefaultOptions = {
  queries: {
    // Refetch configuration
    refetchOnWindowFocus: false, // Don't refetch on window focus in production
    refetchOnReconnect: true, // Refetch when reconnecting
    refetchOnMount: true, // Refetch when component mounts

    // Stale time: Data considered fresh for 5 minutes
    staleTime: 5 * 60 * 1000, // 5 minutes

    // Cache time: Inactive data kept in cache for 10 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

    // Retry configuration
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof ApiClientError) {
        if (
          error.is(ApiErrorType.AUTHENTICATION_ERROR) ||
          error.is(ApiErrorType.AUTHORIZATION_ERROR) ||
          error.is(ApiErrorType.VALIDATION_ERROR)
        ) {
          return false;
        }
      }

      // Retry up to 2 times for other errors
      return failureCount < 2;
    },

    // Exponential backoff: 1s, 2s, 4s
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  },

  mutations: {
    // Retry configuration for mutations
    retry: (failureCount, error) => {
      // Don't retry mutations on client errors
      if (error instanceof ApiClientError) {
        if (
          error.is(ApiErrorType.AUTHENTICATION_ERROR) ||
          error.is(ApiErrorType.AUTHORIZATION_ERROR) ||
          error.is(ApiErrorType.VALIDATION_ERROR)
        ) {
          return false;
        }
      }

      // Only retry network errors once
      return failureCount < 1;
    },

    retryDelay: 1000, // 1 second delay for mutation retries
  },
};

/**
 * Query client configuration
 */
const config: QueryClientConfig = {
  defaultOptions: queryConfig,
};

/**
 * Create a new QueryClient instance
 * Used for SSR to create a new client per request
 *
 * @returns New QueryClient instance
 */
export const createQueryClient = (): QueryClient => {
  return new QueryClient(config);
};

/**
 * Browser-side QueryClient singleton
 * Reused across the application lifecycle
 */
let browserQueryClient: QueryClient | undefined;

/**
 * Get or create the QueryClient
 * - Server: Always creates a new client
 * - Browser: Reuses existing client or creates new one
 *
 * @returns QueryClient instance
 */
export const getQueryClient = (): QueryClient => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // Always create a new query client on the server
    return createQueryClient();
  }

  // Create a new client if one doesn't exist in the browser
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
};

/**
 * Query key factory helpers
 * Provides consistent query key generation across the app
 *
 * @example
 * ```typescript
 * // User queries
 * queryKeys.users.all
 * queryKeys.users.detail(userId)
 * queryKeys.users.list(filters)
 * ```
 */
export const queryKeys = {
  // Authentication
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'current-user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Communities
  communities: {
    all: ['communities'] as const,
    lists: () => [...queryKeys.communities.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.communities.lists(), filters] as const,
    details: () => [...queryKeys.communities.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.communities.details(), id] as const,
  },

  // Quests
  quests: {
    all: ['quests'] as const,
    lists: () => [...queryKeys.quests.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.quests.lists(), filters] as const,
    details: () => [...queryKeys.quests.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.quests.details(), id] as const,
  },
} as const;

/**
 * Mutation key factory
 * For tracking mutation states
 */
export const mutationKeys = {
  auth: {
    login: ['auth', 'login'] as const,
    logout: ['auth', 'logout'] as const,
    register: ['auth', 'register'] as const,
    verify: ['auth', 'verify'] as const,
    resetPassword: ['auth', 'reset-password'] as const,
  },

  users: {
    create: ['users', 'create'] as const,
    update: (id: string) => ['users', 'update', id] as const,
    delete: (id: string) => ['users', 'delete', id] as const,
  },
} as const;
