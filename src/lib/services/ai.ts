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
