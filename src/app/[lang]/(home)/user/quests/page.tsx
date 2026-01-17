'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';
import { Target, Trophy, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import {
  fetchDailyQuests,
  fetchWeeklyQuests,
  startQuest,
  completeQuest,
  getQuestStatus,
  getTimeRemaining,
  type Quest,
  type ApiResponse,
  type DailyQuestsData,
  type WeeklyQuestsData,
} from '@/lib/services/ai';
import { getMyCommunities } from '@/lib/services/communities';
import { toast } from 'sonner';

interface GroupedQuests {
  [communityId: string]: {
    communityName: string;
    quests: Quest[];
  };
}

const QuestTimer: React.FC<{ quest: Quest }> = ({ quest }) => {
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(quest));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(quest));
    }, 1000);

    return () => clearInterval(interval);
  }, [quest]);

  const status = getQuestStatus(quest);
  if (status === 'not-started' || status === 'completed') return null;

  return (
    <div className="mt-2 flex items-center gap-2 text-xs">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full bg-gradient-to-r from-zinc-600 to-zinc-700 transition-all duration-300"
          style={{ width: `${timeRemaining.progressPercent}%` }}
        />
      </div>
      <span className="min-w-fit font-medium text-zinc-600 dark:text-zinc-400">
        {timeRemaining.remainingText}
      </span>
    </div>
  );
};

