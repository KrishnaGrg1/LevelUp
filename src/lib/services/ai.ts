import axiosInstance from '../fetch';
import { Language } from '@/stores/useLanguage';

export interface Quest {
  id: string;
  userId: string;
  communityId: string;
  description: string;
  xpValue: number;
  type: 'Daily' | 'Weekly';
  periodStatus:
    | 'TODAY'
    | 'YESTERDAY'
    | 'DAY_BEFORE_YESTERDAY'
    | 'THIS_WEEK'
    | 'LAST_WEEK'
    | 'TWO_WEEKS_AGO';
  periodKey: string; // YYYY-MM-DD
  periodSeq: number; // 1–5
  // additional fields returned by API
  isCompleted?: boolean;
  date?: string;
  createdAt?: string;
  communityMemberId?: string | null;
  source?: string;
}

export interface DailyQuestsData {
  today: Quest[];
  yesterday: Quest[];
  dayBeforeYesterday: Quest[];
}

export interface WeeklyQuestsData {
  thisWeek: Quest[];
  lastWeek: Quest[];
  twoWeeksAgo: Quest[];
}

export interface ApiResponse<T> {
  statusCode: number;
  body: {
    message: string;
    data: T;
  };
}

export const fetchDailyQuests = async (lang: Language) => {
  const res = await axiosInstance.get<ApiResponse<DailyQuestsData>>(`/ai/quests/daily`, {
    headers: { 'X-Language': lang },
    withCredentials: true,
  });
  console.log('fetchDailyQuests response:', res.data);
  return res.data;
};

export const fetchWeeklyQuests = async (lang: Language) => {
  const res = await axiosInstance.get<ApiResponse<WeeklyQuestsData>>(`/ai/quests/weekly`, {
    headers: { 'X-Language': lang },
    withCredentials: true,
  });
  return res.data;
};

export const generateDailyQuests = async (lang: Language) => {
  const res = await axiosInstance.post<ApiResponse<{ today: Quest[] }>>(
    `/ai/generate/daily`,
    undefined,
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

export const generateWeeklyQuests = async (lang: Language) => {
  const res = await axiosInstance.post<ApiResponse<{ thisWeek: Quest[] }>>(
    `/ai/generate/weekly`,
    undefined,
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

export interface CompleteQuestResponse {
  quest: Quest;
  xpAwarded: number;
  currentXp: number;
  currentLevel: number;
  tokensAwarded?: number;
  currentTokens?: number;
  communityXp?: number;
  communityLevel?: number;
  communityId?: string;
}

export const completeQuest = async (questId: string, lang: Language) => {
  const res = await axiosInstance.patch<ApiResponse<CompleteQuestResponse>>(
    `/ai/quests/complete`,
    { questId },
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

// User Features
export interface CompletedQuestsResponse {
  quests: Quest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const fetchCompletedQuests = async (
  lang: Language,
  page: number = 1,
  limit: number = 20,
  type?: 'Daily' | 'Weekly',
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (type) params.append('type', type);

  const res = await axiosInstance.get<ApiResponse<CompletedQuestsResponse>>(
    `/ai/quests/completed?${params.toString()}`,
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

export interface QuestWithCommunity extends Quest {
  community: {
    id: string;
    name: string;
    description: string;
  };
}

export const fetchSingleQuest = async (questId: string, lang: Language) => {
  const res = await axiosInstance.get<ApiResponse<{ quest: QuestWithCommunity }>>(
    `/ai/quests/${questId}`,
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

export interface AIChatResponse {
  reply: string;
}

export const sendAIChat = async (prompt: string, lang: Language) => {
  const res = await axiosInstance.post<ApiResponse<AIChatResponse>>(
    `/ai/chat`,
    { prompt },
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

export interface AIConfigResponse {
  version: string;
  environment: string;
  ai: {
    configured: boolean;
    model: string | null;
    maxPromptChars: number;
    tokenCostPerChat: number;
  };
  quests: {
    dailyCount: number;
    weeklyCount: number;
    generationSchedule: {
      daily: string;
      weekly: string;
    };
    questsPerCommunity: number;
    periodStatuses: {
      daily: string[];
      weekly: string[];
    };
  };
  features: {
    aiChat: boolean;
    questGeneration: boolean;
    questCompletion: boolean;
    xpRewards: boolean;
    timezoneSupport: boolean;
  };
  limits: {
    maxPromptLength: number;
    maxDescriptionLength: number;
    minDescriptionLength: number;
  };
  user?: {
    tokens: number;
    timezone: string;
    totalQuests: number;
    completedQuests: number;
    communities: number;
  };
}

export const fetchAIConfig = async (lang: Language) => {
  const res = await axiosInstance.get<ApiResponse<AIConfigResponse>>(`/ai/config`, {
    headers: { 'X-Language': lang },
    withCredentials: true,
  });
  return res.data;
};

export interface AIHealthResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  uptime: number;
  responseTime: number;
  services: {
    ai: {
      configured: boolean;
      model: string | null;
    };
    database: {
      healthy: boolean;
      responseTime: number;
    };
  };
  quests: {
    total: number;
    completed: number;
    todayActive: number;
    thisWeekActive: number;
    completionRate: number;
  } | null;
  memory: {
    used: number;
    total: number;
    rss: number;
  };
}

export const fetchAIHealth = async (lang: Language) => {
  const res = await axiosInstance.get<ApiResponse<AIHealthResponse>>(`/ai/health`, {
    headers: { 'X-Language': lang },
    withCredentials: true,
  });
  return res.data;
};

// User can force generate their own quests
export const forceGenerateDailyQuests = async (lang: Language) => {
  const res = await axiosInstance.post<
    ApiResponse<{ today: QuestWithCommunity[]; count: number; forced: boolean }>
  >(`/ai/generate/daily/force`, undefined, {
    headers: { 'X-Language': lang },
    withCredentials: true,
  });
  return res.data;
};

export const forceGenerateWeeklyQuests = async (lang: Language) => {
  const res = await axiosInstance.post<
    ApiResponse<{ thisWeek: QuestWithCommunity[]; count: number; forced: boolean }>
  >(`/ai/generate/weekly/force`, undefined, {
    headers: { 'X-Language': lang },
    withCredentials: true,
  });
  return res.data;
};

// Admin only - delete quest
export const deleteQuest = async (questId: string, lang: Language) => {
  const res = await axiosInstance.delete<ApiResponse<{ deletedQuestId: string; userId: string }>>(
    `/ai/quests/${questId}`,
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

// Community Memberships
export interface CommunityMembership {
  communityId: string;
  totalXP: number;
  level: number;
  status: string;
  isPinned: boolean;
  community: {
    id: string;
    name: string;
    description: string;
    photo: string | null;
  };
}

export interface CommunityMembershipsResponse {
  memberships: CommunityMembership[];
}

export const getCommunityMemberships = async (lang: Language) => {
  const res = await axiosInstance.get<ApiResponse<CommunityMembershipsResponse>>(
    `/ai/community/memberships`,
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};
