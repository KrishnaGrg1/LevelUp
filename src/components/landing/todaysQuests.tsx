'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';
import {
  fetchDailyQuests,
  startQuest,
  completeQuest,
  getQuestStatus,
  getTimeRemaining,
  type Quest,
  type ApiResponse,
  type DailyQuestsData,
} from '@/lib/services/ai';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import authStore from '@/stores/useAuth';

interface Props {
  communityId?: string; // Filter quests for specific community (optional, shows all if not provided)
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
    <div className="flex items-center gap-2 text-xs">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
          style={{ width: `${timeRemaining.progressPercent}%` }}
        />
      </div>
      <span className="min-w-fit font-medium text-zinc-600 dark:text-zinc-400">
        {timeRemaining.remainingText}
      </span>
    </div>
  );
};

const QuestCard: React.FC<{
  quest: Quest;
  onStart: (questId: string) => void;
  onComplete: (questId: string) => void;
  isStarting: boolean;
  isCompleting: boolean;
}> = ({ quest, onStart, onComplete, isStarting, isCompleting }) => {
  const status = getQuestStatus(quest);

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
    if (status === 'completed') {
      return 'success';
    }
    if (status === 'in-progress') {
      return 'secondary';
    }
    if (status === 'ready') {
      return 'default';
    }
    return 'default';
  };

  const buttonVariants: Record<string, string> = {
    default:
      'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm',
    secondary:
      'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 cursor-default',
    success:
      'bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20 cursor-default border-green-200 dark:border-green-800',
  };
  return (
    <Card className="border shadow-sm transition-all hover:border-purple-200 hover:shadow-md dark:hover:border-purple-800">
      <div className="space-y-3 p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-base leading-snug font-semibold text-zinc-900 dark:text-zinc-50">
              {quest.description}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-yellow-200 bg-yellow-50 px-2.5 py-1 dark:border-yellow-800 dark:bg-yellow-900/10">
            <span className="font-numeric text-sm font-bold text-yellow-600 dark:text-yellow-400">
              {quest.xpValue}
            </span>
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">XP</span>
          </div>
        </div>

        {/* Community badge */}
        <div className="flex items-center gap-2">
          <div className="rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {quest.communityId}
            </p>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-500">•</span>
          <span className="font-numeric text-xs text-zinc-600 dark:text-zinc-400">
            Quest #{quest.periodSeq}
          </span>
        </div>

        {/* Timer */}
        {status !== 'not-started' && status !== 'completed' && <QuestTimer quest={quest} />}

        {/* Action button */}
        <div className="pt-2">
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
            className={`w-full rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
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

const TodaysQuests: React.FC<Props> = ({ communityId }) => {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();
  const { setTokens } = authStore();

  const { data, isPending } = useQuery({
    queryKey: ['ai-daily-quests', language],
    queryFn: () => fetchDailyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const startMutation = useMutation({
    mutationFn: (questId: string) => startQuest(questId, language),
    onMutate: async (questId: string) => {
      await queryClient.cancelQueries({ queryKey: ['ai-daily-quests', language] });

      const previousData = queryClient.getQueryData<ApiResponse<DailyQuestsData>>([
        'ai-daily-quests',
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

      return { previousData };
    },
    onSuccess: () => {
      toast.success(t('quests.landing.questStarted'));
    },
    onError: (
      error: unknown,
      _questId: string,
      context: { previousData: ApiResponse<DailyQuestsData> | undefined } | undefined,
    ) => {
      if (context?.previousData) {
        queryClient.setQueryData(['ai-daily-quests', language], context.previousData);
      }
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error(t('quests.landing.questStartFailed'), {
        description: err?.response?.data?.body?.message || t('quests.details.errors.tryAgain'),
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (questId: string) => completeQuest(questId, language),
    onMutate: async (questId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['ai-daily-quests', language] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<ApiResponse<DailyQuestsData>>([
        'ai-daily-quests',
        language,
      ]);

      // Optimistically update to mark quest as completed
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

      return { previousData };
    },
    onSuccess: response => {
      const {
        xpAwarded,
        currentLevel,
        tokensAwarded = 0,
        currentTokens,
        communityLevel,
        communityId,
        clanMemberXp,
        clanId,
      } = response.body.data;

      const detailParts: string[] = [
        `+${xpAwarded} XP`,
        `Level ${currentLevel}`,
        `+${tokensAwarded} Tokens`,
      ];

      if (communityId && typeof communityLevel === 'number') {
        detailParts.push(`Community Lv ${communityLevel}`);
      }

      if (clanId && typeof clanMemberXp === 'number') {
        detailParts.push(`Clan XP ${clanMemberXp}`);
      }

      toast.success(t('quests.landing.questCompleted'), {
        description: detailParts.join(' • '),
      });
      if (typeof currentTokens === 'number') {
        setTokens(currentTokens);
      }
      queryClient.invalidateQueries({ queryKey: ['ai-daily-quests', language] });
      queryClient.invalidateQueries({ queryKey: ['community-memberships', language] });
    },
    onError: (
      error: unknown,
      _questId: string,
      context: { previousData: ApiResponse<DailyQuestsData> | undefined } | undefined,
    ) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['ai-daily-quests', language], context.previousData);
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

  // Filter quests for the specific community (or show all if no communityId)
  const allToday = data?.body?.data?.today ?? [];
  const today = communityId ? allToday.filter(q => q.communityId === communityId) : allToday;

  return (
    <Card className="border shadow-sm">
      <div className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {t('quests.landing.daily.title')}
          </h2>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {t('quests.landing.loading')}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-3">
              {today.map(q => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  onStart={handleStart}
                  onComplete={handleComplete}
                  isStarting={startMutation.isPending}
                  isCompleting={completeMutation.isPending}
                />
              ))}
              {today.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 px-4 py-6 dark:border-zinc-800">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {t('quests.landing.noQuests')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TodaysQuests;
