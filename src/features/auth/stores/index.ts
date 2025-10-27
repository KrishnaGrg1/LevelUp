/**
 * Authentication Store Module
 *
 * Public API for the authentication store.
 * Import from this file rather than individual modules.
 *
 * @module features/auth/stores
 */

// Main store hook
export { useAuthStore, resetAuthStore, getAuthState, subscribeToAuth } from './authStore';

// Selectors
export * from './selectors';

// Types
export type { AuthStore, AuthState, AuthActions, AuthSelectors } from './types';
