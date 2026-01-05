import axiosInstance from '../fetch';
import { Language } from '@/stores/useLanguage';
import {
  AddCategoryResponse,
  DeleteCategoryResponse,
  DeleteCommunityResponse,
  GetAllCommunitesAdminResponse,
  GetCategoryStatsResponse,
  GetCommunityMembersResponse,
  GetCommunityStatsResponse,
  UpdateCommunityCategoryResponse,
  UpdateCommunityPrivacyResponse,
} from '../generated';

export const getAllCommunitiesAdmin = async (lang: Language, params: URLSearchParams) => {
  try {
    const response = await axiosInstance.get<GetAllCommunitesAdminResponse>(
      `/admin/communities/all?${params.toString()}`,
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
      'Failed to fetch communities';
    throw new Error(errorMessage);
  }
};

export const getCommunityMembers = async (communityId: string, lang: Language) => {
  try {
    const response = await axiosInstance.get<GetCommunityMembersResponse>(
      `/admin/communities/${communityId}/members`,
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
      'Failed to fetch community members';
    throw new Error(errorMessage);
  }
};

export const removeCommunityMember = async (
  communityId: string,
  memberId: string,
  lang: Language,
) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/communities/${communityId}/members/${memberId}`,
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to remove member';
    throw new Error(errorMessage);
  }
};

export const deleteCommunity = async (communityId: string, lang: Language) => {
  try {
    const response = await axiosInstance.delete<DeleteCommunityResponse>(
      `/admin/communities/${communityId}`,
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
      'Failed to delete community';
    throw new Error(errorMessage);
  }
};

export const updateCommunityPrivacy = async (
  communityId: string,
  isPrivate: boolean,
  lang: Language,
) => {
  try {
    const response = await axiosInstance.patch<UpdateCommunityPrivacyResponse>(
      `/admin/communities/${communityId}/privacy`,
      { isPrivate },
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
      'Failed to update privacy';
    throw new Error(errorMessage);
  }
};

export const updateCommunityCategory = async (
  communityId: string,
  category: string,
  lang: Language,
) => {
  try {
    const response = await axiosInstance.patch<UpdateCommunityCategoryResponse>(
      `/admin/communities/${communityId}/category`,
      { category },
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
      'Failed to update category';
    throw new Error(errorMessage);
  }
};

/**
 * CATEGORY MANAGEMENT APIs
 * These APIs are used in the CategoryManagementModal component
 * for admin to manage global category options
 */

export const addCategory = async (categoryName: string, lang: Language) => {
  try {
    const response = await axiosInstance.post<AddCategoryResponse>(
      `/admin/communities/addCategory`,
      { name: categoryName },
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to add category';
    throw new Error(errorMessage);
  }
};

export const updateCategory = async (oldName: string, newName: string, lang: Language) => {
  try {
    const response = await axiosInstance.put(
      `/admin/categories/${encodeURIComponent(oldName)}`,
      { name: newName },
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
      'Failed to update category';
    throw new Error(errorMessage);
  }
};

export const deleteCategory = async (categoryName: string, lang: Language) => {
  try {
    const response = await axiosInstance.delete<DeleteCategoryResponse>(
      `/admin/categories/${encodeURIComponent(categoryName)}`,
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
      'Failed to delete category';
    throw new Error(errorMessage);
  }
};

export const getCategoryStats = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<GetCategoryStatsResponse>(`/admin/categories/stats`, {
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
      'Failed to fetch category stats';
    throw new Error(errorMessage);
  }
};

export const getCommunityStats = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<GetCommunityStatsResponse>(
      `/admin/communities/stats`,
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
      'Failed to fetch community stats';
    throw new Error(errorMessage);
  }
};
