import axiosInstance from '../fetch';
import type {
  GetAllUsersResponse,
  GetMeResponse,
  adminOverviewResponse,
  changePasswordResponse,
} from '../generated';
import { Language } from '@/stores/useLanguage';

export const getMe = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<GetMeResponse>(`/auth/me`, {
      withCredentials: true,
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

export const getAllUsers = async (lang: Language, pramas: URLSearchParams) => {
  try {
    const response = await axiosInstance.get<GetAllUsersResponse>(`/admin/users/all`, {
      withCredentials: true,
      headers: {
        'X-Language': lang,
      },
      params: pramas,
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

export const changePassword = async (
  data: { currentPassword: string; newPassword: string; confirmNewPassword: string },
  lang: Language,
) => {
  try {
    const response = await axiosInstance.post<changePasswordResponse>(
      `/auth/change-password`,
      data,
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Change password failed';
    const errorDetail = err.response?.data?.body?.error || err.response?.data?.error;

    throw { message: errorMessage, error: errorDetail };
  }
};

export const deleteUserByAdmin = async (id: string, lang: Language) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/delete`, {
      withCredentials: true,
      headers: {
        'X-Language': lang,
      },
      data: { id },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: { body?: { message?: string; error?: string }; message?: string; error?: string };
      };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Delete user failed';
    const errorDetail = err.response?.data?.body?.error || err.response?.data?.error;

    throw { message: errorMessage, error: errorDetail };
  }
};

export const adminOverview = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<adminOverviewResponse>(`/admin/overview`, {
      withCredentials: true,
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Admin Overview failed';
    throw new Error(errorMessage);
  }
};
