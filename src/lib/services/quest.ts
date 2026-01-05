import axiosInstance from '../fetch';
import { Language } from '@/stores/useLanguage';
import { Quest } from './ai';

export interface ApiResponse<T> {
  statusCode: number;
  body: {
    message: string;
    data: T;
  };
}

export interface QuestsResponse {
  all: Quest[];
  daily: {
    today: Quest[];
    yesterday: Quest[];
    dayBeforeYesterday: Quest[];
  };
  weekly: {
    thisWeek: Quest[];
    lastWeek: Quest[];
    twoWeeksAgo: Quest[];
  };
}

export const getQuests = async (lang: Language) => {
  try {
    const [dailyRes, weeklyRes] = await Promise.all([
      axiosInstance.get<
        ApiResponse<{ today: Quest[]; yesterday: Quest[]; dayBeforeYesterday: Quest[] }>
      >(`/ai/quests/daily`, {
        headers: { 'X-Language': lang },
        withCredentials: true,
      }),
      axiosInstance.get<
        ApiResponse<{ thisWeek: Quest[]; lastWeek: Quest[]; twoWeeksAgo: Quest[] }>
      >(`/ai/quests/weekly`, {
        headers: { 'X-Language': lang },
        withCredentials: true,
      }),
    ]);

    const dailyData = dailyRes.data.body.data;
    const weeklyData = weeklyRes.data.body.data;

    const allQuests = [
      ...(dailyData.today || []),
      ...(dailyData.yesterday || []),
      ...(dailyData.dayBeforeYesterday || []),
      ...(weeklyData.thisWeek || []),
      ...(weeklyData.lastWeek || []),
      ...(weeklyData.twoWeeksAgo || []),
    ];

    return {
      statusCode: 200,
      body: {
        message: 'Quests fetched successfully',
        data: allQuests,
      },
    };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to fetch quests';
    throw new Error(errorMessage);
  }
};

export const getDailyQuests = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<{ today: Quest[]; yesterday: Quest[]; dayBeforeYesterday: Quest[] }>
    >(`/ai/quests/daily`, {
      headers: { 'X-Language': lang },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to fetch daily quests';
    throw new Error(errorMessage);
  }
};

export const getWeeklyQuests = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<{ thisWeek: Quest[]; lastWeek: Quest[]; twoWeeksAgo: Quest[] }>
    >(`/ai/quests/weekly`, {
      headers: { 'X-Language': lang },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to fetch weekly quests';
    throw new Error(errorMessage);
  }
};

export const startQuest = async (questId: string, lang: Language) => {
  try {
    const response = await axiosInstance.post<ApiResponse<{ quest: Quest }>>(
      `/ai/quests/start`,
      { questId },
      {
        headers: { 'X-Language': lang },
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to start quest';
    throw new Error(errorMessage);
  }
};

export const completeQuest = async (questId: string, lang: Language) => {
  try {
    const response = await axiosInstance.patch<
      ApiResponse<{
        quest: Quest;
        xpAwarded: number;
        currentXp: number;
        currentLevel: number;
        currentTokens?: number;
        tokensAwarded?: number;
        communityXp?: number;
        communityLevel?: number;
        communityId?: string;
        communityTotalXp?: number;
        clanMemberXp?: number;
        clanId?: string;
        clanTotalXp?: number;
      }>
    >(
      `/ai/quests/complete`,
      { questId },
      {
        headers: { 'X-Language': lang },
        withCredentials: true,
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
      'Failed to complete quest';
    throw new Error(errorMessage);
  }
};

export const getCompletedQuests = async (
  lang: Language,
  page: number = 1,
  limit: number = 20,
  type?: 'Daily' | 'Weekly',
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (type) {
      params.append('type', type);
    }

    const response = await axiosInstance.get<
      ApiResponse<{
        quests: Quest[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasMore: boolean;
        };
      }>
    >(`/ai/quests/completed?${params.toString()}`, {
      headers: { 'X-Language': lang },
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to fetch completed quests';
    throw new Error(errorMessage);
  }
};
