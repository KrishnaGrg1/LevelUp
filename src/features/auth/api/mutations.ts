/**
 * Authentication Mutation Hooks
 *
 * TanStack Query mutation hooks for authentication operations.
 * These hooks handle optimistic updates, cache invalidation, and error handling.
 *
 * @module features/auth/api/mutations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { queryKeys, mutationKeys } from '@/core/config/query-client';
import { useLanguageStore, toastActions, type Language } from '@/shared/stores';

import { useAuthStore } from '../stores';
import { authService } from './services';
import type {
  LoginCredentials,
  RegisterData,
  VerifyEmailData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  OAuthData,
} from './types';

/**
 * Login mutation hook
 *
 * @example
 * ```typescript
 * const login = useLogin();
 *
 * const handleLogin = async () => {
 *   try {
 *     await login.mutateAsync({ email, password });
 *   } catch (error) {
 *     // Error handled by mutation
 *   }
 * };
 * ```
 */
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const language = useLanguageStore(state => state.language) as Language;
  const { setUser, setAdminStatus } = useAuthStore();

  return useMutation({
    mutationKey: mutationKeys.auth.login,
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials, language),

    onSuccess: response => {
      const authData = response.body.data;

      if (authData?.user) {
        const isAdmin = authData.isadmin || authData.user.isAdmin || false;

        // Update auth store with the user object
        setUser(authData.user);
        setAdminStatus(isAdmin);

        // Invalidate current user query
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() });

        // Show success message
        toastActions.success(response.body.message || 'Login successful!');

        // Redirect based on role
        const redirectPath = isAdmin
          ? `/${language}/admin/dashboard`
          : `/${language}/user/dashboard`;
        router.push(redirectPath);
      }
    },

    onError: (error: Error) => {
      toastActions.error(error.message || 'Login failed');
    },
  });
};

/**
 * Register mutation hook
 */
export const useRegister = () => {
  const router = useRouter();
  const language = useLanguageStore(state => state.language) as Language;

  return useMutation({
    mutationKey: mutationKeys.auth.register,
    mutationFn: (data: RegisterData) => authService.register(data, language),

    onSuccess: response => {
      toastActions.success(
        response.body.message || 'Registration successful! Please verify your email.',
      );
      router.push(`/${language}/verify-email`);
    },

    onError: (error: unknown) => {
      const err = error as { message?: string; error?: string };
      toastActions.error(err.message || 'Registration failed');
    },
  });
};

/**
 * Email verification mutation hook
 */
export const useVerifyEmail = () => {
  const router = useRouter();
  const language = useLanguageStore(state => state.language) as Language;

  return useMutation({
    mutationKey: mutationKeys.auth.verify,
    mutationFn: (data: VerifyEmailData) => authService.verifyEmail(data, language),

    onSuccess: response => {
      toastActions.success(response.body.message || 'Email verified successfully!');
      router.push(`/${language}/login`);
    },

    onError: (error: Error) => {
      toastActions.error(error.message || 'Verification failed');
    },
  });
};

/**
 * Forgot password mutation hook
 */
export const useForgotPassword = () => {
  const language = useLanguageStore(state => state.language) as Language;

  return useMutation({
    mutationFn: (data: ForgotPasswordData) => authService.forgotPassword(data, language),

    onSuccess: response => {
      toastActions.success(response.body.message || 'Password reset email sent!');
    },

    onError: (error: Error) => {
      toastActions.error(error.message || 'Failed to send reset email');
    },
  });
};

/**
 * Reset password mutation hook
 */
export const useResetPassword = () => {
  const router = useRouter();
  const language = useLanguageStore(state => state.language) as Language;

  return useMutation({
    mutationKey: mutationKeys.auth.resetPassword,
    mutationFn: (data: ResetPasswordData) => authService.resetPassword(data, language),

    onSuccess: response => {
      toastActions.success(response.body.message || 'Password reset successfully!');
      router.push(`/${language}/login`);
    },

    onError: (error: Error) => {
      toastActions.error(error.message || 'Failed to reset password');
    },
  });
};

/**
 * Change password mutation hook
 */
export const useChangePassword = () => {
  const language = useLanguageStore(state => state.language) as Language;

  return useMutation({
    mutationFn: (data: ChangePasswordData) => authService.changePassword(data, language),

    onSuccess: response => {
      toastActions.success(response.body.message || 'Password changed successfully!');
    },

    onError: (error: unknown) => {
      const err = error as { message?: string };
      toastActions.error(err.message || 'Failed to change password');
    },
  });
};

/**
 * OAuth registration mutation hook
 */
export const useOAuthRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const language = useLanguageStore(state => state.language) as Language;
  const { setUser, setAdminStatus } = useAuthStore();

  return useMutation({
    mutationFn: (data: OAuthData) => authService.oauthRegister(data, language),

    onSuccess: response => {
      const authData = response.body.data;

      if (authData?.user) {
        const isAdmin = authData.isadmin || authData.user.isAdmin || false;

        setUser(authData.user);
        setAdminStatus(isAdmin);

        queryClient.invalidateQueries({ queryKey: queryKeys.auth.currentUser() });
        toastActions.success('Successfully logged in!');

        const redirectPath = isAdmin
          ? `/${language}/admin/dashboard`
          : `/${language}/user/dashboard`;
        router.push(redirectPath);
      }
    },

    onError: (error: unknown) => {
      const err = error as { message?: string };
      toastActions.error(err.message || 'OAuth login failed');
    },
  });
};

/**
 * Logout mutation hook
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const language = useLanguageStore(state => state.language) as Language;
  const { logout: logoutStore } = useAuthStore();

  return useMutation({
    mutationKey: mutationKeys.auth.logout,
    mutationFn: () => authService.logout(language),

    onSuccess: () => {
      // Clear auth store
      logoutStore();

      // Clear all queries
      queryClient.clear();

      // Show success message
      toastActions.success('Logged out successfully');

      // Redirect to login
      router.push(`/${language}/login`);
    },

    onError: (error: unknown) => {
      const err = error as { message?: string };

      // Still logout locally even if server request fails
      logoutStore();
      queryClient.clear();
      router.push(`/${language}/login`);

      toastActions.error(err.message || 'Logout encountered an error');
    },
  });
};
