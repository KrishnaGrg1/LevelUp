/**
 * Authentication Store Types
 *
 * Type definitions for the authentication Zustand store
 *
 * @module features/auth/stores/types
 */

import type { User } from '@/lib/generated';

/**
 * Authentication state shape
 */
export interface AuthState {
  /** Current authenticated user */
  user: User | null;

  /** Whether the user is authenticated */
  isAuthenticated: boolean;

  /** Whether the user has admin privileges */
  isAdmin: boolean;

  /** Whether the store has been hydrated from localStorage */
  _hasHydrated: boolean;
}

/**
 * Authentication store actions
 */
export interface AuthActions {
  /** Set the authenticated user and update auth status */
  setUser: (user: User) => void;

  /** Update authentication status */
  setAuthenticated: (value: boolean) => void;

  /** Update admin status */
  setAdminStatus: (isAdmin: boolean) => void;

  /** Clear user session and reset auth state */
  logout: () => void;

  /** Internal: Set hydration status */
  setHasHydrated: (state: boolean) => void;
}

/**
 * Complete authentication store type
 */
export type AuthStore = AuthState & AuthActions;

/**
 * Auth store selectors for optimized rendering
 */
export interface AuthSelectors {
  /** Select only user */
  selectUser: (state: AuthStore) => User | null;

  /** Select only authentication status */
  selectIsAuthenticated: (state: AuthStore) => boolean;

  /** Select only admin status */
  selectIsAdmin: (state: AuthStore) => boolean;

  /** Select hydration status */
  selectHasHydrated: (state: AuthStore) => boolean;

  /** Select user ID */
  selectUserId: (state: AuthStore) => string | null;

  /** Select user email */
  selectUserEmail: (state: AuthStore) => string | null;

  /** Select user name */
  selectUserName: (state: AuthStore) => string | null;
}
