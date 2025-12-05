import { Language } from '@/stores/useLanguage';
import axiosInstance from '../fetch';
import { GetCommunityMessagesResponse, Message, SendMessagePayload } from '../generated';

export const getCommunityMessages = async (
  lang: Language,
  communityId: string,
  page: number,
  limit = 10,
) => {
  try {
    const res = await axiosInstance.get<GetCommunityMessagesResponse>(
      `/community/${communityId}/messages?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
        },
      },
    );
    // Return the full data object with messages and pagination
    return res.data.body.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to fetch community messages';
    throw new Error(errorMessage);
  }
};

export const sendCommunityMessageAPI = async (
  lang: Language,
  communityId: string,
  payload: SendMessagePayload,
): Promise<Message> => {
  try {
    const response = await axiosInstance.post<{ data: Message }>(
      `/community/${communityId}/messages`,
      payload,
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
        },
      },
    );
    return response.data.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to send community message';
    throw new Error(errorMessage);
  }
};

// Clan Messages
export const getClanMessages = async (lang: Language, clanId: string, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get<GetCommunityMessagesResponse>(
      `/community/clan/${clanId}/messages?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
        },
      },
    );
    // Return the full data object with messages and pagination
    return response.data.body.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to fetch clan messages';
    throw new Error(errorMessage);
  }
};

export const sendClanMessageAPI = async (
  lang: Language,
  clanId: string,
  payload: SendMessagePayload,
): Promise<Message> => {
  try {
    const response = await axiosInstance.post<{ data: Message }>(
      `/community/conversation/clan/${clanId}`,
      payload,
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
        },
      },
    );
    return response.data.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to send clan message';
    throw new Error(errorMessage);
  }
};
