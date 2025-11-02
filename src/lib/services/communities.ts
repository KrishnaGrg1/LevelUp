import axiosInstance from '../fetch';
import { Language } from '@/stores/useLanguage';
import { GetMyCommunities } from '../generated';

// Get user's communities
export const getMyCommunities = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<GetMyCommunities>(`/community/my`, {
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
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Get My Communities failed';
    throw new Error(errorMessage);
  }
};

// Create new community
export const togglePin = async (lang: Language, communityIds: string[]) => {
  try {
    const response = await axiosInstance.post(
      `/community/toggle-pin`,
      { communityIds },
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Id are', communityIds);
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'To Community failed';
    throw new Error(errorMessage);
  }
};
// Create new community
export const createCommunity = async (lang: Language, formData: FormData) => {
  try {
    const response = await axiosInstance.post<{
      statusCode: number;
      body: {
        message: string;
        data: any;
      };
    }>(`/community/create`, formData, {
      withCredentials: true,
      headers: {
        'X-Language': lang,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Create Community failed';
    throw new Error(errorMessage);
  }
};
