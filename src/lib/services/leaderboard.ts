import axiosInstance from '../fetch';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// The backend sometimes wraps payload under `body.data` instead of `data` directly.
// Normalize both shapes so consumers always receive the actual `data` object.
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
  statusCode?: number;
  body?: {
    message?: string;
    data?: T;
  };
}

function unwrapData<T>(response: ApiResponse<T>): T | undefined {
  return response.data ?? response.body?.data;
}

export interface GlobalLeaderboardUser {
  id: string;
  UserName: string;
  profilePicture: string | null;
  xp: number;
  level: number;
  tokens: number;
}

export interface GlobalLeaderboardResponse {
  results: GlobalLeaderboardUser[];
  pagination: PaginationResponse;
}

/**
 * Get top users ranked by global XP
 */
export async function getGlobalLeaderboard(
  params?: PaginationParams,
): Promise<GlobalLeaderboardResponse> {
  const response = await axiosInstance.get<ApiResponse<GlobalLeaderboardResponse>>('/leaderboard', {
    params,
  });
  const fallback: GlobalLeaderboardResponse = {
    results: [],
    pagination: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
      total: 0,
      totalPages: 0,
      hasMore: false,
    },
  };

  // Ensure react-query receives defined data even if API omits data
  return unwrapData(response.data) ?? fallback;
}


export interface CommunityLeaderboardMember {
  id: string;
  totalXP: number;
  level: number;
  user: {
    id: string;
    UserName: string;
    profilePicture: string | null;
  };
}

export interface CommunityLeaderboardResponse {
  community: {
    id: string;
    name: string;
    xp: number;
  };
  results: CommunityLeaderboardMember[];
  pagination: PaginationResponse;
}

/**
 * Get members of a specific community ranked by their community XP
 */
export async function getCommunityLeaderboard(
  communityId: string,
  params?: PaginationParams,
): Promise<CommunityLeaderboardResponse> {
  const response = await axiosInstance.get<ApiResponse<CommunityLeaderboardResponse>>(
    `/leaderboard/community/${communityId}`,
    { params },
  );
  return unwrapData(response.data)!;
}

export interface TopCommunity {
  id: string;
  name: string;
  xp: number;
  memberLimit: number;
  memberCount: number;
  createdAt: string;
}

export type CommunitySortBy = 'xp' | 'members' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface TopCommunitiesParams extends PaginationParams {
  sortBy?: CommunitySortBy;
  order?: SortOrder;
}

export interface TopCommunitiesResponse {
  results: TopCommunity[];
  sortBy: CommunitySortBy;
  order: SortOrder;
  pagination: PaginationResponse;
}

/**
 * Get top communities ranked by XP, member count, or creation date
 */
export async function getTopCommunities(
  params?: TopCommunitiesParams,
): Promise<TopCommunitiesResponse> {
  const response = await axiosInstance.get<ApiResponse<TopCommunitiesResponse>>(
    '/leaderboard/top-communities',
    { params },
  );
  const fallback: TopCommunitiesResponse = {
    results: [],
    sortBy: params?.sortBy ?? 'xp',
    order: params?.order ?? 'desc',
    pagination: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
      total: 0,
      totalPages: 0,
      hasMore: false,
    },
  };

  return unwrapData(response.data) ?? fallback;
}


export interface ClanLeaderboardMember {
  id: string;
  totalXP: number;
  user: {
    id: string;
    UserName: string;
    profilePicture: string | null;
  };
}

export interface ClanLeaderboardResponse {
  clan: {
    id: string;
    name: string;
    xp: number;
  };
  results: ClanLeaderboardMember[];
  pagination: PaginationResponse;
}

/**
 * Get members of a specific clan ranked by their clan XP
 */
export async function getClanLeaderboard(
  clanId: string,
  params?: PaginationParams,
): Promise<ClanLeaderboardResponse> {
  const response = await axiosInstance.get<ApiResponse<ClanLeaderboardResponse>>(
    `/leaderboard/clan/${clanId}`,
    { params },
  );
  return unwrapData(response.data)!;
}

export interface TopClan {
  id: string;
  name: string;
  xp: number;
  communityId: string;
  limit: number;
  memberCount: number;
  createdAt: string;
}

export type ClanSortBy = 'xp' | 'members' | 'createdAt';

export interface TopClansParams extends PaginationParams {
  sortBy?: ClanSortBy;
  order?: SortOrder;
  communityId?: string;
}

export interface TopClansResponse {
  results: TopClan[];
  sortBy: ClanSortBy;
  order: SortOrder;
  pagination: PaginationResponse;
}

/**
 * Get top clans ranked by XP, member count, or creation date
 * Optionally filter by community
 */
export async function getTopClans(params?: TopClansParams): Promise<TopClansResponse> {
  const response = await axiosInstance.get<ApiResponse<TopClansResponse>>(
    '/leaderboard/top-clans',
    { params },
  );
  const fallback: TopClansResponse = {
    results: [],
    sortBy: params?.sortBy ?? 'xp',
    order: params?.order ?? 'desc',
    pagination: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
      total: 0,
      totalPages: 0,
      hasMore: false,
    },
  };

  return unwrapData(response.data) ?? fallback;
}

export interface QuestCompletionXPUpdate {
  xpAwarded: number;
  currentXp: number;
  currentLevel: number;
  communityXp: number;
  communityLevel: number;
  communityTotalXp: number;
  clanMemberXp?: number;
  clanId?: string;
  clanTotalXp?: number;
}

export function buildLeaderboardParams(
  page: number = 1,
  limit: number = 20,
  additionalParams?: Record<string, string | number>,
): Record<string, string | number> {
  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    ...additionalParams,
  };
}

/**
 * Get leaderboard rank position from page and index
 */
export function getLeaderboardRank(page: number, limit: number, index: number): number {
  return (page - 1) * limit + index + 1;
}
