/**
 * Authentication API Types
 *
 * Type definitions for authentication API requests and responses
 *
 * @module features/auth/api/types
 */

import type { User } from '@/lib/generated';

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

/**
 * Email verification data
 */
export interface VerifyEmailData {
  userId: string;
  otp: string;
}

/**
 * Password reset request
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Password reset with OTP
 */
export interface ResetPasswordData {
  userId: string;
  otp: string;
  newPassword: string;
}

/**
 * Change password data
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * OAuth registration data
 */
export interface OAuthData {
  provider: 'google' | 'github';
  code: string;
  redirectUri?: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User;
  token?: string;
  isadmin?: boolean;
}

/**
 * Generic message response
 */
export interface MessageResponse {
  message: string;
}

/**
 * User with session info
 */
export interface CurrentUserResponse {
  data: User;
}
