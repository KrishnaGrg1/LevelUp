import axiosInstance from '../fetch';
import { Language } from '@/stores/useLanguage';
import {
  communityDetailByIdResponse,
  CreateCommunityResponse,
  getCategoriesResponse,
  GetMyCommunities,
  searchCommunitiesResponse,
  TogglePinResponse,
} from '../generated';

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

// Get all communities
export const getAllCommunities = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<GetMyCommunities>(`/community`, {
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
      'Get All Communities failed';
    throw new Error(errorMessage);
  }
};

// Create new community
export const togglePin = async (lang: Language, communityIds: string[]) => {
  try {
    const response = await axiosInstance.post<TogglePinResponse>(
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
    const response = await axiosInstance.post<CreateCommunityResponse>(
      `/community/create`,
      formData,
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
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

// Search  communities
export const searchCommunities = async (lang: Language, query: string) => {
  try {
    const response = await axiosInstance.get<searchCommunitiesResponse>(`/community/search`, {
      params: { q: query },
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
      'Failed to search community';
    throw new Error(errorMessage);
  }
};

// Join a community
export const joinCommunity = async (lang: Language, communityId: string) => {
  try {
    const response = await axiosInstance.post<{ success: boolean; message: string }>(
      `/community/${communityId}/join`,
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to join community';
    throw new Error(errorMessage);
  }
};

// Join a community
export const joinPrivateCommunity = async (lang: Language, joinCode: string) => {
  try {
    const response = await axiosInstance.post<{ success: boolean; message: string }>(
      `/community/join`,
      { joinCode },
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to join community';
    throw new Error(errorMessage);
  }
};

// Specific   Community Detail
export const communityDetailById = async (lang: Language, communityId: string) => {
  try {
    const response = await axiosInstance.get<communityDetailByIdResponse>(
      `/community/${communityId}`,
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to search community';
    throw new Error(errorMessage);
  }
};

// Get Categories for communities

export const getCategories = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<getCategoriesResponse>(`/auth/categories`, {
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
      'Failed to get categories';
    throw new Error(errorMessage);
  }
};
