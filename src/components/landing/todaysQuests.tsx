'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';
import { fetchDailyQuests, completeQuest, type Quest } from '@/lib/services/ai';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  communityId: string; // Filter quests for specific community
}

const QuestCard: React.FC<{
  quest: Quest;
  onComplete: (questId: string) => void;
  isCompleting: boolean;
}> = ({ quest, onComplete, isCompleting }) => {
  return (
    <Card className="border shadow-sm transition-all hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800">
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
              {quest.description}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
            <span className="text-sm font-bold font-numeric text-yellow-600 dark:text-yellow-400">
              {quest.xpValue}
            </span>
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">XP</span>
          </div>
        </div>

        {/* Community badge */}
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
              {quest.communityId}
            </p>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-500">•</span>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-numeric">
            Quest #{quest.periodSeq}
          </span>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <Button
            size="sm"
            disabled={quest.isCompleted || isCompleting}
            onClick={() => onComplete(quest.id)}
            className={`w-full font-medium py-2 rounded-lg transition-all duration-200 text-sm ${
              quest.isCompleted
                ? 'bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20 cursor-default border-green-200 dark:border-green-800 disabled:opacity-50 disabled:cursor-not-allowed'
                : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm'
            }`}
          >
            {quest.isCompleted ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {t('ai.completed', 'Completed')}
              </span>
            ) : (
              t('ai.completeStatus', 'Mark Complete')
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const TodaysQuests: React.FC<Props> = ({ communityId }) => {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ['ai-daily-quests', language],
    queryFn: () => fetchDailyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const completeMutation = useMutation({
    mutationFn: (questId: string) => completeQuest(questId, language),
    onSuccess: response => {
      const xpAwarded = response.body.data.xpAwarded;
      const currentLevel = response.body.data.currentLevel;
      toast.success(t('ai.quest_completed', 'Quest completed!'), {
        description: `+${xpAwarded} XP • Level ${currentLevel}`,
      });
      queryClient.invalidateQueries({ queryKey: ['ai-daily-quests', language] });
    },
    onError: (error: any) => {
      toast.error(t('ai.quest_complete_error', 'Failed to complete quest'), {
        description: error?.response?.data?.body?.message || 'Please try again',
      });
    },
  });

  const handleComplete = (questId: string) => {
    completeMutation.mutate(questId);
  };

  // Filter quests for the specific community
  const allToday = data?.body?.data?.today ?? [];
  const today = allToday.filter(q => q.communityId === communityId);

  return (
    <Card className="border shadow-sm">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <h2 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {t('dashboard.quests.title', "Today's Quests")}
          </h2>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {t('common.loading', 'Loading...')}
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
                  onComplete={handleComplete}
                  isCompleting={completeMutation.isPending}
                />
              ))}
              {today.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 px-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {t('ai.noQuests', 'No quests available')}
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
