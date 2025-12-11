import axiosInstance from '../fetch';
import { Language } from '@/stores/useLanguage';

export const getAllCommunitiesAdmin = async (lang: Language, params: URLSearchParams) => {
  try {
    const response = await axiosInstance.get(`/admin/communities/all?${params.toString()}`, {
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
      'Failed to fetch communities';
    throw new Error(errorMessage);
  }
};

export const getCommunityMembers = async (communityId: string, lang: Language) => {
  try {
    console.log('Payload for the getCommunityMembers request:', { communityId, lang });
    const response = await axiosInstance.get(`/admin/communities/${communityId}/members`, {
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
      'Failed to fetch community members';
    throw new Error(errorMessage);
  }
};

// to do --- when admin is trying to delete --first transfer ownership to other
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
    const response = await axiosInstance.delete(`/admin/communities/${communityId}`, {
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
    const response = await axiosInstance.patch(
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
    const response = await axiosInstance.patch(
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
    const response = await axiosInstance.post(
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

/**
 * Update/rename an existing category
 * Used in: CategoryManagementModal - Edit button and inline edit form for categories
 * @param oldName - Current name of the category
 * @param newName - New name for the category
 * @param lang - Current language for localized responses
 * @returns Success response with updated category
 *
 * BACKEND LOGIC:
 * PUT /admin/categories/:oldName
 * Body: { name: "new_name" }
 *
 * Backend implementation:
 * - Find category by oldName
 * - Check if newName already exists
 * - Update category name
 * - Update all communities using this category (Community.category field)
 * - Return updated category
 */
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
    const response = await axiosInstance.delete(
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
    const response = await axiosInstance.get(`/admin/categories/stats`, {
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
    const response = await axiosInstance.get(`/admin/communities/stats`, {
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
      'Failed to fetch community stats';
    throw new Error(errorMessage);
  }
};