export default function UserQuestsPage() {
  const { language } = LanguageStore();
  const { user, setTokens } = authStore();
  const queryClient = useQueryClient();

  const { data: communitiesData } = useQuery({
    queryKey: ['my-communities', language],
    queryFn: () => getMyCommunities(language),
    staleTime: 5 * 60 * 1000,
  });

  const { data: dailyData, isPending: isDailyPending } = useQuery({
    queryKey: ['ai-daily-quests', language],
    queryFn: () => fetchDailyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const { data: weeklyData, isPending: isWeeklyPending } = useQuery({
    queryKey: ['ai-weekly-quests', language],
    queryFn: () => fetchWeeklyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const startMutation = useMutation({
    mutationFn: (questId: string) => startQuest(questId, language),
    onMutate: async (questId: string) => {
      await queryClient.cancelQueries({ queryKey: ['ai-daily-quests', language] });
      await queryClient.cancelQueries({ queryKey: ['ai-weekly-quests', language] });

      const previousDaily = queryClient.getQueryData<ApiResponse<DailyQuestsData>>([
        'ai-daily-quests',
        language,
      ]);
      const previousWeekly = queryClient.getQueryData<ApiResponse<WeeklyQuestsData>>([
        'ai-weekly-quests',
        language,
      ]);

      queryClient.setQueryData(
        ['ai-daily-quests', language],
        (old: ApiResponse<DailyQuestsData> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            body: {
              ...old.body,
              data: {
                ...old.body.data,
                today: old.body.data.today.map((q: Quest) =>
                  q.id === questId ? { ...q, startedAt: new Date().toISOString() } : q,
                ),
              },
            },
          };
        },
      );

      queryClient.setQueryData(
        ['ai-weekly-quests', language],
        (old: ApiResponse<WeeklyQuestsData> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            body: {
              ...old.body,
              data: {
                ...old.body.data,
                thisWeek: old.body.data.thisWeek.map((q: Quest) =>
                  q.id === questId ? { ...q, startedAt: new Date().toISOString() } : q,
                ),
              },
            },
          };
        },
      );

      return { previousDaily, previousWeekly };
    },
    onSuccess: () => {
      toast.success(t('quests.landing.questStarted'));
    },
    onError: (_err, _questId, context) => {
      if (context?.previousDaily) {
        queryClient.setQueryData(['ai-daily-quests', language], context.previousDaily);
      }
      if (context?.previousWeekly) {
        queryClient.setQueryData(['ai-weekly-quests', language], context.previousWeekly);
      }
      toast.error(t('quests.landing.questStartFailed'));
    },
  });

  const completeMutation = useMutation({
    mutationFn: (questId: string) => completeQuest(questId, language),
    onMutate: async (questId: string) => {
      await queryClient.cancelQueries({ queryKey: ['ai-daily-quests', language] });
      await queryClient.cancelQueries({ queryKey: ['ai-weekly-quests', language] });

      const previousDaily = queryClient.getQueryData<ApiResponse<DailyQuestsData>>([
        'ai-daily-quests',
        language,
      ]);
      const previousWeekly = queryClient.getQueryData<ApiResponse<WeeklyQuestsData>>([
        'ai-weekly-quests',
        language,
      ]);

      queryClient.setQueryData(
        ['ai-daily-quests', language],
        (old: ApiResponse<DailyQuestsData> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            body: {
              ...old.body,
              data: {
                ...old.body.data,
                today: old.body.data.today.map((q: Quest) =>
                  q.id === questId ? { ...q, isCompleted: true } : q,
                ),
              },
            },
          };
        },
      );

      queryClient.setQueryData(
        ['ai-weekly-quests', language],
        (old: ApiResponse<WeeklyQuestsData> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            body: {
              ...old.body,
              data: {
                ...old.body.data,
                thisWeek: old.body.data.thisWeek.map((q: Quest) =>
                  q.id === questId ? { ...q, isCompleted: true } : q,
                ),
              },
            },
          };
        },
      );

      return { previousDaily, previousWeekly };
    },
    onSuccess: response => {
      const {
        xpAwarded,
        currentLevel,
        tokensAwarded = 0,
        currentTokens,
        communityLevel,
        communityId,
        communityTotalXp,
        clanMemberXp,
        clanId,
        clanTotalXp,
      } = response.body.data;

      const communityMap = new Map<string, string>();
      const communities = communitiesData?.body?.data;
      if (Array.isArray(communities)) {
        communities.forEach((community: { id: string; name: string }) => {
          communityMap.set(community.id, community.name);
        });
      }

      const details: string[] = [
        `+${xpAwarded} XP`,
        `Level ${currentLevel}`,
        `+${tokensAwarded} Tokens`,
      ];

      if (communityId) {
        const communityName = communityMap.get(communityId) || communityId;
        if (typeof communityLevel === 'number') {
          details.push(`${communityName} Lv ${communityLevel}`);
        }
        if (typeof communityTotalXp === 'number') {
          details.push(`${communityName} XP ${communityTotalXp.toLocaleString()}`);
        }
      }

      if (clanId) {
        const clanXpLabel =
          typeof clanMemberXp === 'number'
            ? `Clan XP ${clanMemberXp.toLocaleString()}`
            : typeof clanTotalXp === 'number'
              ? `Clan XP ${clanTotalXp.toLocaleString()}`
              : null;
        if (clanXpLabel) {
          details.push(clanXpLabel);
        }
      }

      toast.success(t('quests.landing.questCompleted'), {
        description: details.join(' • '),
      });
      if (typeof currentTokens === 'number') {
        setTokens(currentTokens);
      }
      queryClient.invalidateQueries({ queryKey: ['ai-daily-quests', language] });
      queryClient.invalidateQueries({ queryKey: ['ai-weekly-quests', language] });
      queryClient.invalidateQueries({ queryKey: ['my-communities', language] });
      queryClient.invalidateQueries({ queryKey: ['community-memberships', language] });
    },
    onError: (
      error: unknown,
      _questId: string,
      context:
        | {
            previousDaily: ApiResponse<DailyQuestsData> | undefined;
            previousWeekly: ApiResponse<WeeklyQuestsData> | undefined;
          }
        | undefined,
    ) => {
      if (context?.previousDaily) {
        queryClient.setQueryData(['ai-daily-quests', language], context.previousDaily);
      }
      if (context?.previousWeekly) {
        queryClient.setQueryData(['ai-weekly-quests', language], context.previousWeekly);
      }
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error(t('quests.landing.questCompleteFailed'), {
        description: err?.response?.data?.body?.message || t('quests.details.errors.tryAgain'),
      });
    },
  });

  const handleStart = (questId: string) => {
    startMutation.mutate(questId);
  };

  const handleComplete = (questId: string) => {
    completeMutation.mutate(questId);
  };

  // Build community ID to name map
  const communityMap = new Map<string, string>();
  const communities = communitiesData?.body?.data;
  if (Array.isArray(communities)) {
    communities.forEach((community: { id: string; name: string }) => {
      communityMap.set(community.id, community.name);
    });
  }

  // Group daily quests by community
  const dailyQuests = dailyData?.body?.data?.today ?? [];
  const groupedDaily: GroupedQuests = {};
  dailyQuests.forEach(quest => {
    if (!groupedDaily[quest.communityId]) {
      groupedDaily[quest.communityId] = {
        communityName: communityMap.get(quest.communityId) || quest.communityId,
        quests: [],
      };
    }
    groupedDaily[quest.communityId].quests.push(quest);
  });

  // Group weekly quests by community
  const weeklyQuests = weeklyData?.body?.data?.thisWeek ?? [];
  const groupedWeekly: GroupedQuests = {};
  weeklyQuests.forEach(quest => {
    if (!groupedWeekly[quest.communityId]) {
      groupedWeekly[quest.communityId] = {
        communityName: communityMap.get(quest.communityId) || quest.communityId,
        quests: [],
      };
    }
    groupedWeekly[quest.communityId].quests.push(quest);
  });

  const totalDailyQuests = dailyQuests.length;
  const totalWeeklyQuests = weeklyQuests.length;
  const completedDailyQuests = dailyQuests.filter(q => q.isCompleted).length;
  const completedWeeklyQuests = weeklyQuests.filter(q => q.isCompleted).length;
  const totalCompleted = completedDailyQuests + completedWeeklyQuests;
  const totalXp = [...dailyQuests, ...weeklyQuests]
    .filter(q => q.isCompleted)
    .reduce((sum, q) => sum + q.xpValue, 0);

  const QuestCard: React.FC<{
    quest: Quest;
    onStart: (questId: string) => void;
    onComplete: (questId: string) => void;
    isStarting: boolean;
    isCompleting: boolean;
    type?: 'daily' | 'weekly';
  }> = ({ quest, onStart, onComplete, isStarting, isCompleting }) => {
    const status = getQuestStatus(quest);

    const colorClass = 'bg-zinc-50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100';

    const getButtonContent = () => {
      if (status === 'completed') {
        return (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {t('quests.landing.completed')}
          </span>
        );
      }

      if (status === 'not-started') {
        return t('quests.landing.startQuest');
      }

      if (status === 'in-progress') {
        return t('quests.landing.inProgress');
      }

      if (status === 'ready') {
        return t('quests.landing.completeQuest');
      }
    };

    const getButtonVariant = () => {
      if (status === 'completed') return 'success';
      if (status === 'in-progress') return 'secondary';
      if (status === 'ready') return 'default';
      return 'default';
    };

    const buttonVariants: Record<string, string> = {
      default:
        'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm',
      secondary:
        'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-default',
      success:
        'bg-zinc-100 text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-default border-zinc-200 dark:border-zinc-800',
    };

    return (
      <Card className="border shadow-sm transition-all hover:shadow-md">
        <div className="space-y-3 p-3 sm:p-4">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-3">
            <p className="flex-1 text-sm leading-snug font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
              {quest.description}
            </p>
            <div
              className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 ${colorClass}`}
            >
              <span className="font-numeric text-sm font-bold">{quest.xpValue}</span>
              <span className="text-xs font-medium">XP</span>
            </div>
          </div>

          {status !== 'not-started' && status !== 'completed' && <QuestTimer quest={quest} />}

          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
            <span className="font-numeric text-xs text-zinc-600 dark:text-zinc-400">
              Quest #{quest.periodSeq}
            </span>
            <Button
              size="sm"
              disabled={
                status === 'completed' || isStarting || (status === 'in-progress' && isCompleting)
              }
              onClick={() => {
                if (status === 'not-started') {
                  onStart(quest.id);
                } else if (status === 'ready') {
                  onComplete(quest.id);
                }
              }}
              className={`w-full rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 sm:w-auto ${
                buttonVariants[getButtonVariant()]
              }`}
            >
              {getButtonContent()}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const CommunityQuestSection: React.FC<{
    communityId: string;
    communityName: string;
    quests: Quest[];
    onStart: (questId: string) => void;
    onComplete: (questId: string) => void;
    isStarting: boolean;
    isCompleting: boolean;
    type: 'daily' | 'weekly';
  }> = ({ communityName, quests, onStart, onComplete, isStarting, isCompleting, type }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="rounded-lg border bg-zinc-50/50 dark:bg-zinc-900/50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full touch-manipulation items-center justify-between rounded-t-lg p-3 transition-colors hover:bg-zinc-100/50 sm:p-4 dark:hover:bg-zinc-800/50"
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-zinc-600 sm:h-5 sm:w-5 dark:text-zinc-400" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 sm:h-5 sm:w-5 dark:text-zinc-400" />
            )}
            <h3 className="text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
              {communityName}
            </h3>
            <span className="rounded-md bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {quests.length}{' '}
              {quests.length === 1 ? t('quests.dashboard.quest') : t('quests.dashboard.quests')}
            </span>
          </div>
        </button>

        {isOpen && (
          <div className="space-y-2 p-3 pt-0 sm:space-y-3 sm:p-4">
            {quests.map(quest => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onStart={onStart}
                onComplete={onComplete}
                isStarting={isStarting}
                isCompleting={isCompleting}
                type={type}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!user?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">{t('common:loadingDetails')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2 text-3xl font-bold font-heading text-zinc-900 dark:text-zinc-50">
            {t('quests.user.title')}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">{t('quests.user.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 sm:p-6 dark:border-zinc-800 dark:from-zinc-900/20 dark:to-zinc-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.landing.daily.title')}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-zinc-700 dark:text-zinc-300">
                  {totalDailyQuests}
                </p>
              </div>
              <Target className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-600 opacity-50 dark:text-zinc-400" />
            </div>
          </Card>

          <Card className="border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 sm:p-6 dark:border-zinc-800 dark:from-zinc-900/20 dark:to-zinc-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.landing.weekly.title')}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-zinc-700 dark:text-zinc-300">
                  {totalWeeklyQuests}
                </p>
              </div>
              <Target className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-600 opacity-50 dark:text-zinc-400" />
            </div>
          </Card>

          <Card className="border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 sm:p-6 dark:border-zinc-800 dark:from-zinc-900/20 dark:to-zinc-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.user.cards.completed')}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-zinc-700 dark:text-zinc-300">
                  {totalCompleted}
                </p>
              </div>
              <svg
                className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-600 opacity-50 dark:text-zinc-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Card>

          <Card className="border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 sm:p-6 dark:border-zinc-800 dark:from-zinc-900/20 dark:to-zinc-900/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.user.cards.totalXp')}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-zinc-700 dark:text-zinc-300">
                  {totalXp}
                </p>
              </div>
              <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-zinc-600 opacity-50 dark:text-zinc-400" />
            </div>
          </Card>
        </div>

        {/* Daily Quests Section */}
        <Card className="border shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <div className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              <h2 className="font-heading text-lg font-bold text-zinc-900 sm:text-xl dark:text-zinc-50">
                {t('quests.landing.daily.title')}
              </h2>
            </div>

            {isDailyPending ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('quests.landing.loading')}
                  </p>
                </div>
              </div>
            ) : Object.keys(groupedDaily).length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 px-4 py-8 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.landing.noQuests')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(groupedDaily).map(([communityId, data]) => (
                  <CommunityQuestSection
                    key={communityId}
                    communityId={communityId}
                    communityName={data.communityName}
                    quests={data.quests}
                    onStart={handleStart}
                    onComplete={handleComplete}
                    isStarting={startMutation.isPending}
                    isCompleting={completeMutation.isPending}
                    type="daily"
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Weekly Quests Section */}
        <Card className="border shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <div className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
              <h2 className="font-heading text-lg font-bold text-zinc-900 sm:text-xl dark:text-zinc-50">
                {t('quests.landing.weekly.title')}
              </h2>
            </div>

            {isWeeklyPending ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t('quests.landing.loading')}
                  </p>
                </div>
              </div>
            ) : Object.keys(groupedWeekly).length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 px-4 py-8 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.landing.noQuests')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(groupedWeekly).map(([communityId, data]) => (
                  <CommunityQuestSection
                    key={communityId}
                    communityId={communityId}
                    communityName={data.communityName}
                    quests={data.quests}
                    onStart={handleStart}
                    onComplete={handleComplete}
                    isStarting={startMutation.isPending}
                    isCompleting={completeMutation.isPending}
                    type="weekly"
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
