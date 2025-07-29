import { headers } from 'next/dist/server/request/headers';
import axiosInstance from '../fetch';
import type { UserRegisterResponse, UserRegisterInput, UserLoginInput, UserLoginResponse, Language } from '../generated';

export const login = async (email: string, password: string, lang: Language) => {
  try {
    const response = await axiosInstance.post<UserLoginResponse>(`/auth/login`, 
      { email, password },
      {
        headers: {
          'X-Language': lang, 
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.body?.message || 
                        error.response?.data?.message || 
                        'Login failed';
    throw new Error(errorMessage);
  }
};

export const registerUser = async (data: UserRegisterInput, lang: Language) => {
  try {
    const response = await axiosInstance.post<UserRegisterResponse>(`/auth/register`, 
      { data },
      {
        headers: {
          'X-Language': lang, 
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.body?.message || 
                        error.response?.data?.message || 
                        'Registration failed';
    throw new Error(errorMessage);
  }
};
