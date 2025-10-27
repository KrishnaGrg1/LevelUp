/**
 * Authentication API Services
 *
 * Raw API calls for authentication endpoints.
 * These functions return promises and should be wrapped in React Query hooks.
 *
 * @module features/auth/api/services
 */

import { api } from '@/core/api';
import type { ApiResponse } from '@/core/api';
import type { Language } from '@/shared/stores';

import type {
  LoginCredentials,
  RegisterData,
  VerifyEmailData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  OAuthData,
  AuthResponse,
  MessageResponse,
  CurrentUserResponse,
} from './types';

/**
 * Authentication API service
 */
export const authService = {
  /**
   * Log in user with credentials
   * @param credentials - Login credentials
   * @param lang - Language code
   * @returns Auth response with user data
   */
  login: async (
    credentials: LoginCredentials,
    lang: Language,
  ): Promise<ApiResponse<AuthResponse>> => {
    return api.post<AuthResponse, LoginCredentials>('/auth/login', credentials, {
      headers: { 'X-Language': lang },
    });
  },

  /**
   * Register a new user
   * @param data - Registration data
   * @param lang - Language code
   * @returns Auth response with user data
   */
  register: async (data: RegisterData, lang: Language): Promise<ApiResponse<AuthResponse>> => {
    return api.post<AuthResponse, RegisterData>('/auth/register', data, {
      headers: { 'X-Language': lang },
    });
  },

  /**
   * Verify user email with OTP
   * @param data - Verification data
   * @param lang - Language code
   * @returns Success message
   */
  verifyEmail: async (
    data: VerifyEmailData,
    lang: Language,
  ): Promise<ApiResponse<MessageResponse>> => {
    return api.post<MessageResponse, VerifyEmailData>('/auth/verify-email', data, {
      headers: { 'X-Language': lang },
    });
  },

  /**
   * Request password reset email
   * @param data - User email
   * @param lang - Language code
   * @returns Success message
   */
  forgotPassword: async (
    data: ForgotPasswordData,
    lang: Language,
  ): Promise<ApiResponse<MessageResponse>> => {
    return api.post<MessageResponse, ForgotPasswordData>('/auth/forget-password', data, {
      headers: { 'X-Language': lang },
    });
  },

  /**
   * Reset password with OTP
   * @param data - Reset password data
   * @param lang - Language code
   * @returns Success message
   */
  resetPassword: async (
    data: ResetPasswordData,
    lang: Language,
  ): Promise<ApiResponse<MessageResponse>> => {
    return api.post<MessageResponse, ResetPasswordData>('/auth/reset-password', data, {
      headers: { 'X-Language': lang },
    });
  },

  /**
   * Change user password
   * @param data - Change password data
   * @param lang - Language code
   * @returns Success message
   */
  changePassword: async (
    data: ChangePasswordData,
    lang: Language,
  ): Promise<ApiResponse<MessageResponse>> => {
    return api.post<MessageResponse, ChangePasswordData>('/auth/change-password', data, {
      headers: { 'X-Language': lang },
    });
  },

  /**
   * Get current authenticated user
   * @param lang - Language code
   * @returns Current user data or null if not authenticated
   */
  getCurrentUser: async (lang: Language): Promise<ApiResponse<CurrentUserResponse> | null> => {
    try {
      return await api.get<CurrentUserResponse>('/auth/me', {
        headers: { 'X-Language': lang },
      });
    } catch (error) {
      // Return null on 401 (not authenticated)
      // Other errors will be thrown
      return null;
    }
  },

  /**
   * OAuth registration
   * @param data - OAuth data
   * @param lang - Language code
   * @returns Auth response with user data
   */
  oauthRegister: async (data: OAuthData, lang: Language): Promise<ApiResponse<AuthResponse>> => {
    return api.post<AuthResponse, OAuthData>('/auth/oauth/register', data, {
      headers: { 'X-Language': lang },
    });
  },

  /**
   * Log out current user
   * @param lang - Language code
   * @returns Success message
   */
  logout: async (lang: Language): Promise<ApiResponse<MessageResponse>> => {
    return api.post<MessageResponse>('/auth/logout', undefined, {
      headers: { 'X-Language': lang },
    });
  },
};
