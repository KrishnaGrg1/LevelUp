'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LanguageStore from '@/stores/useLanguage';
import { fetchDailyQuests, fetchWeeklyQuests, completeQuest, type Quest } from '@/lib/services/ai';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { t } from '@/translations';
import { toast } from 'sonner';

interface QuestDetailsProps {
  communityId: string;
}

const QuestRow: React.FC<{
  quest: Quest;
  color: 'purple' | 'indigo';
  onComplete: (questId: string) => void;
  isCompleting: boolean;
}> = ({ quest, color, onComplete, isCompleting }) => {
  const xpBgColor =
    color === 'purple'
      ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400'
      : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400';

  return (
    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <p className="flex-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
            {quest.description}
          </p>
          <div
            className={`flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md border ${xpBgColor}`}
          >
            <span className="text-xs font-bold font-numeric">{quest.xpValue}</span>
            <span className="text-[10px] font-medium">XP</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="font-medium">{quest.communityId}</span>
            <span>&#8226;</span>
            <span className="font-numeric">#{quest.periodSeq}</span>
          </div>
          <Button
            size="sm"
            disabled={quest.isCompleted || isCompleting}
            onClick={() => onComplete(quest.id)}
            className={`font-semibold py-2 rounded-lg transition-all duration-300 text-xs ${
              quest.isCompleted
                ? 'bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20 cursor-default disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white hover:scale-105 hover:shadow-lg'
            }`}
          >
            {quest.isCompleted
              ? t('quests.details.buttons.completed')
              : t('quests.details.buttons.complete')}
          </Button>
        </div>
      </div>
    </div>
  );
};

const QuestDetails: React.FC<QuestDetailsProps> = ({ communityId }) => {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();

  const daily = useQuery({
    queryKey: ['ai-daily-quests', language],
    queryFn: () => fetchDailyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const weekly = useQuery({
    queryKey: ['ai-weekly-quests', language],
    queryFn: () => fetchWeeklyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const completeMutation = useMutation({
    mutationFn: (questId: string) => completeQuest(questId, language),
    onSuccess: response => {
      const xpAwarded = response.body.data.xpAwarded;
      const currentLevel = response.body.data.currentLevel;
      toast.success(t('quests.details.success.questCompleted'), {
        description: `+${xpAwarded} XP - Level ${currentLevel}`,
      });
      queryClient.invalidateQueries({ queryKey: ['ai-daily-quests', language] });
      queryClient.invalidateQueries({ queryKey: ['ai-weekly-quests', language] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error(t('quests.details.errors.completeFailed'), {
        description: err?.response?.data?.body?.message || t('quests.details.errors.tryAgain'),
      });
    },
  });

  const handleComplete = (questId: string) => {
    completeMutation.mutate(questId);
  };

  const allToday = daily.data?.body?.data?.today ?? [];
  const today = allToday.filter(q => q.communityId === communityId);

  const allThisWeek = weekly.data?.body?.data?.thisWeek ?? [];
  const allLastWeek = weekly.data?.body?.data?.lastWeek ?? [];
  const allTwoWeeksAgo = weekly.data?.body?.data?.twoWeeksAgo ?? [];

  const thisWeek = allThisWeek.filter(q => q.communityId === communityId);
  const lastWeek = allLastWeek.filter(q => q.communityId === communityId);
  const twoWeeksAgo = allTwoWeeksAgo.filter(q => q.communityId === communityId);

  return (
    <Tabs defaultValue="daily" className="w-full">
      <TabsList>
        <TabsTrigger value="daily">{t('quests.details.tabs.daily')}</TabsTrigger>
        <TabsTrigger value="weekly">{t('quests.details.tabs.weekly')}</TabsTrigger>
      </TabsList>

      <TabsContent value="daily" className="mt-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {t('quests.details.periods.today')}
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {today.map(q => (
              <QuestRow
                key={q.id}
                quest={q}
                color="purple"
                onComplete={handleComplete}
                isCompleting={completeMutation.isPending}
              />
            ))}
            {today.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-8 px-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.details.empty.noQuests')}
                </p>
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="weekly" className="mt-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {t('quests.details.periods.thisWeek')}
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {thisWeek.map(q => (
              <QuestRow
                key={q.id}
                quest={q}
                color="indigo"
                onComplete={handleComplete}
                isCompleting={completeMutation.isPending}
              />
            ))}
            {thisWeek.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-8 px-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.details.empty.noQuests')}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-blue-400" />
            <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              {t('quests.details.periods.lastWeek')}
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {lastWeek.map(q => (
              <QuestRow
                key={q.id}
                quest={q}
                color="indigo"
                onComplete={handleComplete}
                isCompleting={completeMutation.isPending}
              />
            ))}
            {lastWeek.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-8 px-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.details.empty.noQuests')}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-blue-300 dark:bg-blue-600" />
            <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
              {t('quests.details.periods.twoWeeksAgo')}
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {twoWeeksAgo.map(q => (
              <QuestRow
                key={q.id}
                quest={q}
                color="indigo"
                onComplete={handleComplete}
                isCompleting={completeMutation.isPending}
              />
            ))}
            {twoWeeksAgo.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-8 px-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.details.empty.noQuests')}
                </p>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default QuestDetails;
