import { OnboardingFormData } from '@/app/[lang]/(home)/user/dashboard/schema';
import axiosInstance from '../fetch';
import { handleServiceError, handleServiceErrorWithDetail } from '../utils/error-handler';
import type {
  UserRegisterResponse,
  UserRegisterInput,
  UserLoginInput,
  UserLoginResponse,
  UserVerifyInput,
  UserVerifyResponse,
  OAuthRequest,
  // LogoutRequest,
  LogoutResponse,
  OnboardingResponse,
} from '../generated';
import { Language } from '@/stores/useLanguage';

export const login = async (data: UserLoginInput, lang: Language) => {
  try {
    const response = await axiosInstance.post<UserLoginResponse>(`/auth/login`, data, {
      headers: {
        'X-Language': lang,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleServiceError(error, 'Login failed');
  }
};

export const registerUser = async (data: UserRegisterInput, lang: Language) => {
  try {
    const response = await axiosInstance.post<UserRegisterResponse>(`/auth/register`, data, {
      headers: {
        'X-Language': lang,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleServiceErrorWithDetail(error, 'Registration failed');
  }
};

export const VerifyUser = async (data: UserVerifyInput, lang: Language) => {
  try {
    const response = await axiosInstance.post<UserVerifyResponse>(`/auth/verify-email`, data, {
      headers: {
        'X-Language': lang,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleServiceError(error, 'Verification failed');
  }
};

export const requestPasswordReset = async (email: string, lang: Language) => {
  try {
    const response = await axiosInstance.post<{ message: string }>(
      `/auth/forget-password`,
      { email },
      {
        headers: {
          'X-Language': lang,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    handleServiceError(error, 'Failed to request password reset');
  }
};

export const resetPasswordWithOtp = async (
  data: { userId: string; otp: string; newPassword: string },
  lang: Language,
) => {
  try {
    const response = await axiosInstance.post<{ message: string }>(`/auth/reset-password`, data, {
      headers: {
        'X-Language': lang,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleServiceError(error, 'Failed to reset password');
  }
};

export const getCurrentUser = async (lang: Language) => {
  try {
    const response = await axiosInstance.get(`/auth/me`, {
      withCredentials: true,
      headers: {
        'X-Language': lang,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { status?: number } };
    if (err.response?.status === 401) {
      return null; // Not authenticated
    }
    throw error;
  }
};

export const oauthRegisterUser = async (data: OAuthRequest, lang: Language) => {
  try {
    const response = await axiosInstance.post<UserRegisterResponse>(`/auth/oauth/register`, data, {
      headers: {
        'X-Language': lang,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleServiceErrorWithDetail(error, 'Registration failed');
  }
};

export const logout = async (lang: Language) => {
  try {
    const response = await axiosInstance.post<LogoutResponse>(
      `/auth/logout`,
      {},
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    handleServiceErrorWithDetail(error, 'Logout failed');
  }
};

export const completeOnboarding = async (data: OnboardingFormData, lang: Language) => {
  try {
    const response = await axiosInstance.post<OnboardingResponse>(`/auth/onboarding`, data, {
      headers: {
        'X-Language': lang,
      },
    });
    return response.data;
  } catch (error: unknown) {
    handleServiceError(error, 'Onboarding failed');
  }
};
