/**
 * Authentication Store Selectors
 *
 * Optimized selectors for accessing authentication state.
 * Using selectors prevents unnecessary re-renders.
 *
 * @module features/auth/stores/selectors
 */

import type { AuthStore } from './types';

/**
 * Select the current user
 * @param state - Auth store state
 * @returns Current user or null
 */
export const selectUser = (state: AuthStore) => state.user;

/**
 * Select authentication status
 * @param state - Auth store state
 * @returns Whether user is authenticated
 */
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;

/**
 * Select admin status
 * @param state - Auth store state
 * @returns Whether user is an admin
 */
export const selectIsAdmin = (state: AuthStore) => state.isAdmin;

/**
 * Select hydration status
 * @param state - Auth store state
 * @returns Whether store has been hydrated
 */
export const selectHasHydrated = (state: AuthStore) => state._hasHydrated;

/**
 * Select user ID
 * @param state - Auth store state
 * @returns User ID or null
 */
export const selectUserId = (state: AuthStore) => state.user?.id ?? null;

/**
 * Select user email
 * @param state - Auth store state
 * @returns User email or null
 */
export const selectUserEmail = (state: AuthStore) => state.user?.email ?? null;

/**
 * Select user name
 * @param state - Auth store state
 * @returns User name or null
 */
export const selectUserName = (state: AuthStore) => state.user?.UserName ?? null;

/**
 * Select user level
 * @param state - Auth store state
 * @returns User level or 0
 */
export const selectUserLevel = (state: AuthStore) => state.user?.level ?? 0;

/**
 * Select user XP
 * @param state - Auth store state
 * @returns User XP or 0
 */
export const selectUserXP = (state: AuthStore) => state.user?.xp ?? 0;

/**
 * Check if user is verified
 * @param state - Auth store state
 * @returns Whether user is verified
 */
export const selectIsVerified = (state: AuthStore) => state.user?.isVerified ?? false;

/**
 * Select only actions (useful for avoiding re-renders)
 * @param state - Auth store state
 * @returns Auth actions
 */
export const selectAuthActions = (state: AuthStore) => ({
  setUser: state.setUser,
  setAuthenticated: state.setAuthenticated,
  setAdminStatus: state.setAdminStatus,
  logout: state.logout,
  setHasHydrated: state.setHasHydrated,
});
