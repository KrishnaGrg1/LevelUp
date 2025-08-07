import axiosInstance from "../fetch";
import type {
  UserRegisterResponse,
  UserRegisterInput,
  UserLoginInput,
  UserLoginResponse,
  VerifyOtpInput,
} from "../generated";
import { Language } from "@/stores/useLanguage";

export const login = async (data: UserLoginInput, lang: Language) => {
  try {
    const response = await axiosInstance.post<UserLoginResponse>(
      `/auth/login`,
      data,
      {
        headers: {
          "X-Language": lang,
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
      "Login failed";
    throw new Error(errorMessage);
  }
};

export const registerUser = async (data: UserRegisterInput, lang: Language) => {
  try {
    const response = await axiosInstance.post<UserRegisterResponse>(
      `/auth/register`,
      { data },
      {
        headers: {
          "X-Language": lang,
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
      "Registration failed";
    throw new Error(errorMessage);
  }
};

export const VerifyUser = async (data: VerifyOtpInput, lang: Language) => {
  try {
    const response = await axiosInstance.post<UserLoginResponse>(
      `/auth/verify`,
      { data },
      {
        headers: {
          "X-Language": lang,
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
      "Verification failed";
    throw new Error(errorMessage);
  }
};
