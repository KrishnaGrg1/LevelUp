import axiosInstance from '../fetch';
import { Language } from '@/stores/useLanguage';
import { t } from '@/translations';

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
  startedAt?: string | null;
  completedAt?: string | null;
  estimatedMinutes?: number; // AI-generated completion time (15-120 minutes)
  date?: string;
  createdAt?: string;
  communityMemberId?: string | null;
  source?: string;
}

export type QuestStatus = 'not-started' | 'in-progress' | 'ready' | 'completed';

export interface TimeRemaining {
  isReady: boolean;
  remainingMinutes: number;
  remainingText: string;
  progressPercent: number;
}

export function getQuestStatus(quest: Quest): QuestStatus {
  if (quest.isCompleted || quest.completedAt) return 'completed';
  if (quest.startedAt) {
    const timeRemaining = getTimeRemaining(quest);
    return timeRemaining.isReady ? 'ready' : 'in-progress';
  }
  return 'not-started';
}

export function getTimeRemaining(quest: Quest): TimeRemaining {
  if (!quest.startedAt) {
    const required = quest.estimatedMinutes || 30;
    return {
      isReady: false,
      remainingMinutes: required,
      remainingText: t('quests.landing.minRequired', { minutes: required }),
      progressPercent: 0,
    };
  }

  const requiredMinutes = quest.estimatedMinutes || 30;
  const startTime = new Date(quest.startedAt).getTime();
  const now = Date.now();
  const elapsedMinutes = Math.floor((now - startTime) / (1000 * 60));
  const remainingMinutes = Math.max(0, requiredMinutes - elapsedMinutes);
  const progressPercent = Math.min(100, (elapsedMinutes / requiredMinutes) * 100);

  return {
    isReady: remainingMinutes === 0,
    remainingMinutes,
    remainingText:
      remainingMinutes > 0
        ? t('quests.landing.minRemaining', { minutes: remainingMinutes })
        : t('quests.landing.readyToComplete'),
    progressPercent,
  };
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
  communityTotalXp?: number;
  clanMemberXp?: number;
  clanId?: string;
  clanTotalXp?: number;
}

export interface StartQuestResponse {
  quest: Quest;
}

export const startQuest = async (questId: string, lang: Language) => {
  const res = await axiosInstance.post<ApiResponse<StartQuestResponse>>(
    `/ai/quests/start`,
    { questId },
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

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

export interface AdminGenerateAllResponse {
  totalTodayQuests?: number;
  totalThisWeekQuests?: number;
  timeElapsed: string;
}

export interface AdminGenerateUserResponse {
  userId: string;
  username: string;
  quests: QuestWithCommunity[];
  questCount: number;
  timeElapsed: string;
}

export interface QuestStatsResponse {
  overview: {
    totalQuests: number;
    completedQuests: number;
    pendingQuests: number;
    completionRate: string;
    todayActive: number;
    thisWeekActive: number;
    activeUsers: number;
  };
  byType: Array<{ type: string; _count: { id: number } }>;
  byCommunity: Array<{ communityId: string; _count: { id: number } }>;
  recentCompletions: Array<{
    id: string;
    description: string;
    completedAt: string;
    xpValue: number;
    user: { id: string; UserName: string };
    community: { id: string; name: string };
  }>;
}

export interface BulkDeleteFilter {
  userId?: string;
  communityId?: string;
  type?: 'Daily' | 'Weekly';
  periodStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface BulkDeleteResponse {
  message: string;
  deletedCount: number;
  filters: BulkDeleteFilter;
}

export const adminGenerateDailyAll = async (lang: Language) => {
  const res = await axiosInstance.post<ApiResponse<AdminGenerateAllResponse>>(
    `/ai/admin/generate/daily/all`,
    undefined,
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

export const adminGenerateDailyUser = async (userId: string, lang: Language) => {
  const res = await axiosInstance.post<ApiResponse<AdminGenerateUserResponse>>(
    `/ai/admin/generate/daily/${userId}`,
    undefined,
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

export const adminGenerateWeeklyAll = async (lang: Language) => {
  const res = await axiosInstance.post<ApiResponse<AdminGenerateAllResponse>>(
    `/ai/admin/generate/weekly/all`,
    undefined,
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

export const adminGenerateWeeklyUser = async (userId: string, lang: Language) => {
  const res = await axiosInstance.post<ApiResponse<AdminGenerateUserResponse>>(
    `/ai/admin/generate/weekly/${userId}`,
    undefined,
    {
      headers: { 'X-Language': lang },
      withCredentials: true,
    },
  );
  return res.data;
};

export const adminGetQuestStats = async (lang: Language) => {
  const res = await axiosInstance.get<ApiResponse<QuestStatsResponse>>(`/ai/admin/quests/stats`, {
    headers: { 'X-Language': lang },
    withCredentials: true,
  });
  return res.data;
};

export const adminBulkDeleteQuests = async (filters: BulkDeleteFilter, lang: Language) => {
  const res = await axiosInstance.delete<ApiResponse<BulkDeleteResponse>>(`/ai/admin/quests`, {
    headers: { 'X-Language': lang },
    data: filters,
    withCredentials: true,
  });
  return res.data;
};
