'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';
import {
  fetchWeeklyQuests,
  startQuest,
  completeQuest,
  getQuestStatus,
  getTimeRemaining,
  type Quest,
  type ApiResponse,
  type WeeklyQuestsData,
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
      <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
          style={{ width: `${timeRemaining.progressPercent}%` }}
        />
      </div>
      <span className="text-zinc-600 dark:text-zinc-400 font-medium min-w-fit">
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
    if (status === 'completed') return 'success';
    if (status === 'in-progress') return 'secondary';
    if (status === 'ready') return 'default';
    return 'default';
  };

  const buttonVariants: Record<string, string> = {
    default:
      'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200',
    secondary:
      'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 cursor-default',
    success:
      'bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20 cursor-default',
  };

  // Card Container
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800">
      <div className="flex flex-1 flex-col p-4">
        {/* Meta Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          {/* Category Badge */}
          <div className="rounded-md bg-blue-50 px-2.5 py-1 dark:bg-blue-900/20">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
              {quest.type} Quest
            </span>
          </div>

          {/* XP Indicator */}
          <div className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 dark:border-blue-800 dark:bg-blue-900/10">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {quest.xpValue}
            </span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">XP</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="mb-3 flex-1">
          {/* Quest Title */}
          <h3 className="mb-2 text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
            {quest.description}
          </h3>

          {/* Quest Description (Meta Info) */}
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{quest.estimatedMinutes || 60} min</span>
            </div>
            <span className="text-zinc-400">•</span>
            <span>Quest #{quest.periodSeq}</span>
          </div>
        </div>

        {/* Timer (if in progress) */}
        {status !== 'not-started' && status !== 'completed' && (
          <div className="mb-3">
            <QuestTimer quest={quest} />
          </div>
        )}

        {/* Action Area */}
        <div className="mt-auto pt-2">
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
            className={`w-full rounded-lg py-2 text-sm font-medium shadow-sm transition-all duration-200 ${
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

const WeeklyQuests: React.FC<Props> = ({ communityId }) => {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();
  const { setTokens } = authStore();

  const { data, isPending } = useQuery({
    queryKey: ['ai-weekly-quests', language],
    queryFn: () => fetchWeeklyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const startMutation = useMutation({
    mutationFn: (questId: string) => startQuest(questId, language),
    onMutate: async (questId: string) => {
      await queryClient.cancelQueries({ queryKey: ['ai-weekly-quests', language] });

      const previousData = queryClient.getQueryData<ApiResponse<WeeklyQuestsData>>([
        'ai-weekly-quests',
        language,
      ]);

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

      return { previousData };
    },
    onSuccess: () => {
      toast.success(t('quests.landing.questStarted'));
    },
    onError: (
      error: unknown,
      _questId: string,
      context: { previousData: ApiResponse<WeeklyQuestsData> | undefined } | undefined,
    ) => {
      if (context?.previousData) {
        queryClient.setQueryData(['ai-weekly-quests', language], context.previousData);
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
      await queryClient.cancelQueries({ queryKey: ['ai-weekly-quests', language] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<ApiResponse<WeeklyQuestsData>>([
        'ai-weekly-quests',
        language,
      ]);

      // Optimistically update to mark quest as completed
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

      return { previousData };
    },
    onSuccess: response => {
      const { xpAwarded, currentLevel, tokensAwarded, currentTokens } = response.body.data;
      toast.success(t('quests.landing.questCompleted'), {
        description: `+${xpAwarded} XP • +${tokensAwarded} Tokens • Level ${currentLevel}`,
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
      context: { previousData: ApiResponse<WeeklyQuestsData> | undefined } | undefined,
    ) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['ai-weekly-quests', language], context.previousData);
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
  const allThisWeek = data?.body?.data?.thisWeek ?? [];
  const thisWeek = communityId
    ? allThisWeek.filter(q => q.communityId === communityId)
    : allThisWeek;

  return (
    <div>
      {isPending ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {t('quests.landing.loading')}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {thisWeek.map(q => (
              <QuestCard
                key={q.id}
                quest={q}
                onStart={handleStart}
                onComplete={handleComplete}
                isStarting={startMutation.isPending}
                isCompleting={completeMutation.isPending}
              />
            ))}
          </div>
          {thisWeek.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 px-4 py-12 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {t('quests.landing.noQuests')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyQuests;
