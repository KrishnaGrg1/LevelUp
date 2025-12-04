'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';
import { fetchWeeklyQuests, type Quest } from '@/lib/services/ai';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  communityId: string; // Filter quests for specific community
}

const QuestCard: React.FC<{ quest: Quest }> = ({ quest }) => {
  return (
    <Card className="group relative overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-900/40 via-indigo-800/30 to-blue-900/40 backdrop-blur-sm hover:border-indigo-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/0 via-indigo-400/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-foreground leading-snug line-clamp-2">
              {quest.description}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-md bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/30">
            <span className="text-sm font-bold font-numeric text-yellow-400">{quest.xpValue}</span>
            <span className="text-xs font-medium text-yellow-400/80">XP</span>
          </div>
        </div>

        {/* Community badge */}
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
            <p className="text-xs text-muted-foreground font-medium">{quest.communityId}</p>
          </div>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground font-numeric">
            Quest #{quest.periodSeq}
          </span>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <Button
            size="sm"
            disabled={quest.isCompleted}
            className={`w-full font-semibold transition-all duration-200 ${
              quest.isCompleted
                ? 'bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/20 cursor-default'
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/30'
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

const WeeklyQuests: React.FC<Props> = ({ communityId }) => {
  const { language } = LanguageStore();
  const { data, isPending } = useQuery({
    queryKey: ['ai-weekly-quests', language],
    queryFn: () => fetchWeeklyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Filter quests for the specific community
  const allThisWeek = data?.body?.data?.thisWeek ?? [];
  const allLastWeek = data?.body?.data?.lastWeek ?? [];
  const allTwoWeeksAgo = data?.body?.data?.twoWeeksAgo ?? [];

  const thisWeek = allThisWeek.filter(q => q.communityId === communityId);
  const lastWeek = allLastWeek.filter(q => q.communityId === communityId);
  const twoWeeksAgo = allTwoWeeksAgo.filter(q => q.communityId === communityId);

  return (
    <section className="py-8 px-6 rounded-2xl border border-white/5 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">
            {t('ai.weeklyTitle', 'Weekly Quests')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete weekly challenges for bonus rewards
          </p>
        </div>
      </div>

      {isPending ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">
              {t('common.loading', 'Loading quests...')}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-1 rounded-full bg-indigo-500" />
              <h3 className="text-lg font-bold text-foreground">{t('ai.thisWeek', 'This Week')}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {thisWeek.map(q => (
                <QuestCard key={q.id} quest={q} />
              ))}
              {thisWeek.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-white/10 bg-white/5">
                  <p className="text-sm text-muted-foreground">
                    {t('ai.noQuests', 'No quests available')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-1 rounded-full bg-indigo-400/60" />
              <h3 className="text-lg font-bold text-foreground/80">
                {t('ai.lastWeek', 'Last Week')}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {lastWeek.map(q => (
                <QuestCard key={q.id} quest={q} />
              ))}
              {lastWeek.length === 0 && (
                <p className="text-sm text-gray-400">{t('ai.noQuests', 'No quests')}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-1 rounded-full bg-indigo-400/40" />
              <h3 className="text-lg font-bold text-foreground/60">
                {t('ai.twoWeeksAgo', 'Two Weeks Ago')}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {twoWeeksAgo.map(q => (
                <QuestCard key={q.id} quest={q} />
              ))}
              {twoWeeksAgo.length === 0 && (
                <p className="text-sm text-gray-400">{t('ai.noQuests', 'No quests')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WeeklyQuests;
