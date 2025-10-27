/**
 * Authentication Store
 *
 * Enterprise-grade Zustand store for authentication state management.
 *
 * Features:
 * - Type-safe state and actions
 * - LocalStorage persistence
 * - Hydration tracking
 * - Devtools integration (development only)
 * - Optimized selectors
 *
 * @module features/auth/stores/authStore
 */

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

import type { User } from '@/lib/generated';

import type { AuthStore } from './types';

/**
 * Initial state for the auth store
 */
const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  _hasHydrated: false,
};

/**
 * Create the authentication store
 *
 * @example
 * ```typescript
 * // Using the store
 * const { user, isAuthenticated, setUser, logout } = useAuthStore();
 *
 * // Using selectors (better performance)
 * const user = useAuthStore(selectUser);
 * const isAuthenticated = useAuthStore(selectIsAuthenticated);
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      set => ({
        // State
        ...initialState,

        // Actions
        setUser: (user: User) => {
          set(
            {
              user,
              isAuthenticated: true,
              isAdmin: user.isAdmin === true,
            },
            false,
            'auth/setUser',
          );
        },

        setAuthenticated: (value: boolean) => {
          set({ isAuthenticated: value }, false, 'auth/setAuthenticated');
        },

        setAdminStatus: (isAdmin: boolean) => {
          set({ isAdmin }, false, 'auth/setAdminStatus');
        },

        logout: () => {
          set(initialState, false, 'auth/logout');
        },

        setHasHydrated: (state: boolean) => {
          set({ _hasHydrated: state }, false, 'auth/setHasHydrated');
        },
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),

        // Only persist specific fields
        partialize: state => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          isAdmin: state.isAdmin,
        }),

        // Handle rehydration
        onRehydrateStorage: () => state => {
          state?.setHasHydrated(true);
        },
      },
    ),
    {
      name: 'AuthStore',
      enabled: process.env.NODE_ENV === 'development',
    },
  ),
);

/**
 * Reset the auth store to initial state
 * Useful for testing or hard resets
 */
export const resetAuthStore = () => {
  useAuthStore.setState(initialState);
};

/**
 * Get auth store state without subscribing to updates
 * Useful for one-time reads or in non-React contexts
 */
export const getAuthState = () => useAuthStore.getState();

/**
 * Subscribe to auth store changes
 * @param listener - Callback function called on state changes
 * @returns Unsubscribe function
 */
export const subscribeToAuth = (listener: (state: AuthStore, prevState: AuthStore) => void) => {
  return useAuthStore.subscribe(listener);
};
