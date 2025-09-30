import lang from '@/translations/lang';
import axiosInstance from '../fetch';
import type {
    GetAllUsersResponse,
 GetMeResponse
} from '../generated';
import { Language } from '@/stores/useLanguage';

export const getMe = async ( lang: Language) => {
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


export const getAllUsers=async(lang:Language,pramas:URLSearchParams)=>{
    try{
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
}