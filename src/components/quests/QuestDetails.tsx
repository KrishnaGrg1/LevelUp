'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import LanguageStore from '@/stores/useLanguage';
import { fetchDailyQuests, fetchWeeklyQuests, completeQuest, type Quest } from '@/lib/services/ai';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { t } from '@/translations';
import { toast } from 'sonner';
import authStore from '@/stores/useAuth';

interface QuestDetailsProps {
  communityId: string;
}

const QuestRow: React.FC<{
  quest: Quest;
  color?: 'purple' | 'indigo';
  onComplete: (questId: string) => void;
  isCompleting: boolean;
}> = ({ quest, onComplete, isCompleting }) => {
  const xpBgColor = 'bg-zinc-50 dark:bg-zinc-900/10 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100';

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <p className="flex-1 text-sm leading-snug font-semibold text-zinc-900 dark:text-zinc-50">
            {quest.description}
          </p>
          <div
            className={`flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 ${xpBgColor}`}
          >
            <span className="font-numeric text-xs font-bold">{quest.xpValue}</span>
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
            className={`rounded-lg py-2 text-xs font-semibold transition-all duration-300 ${
              quest.isCompleted
                ? 'cursor-default bg-green-50 text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-105 hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg'
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
  const { setTokens } = authStore();

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

      const details: string[] = [
        `+${xpAwarded} XP`,
        `Level ${currentLevel}`,
      ];

      details.push(`+${tokensAwarded} Tokens`);

      if (communityId && typeof communityLevel === 'number') {
        details.push(`Community Lv ${communityLevel}`);
      }

      if (clanId && typeof clanMemberXp === 'number') {
        details.push(`Clan XP ${clanMemberXp}`);
      }

      toast.success(t('quests.details.success.questCompleted'), {
        description: details.join(' • '),
      });

      if (typeof currentTokens === 'number') {
        setTokens(currentTokens);
      }
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
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {t('quests.details.periods.today')}
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
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
              <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed border-zinc-200 px-4 py-8 dark:border-zinc-800">
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
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {t('quests.details.periods.thisWeek')}
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
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
              <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed border-zinc-200 px-4 py-8 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.details.empty.noQuests')}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-zinc-700 dark:bg-zinc-300" />
            <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              {t('quests.details.periods.lastWeek')}
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
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
              <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed border-zinc-200 px-4 py-8 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.details.empty.noQuests')}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-zinc-500 dark:bg-zinc-500" />
            <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
              {t('quests.details.periods.twoWeeksAgo')}
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
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
              <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed border-zinc-200 px-4 py-8 dark:border-zinc-800">
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
