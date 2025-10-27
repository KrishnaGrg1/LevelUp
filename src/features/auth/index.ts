/**
 * Authentication Feature Module
 *
 * Public API for the authentication feature.
 * Import from this file rather than individual modules.
 *
 * @module features/auth
 *
 * @example
 * ```typescript
 * import { useLogin, useAuthStore, selectUser } from '@/features/auth';
 *
 * const user = useAuthStore(selectUser);
 * const login = useLogin();
 * ```
 */

// API Layer
export * from './api';

// Store Layer
export * from './stores';
