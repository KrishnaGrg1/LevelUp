/**
 * Authentication API Module
 *
 * Public exports for authentication API layer
 *
 * @module features/auth/api
 */

// Services
export { authService } from './services';

// Mutation Hooks
export {
  useLogin,
  useRegister,
  useVerifyEmail,
  useForgotPassword,
  useResetPassword,
  useChangePassword,
  useOAuthRegister,
  useLogout,
} from './mutations';

// Types
export type {
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
