'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';
import { fetchDailyQuests, type Quest } from '@/lib/services/ai';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  communityId: string; // Filter quests for specific community
}

const QuestCard: React.FC<{ quest: Quest }> = ({ quest }) => {
  return (
    <Card className="border-0 shadow-none transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
      <div className="p-5 space-y-3">
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
            disabled={quest.isCompleted}
            className={`w-full font-semibold py-2 rounded-lg transition-all duration-300 text-sm ${
              quest.isCompleted
                ? 'bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20 cursor-default border-green-200 dark:border-green-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white hover:scale-105 hover:shadow-lg'
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
  const { data, isPending } = useQuery({
    queryKey: ['ai-daily-quests', language],
    queryFn: () => fetchDailyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Filter quests for the specific community
  const allToday = data?.body?.data?.today ?? [];
  const allYesterday = data?.body?.data?.yesterday ?? [];
  const allDayBeforeYesterday = data?.body?.data?.dayBeforeYesterday ?? [];

  const today = allToday.filter(q => q.communityId === communityId);
  const yesterday = allYesterday.filter(q => q.communityId === communityId);
  const dayBeforeYesterday = allDayBeforeYesterday.filter(q => q.communityId === communityId);

  return (
    <Card className="border-0 shadow-none">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {t('dashboard.quests.title', "Today's Quests")}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Complete daily challenges to earn XP
            </p>
          </div>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {t('common.loading', 'Loading quests...')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {t('ai.today', 'Today')}
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {today.map(q => (
                  <QuestCard key={q.id} quest={q} />
                ))}
                {today.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {t('ai.noQuests', 'No quests available')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                  {t('ai.yesterday', 'Yesterday')}
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {yesterday.map(q => (
                  <QuestCard key={q.id} quest={q} />
                ))}
                {yesterday.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {t('ai.noQuests', 'No quests available')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-purple-300 dark:bg-purple-600" />
                <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                  {t('ai.dayBeforeYesterday', 'Day Before Yesterday')}
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {dayBeforeYesterday.map(q => (
                  <QuestCard key={q.id} quest={q} />
                ))}
                {dayBeforeYesterday.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {t('ai.noQuests', 'No quests available')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TodaysQuests;
