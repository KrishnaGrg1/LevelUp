import axiosInstance from '../fetch';
import { Language } from '@/stores/useLanguage';

export interface ClanOwner {
  id: string;
  UserName: string;
  email: string;
  profilePicture: string | null;
  xp: number;
  level: number;
  isVerified: boolean;
  isAdmin: boolean;
}

export interface ClanStats {
  battlesWon?: number;
  memberCount?: number;
}

export interface Clan {
  id: string;
  name: string;
  slug: string | null;
  isPrivate: boolean;
  xp: number;
  description: string | null;
  ownerId: string;
  communityId: string;
  limit: number;
  welcomeMessage: string | null;
  stats: ClanStats | null;
  createdAt: string;
  updatedAt: string;
  owner: ClanOwner;
  isMember?: boolean;
}

export interface ClanMember {
  id: string;
  userId: string;
  communityId: string;
  clanId: string | null;
  role: string;
  user: {
    id: string;
    UserName: string;
    email: string;
    profilePicture: string | null;
    xp: number;
    level: number;
    isVerified: boolean;
  };
}

export interface ClanInfoResponse extends Clan {
  community: {
    id: string;
    name: string;
  };
  members: ClanMember[];
}

export interface GetClansResponse {
  statusCode: number;
  body: {
    message: string;
    data: Clan[];
  };
}

export interface GetClanInfoResponse {
  statusCode: number;
  body: {
    message: string;
    data: ClanInfoResponse;
  };
}

export interface GetClanMembersResponse {
  statusCode: number;
  body: {
    message: string;
    data: ClanMember[];
  };
}

export interface CreateClanPayload {
  name: string;
  communityId: string;
  description?: string;
  isPrivate?: boolean;
  limit?: number;
}

export interface UpdateClanPayload {
  name?: string;
  description?: string;
  isPrivate?: boolean;
  limit?: number;
}

export const getClansByCommunity = async (communityId: string, lang: Language) => {
  try {
    const response = await axiosInstance.get<GetClansResponse>(`/clan/${communityId}`, {
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to fetch clans';
    throw new Error(errorMessage);
  }
};

export const createClan = async (payload: CreateClanPayload, lang: Language) => {
  try {
    const response = await axiosInstance.post<{
      statusCode: number;
      body: { message: string; data: Clan };
    }>('/clan/create', payload, {
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to create clan';
    throw new Error(errorMessage);
  }
};

export const joinClan = async (lang: Language, clanId: string) => {
  try {
    const response = await axiosInstance.post(
      '/clan/join',
      { clanId },
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to join clan';
    throw new Error(errorMessage);
  }
};

export const leaveClan = async (clanId: string, lang: Language) => {
  try {
    const response = await axiosInstance.post(
      '/clan/leave',
      { clanId },
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to leave clan';
    throw new Error(errorMessage);
  }
};

export const deleteClan = async (clanId: string, lang: Language) => {
  try {
    const response = await axiosInstance.delete(`/clan/${clanId}`, {
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to delete clan';
    throw new Error(errorMessage);
  }
};

export const getClanMembers = async (clanId: string, lang: Language) => {
  try {
    const response = await axiosInstance.get<GetClanMembersResponse>(`/clan/members/${clanId}`, {
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
      'Failed to fetch clan members';
    throw new Error(errorMessage);
  }
};

export const getClanInfo = async (clanId: string, lang: Language) => {
  try {
    const response = await axiosInstance.get<GetClanInfoResponse>(`/clan/info/${clanId}`, {
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
      'Failed to fetch clan info';
    throw new Error(errorMessage);
  }
};

export const updateClan = async (clanId: string, payload: UpdateClanPayload, lang: Language) => {
  try {
    const response = await axiosInstance.put<{
      statusCode: number;
      body: { message: string; data: Clan };
    }>(`/clan/${clanId}`, payload, {
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to update clan';
    throw new Error(errorMessage);
  }
};

export const getUserClans = async (userId: string, lang: Language) => {
  try {
    const response = await axiosInstance.get(`/clan/user/${userId}`, {
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
      'Failed to fetch user clans';
    throw new Error(errorMessage);
  }
};

export const checkClanMembership = async (userId: string, clanId: string) => {
  try {
    const response = await axiosInstance.get(`/clan/checkMembership/${clanId}`, {
      withCredentials: true,
      params: { userId },
    });
    return response.data.body.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to check clan membership';
    throw new Error(errorMessage);
  }
};
