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

export const updateCommunity = async (
  lang: Language,
  communityId: string,
  data: {
    name?: string;
    description?: string;
    memberLimit?: number;
    isPrivate?: boolean;
  },
) => {
  try {
    const response = await axiosInstance.patch(`/community/${communityId}`, data, {
      withCredentials: true,
      headers: {
        'X-Language': lang,
        'Content-Type': 'application/json',
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
      'Failed to update community';
    throw new Error(errorMessage);
  }
};

export const uploadCommunityPhoto = async (
  lang: Language,
  communityId: string,
  formData: FormData,
) => {
  try {
    const response = await axiosInstance.post(`/community/${communityId}/upload-photo`, formData, {
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to upload photo';
    throw new Error(errorMessage);
  }
};

export const transferOwnership = async (
  lang: Language,
  communityId: string,
  data: {
    newOwnerId: string;
  },
) => {
  try {
    const response = await axiosInstance.post(
      `/community/${communityId}/transfer-ownership`,
      data,
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
          'Content-Type': 'application/json',
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
      'Failed to transfer ownership';
    throw new Error(errorMessage);
  }
};

export const removeCommunityMember = async (
  lang: Language,
  communityId: string,
  memberId: string,
) => {
  try {
    const response = await axiosInstance.delete(`/community/${communityId}/members/${memberId}`, {
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to remove member';
    throw new Error(errorMessage);
  }
};

export const changeMemberRole = async (
  lang: Language,
  communityId: string,
  memberId: string,
  role: 'ADMIN' | 'MEMBER',
) => {
  try {
    const response = await axiosInstance.patch(
      `/community/${communityId}/members/${memberId}/role`,
      { role },
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
          'Content-Type': 'application/json',
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
      'Failed to change member role';
    throw new Error(errorMessage);
  }
};

export const getCommunityMembers = async (lang: Language, communityId: string) => {
  try {
    // Use admin endpoint for fetching members (accessible to owner/admin)
    const response = await axiosInstance.get(`/community/${communityId}/members`, {
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to get members';
    throw new Error(errorMessage);
  }
};
