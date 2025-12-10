import { OnboardingFormData } from '@/app/[lang]/(home)/user/dashboard/schema';
import axiosInstance from '../fetch';
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
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Login failed';
    throw new Error(errorMessage);
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
    const err = error as {
      response?: {
        data?: { body?: { message?: string; error?: string }; message?: string; error?: string };
      };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Registration failed';
    const errorDetail = err.response?.data?.body?.error || err.response?.data?.error;

    throw { message: errorMessage, error: errorDetail };
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
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Verification failed';
    throw new Error(errorMessage);
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
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to request password reset';
    throw new Error(errorMessage);
  }
};

// Verify OTP for password reset and set new password
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
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to reset password';
    throw new Error(errorMessage);
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
    const err = error as {
      response?: {
        data?: { body?: { message?: string; error?: string }; message?: string; error?: string };
      };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Registration failed';
    const errorDetail = err.response?.data?.body?.error || err.response?.data?.error;

    throw { message: errorMessage, error: errorDetail };
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
    const err = error as {
      response?: {
        data?: { body?: { message?: string; error?: string }; message?: string; error?: string };
      };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Logout failed';
    const errorDetail = err.response?.data?.body?.error || err.response?.data?.error;

    throw { message: errorMessage, error: errorDetail };
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
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Onboarding failed';
    throw new Error(errorMessage);
  }
};
