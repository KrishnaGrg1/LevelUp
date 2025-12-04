'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import LanguageStore from '@/stores/useLanguage';
import { fetchDailyQuests, fetchWeeklyQuests, type Quest } from '@/lib/services/ai';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { t } from '@/translations';

interface QuestDetailsProps {
  communityId: string; // Filter quests for specific community
}

const QuestRow: React.FC<{ quest: Quest; color: 'purple' | 'indigo' }> = ({ quest, color }) => {
  const gradientFrom = color === 'purple' ? 'from-purple-900/40' : 'from-indigo-900/40';
  const gradientVia = color === 'purple' ? 'via-purple-800/30' : 'via-indigo-800/30';
  const gradientTo = color === 'purple' ? 'to-purple-900/40' : 'to-blue-900/40';
  const hoverBorder =
    color === 'purple' ? 'hover:border-purple-400/30' : 'hover:border-indigo-400/30';
  const hoverShadow =
    color === 'purple' ? 'hover:shadow-purple-500/20' : 'hover:shadow-indigo-500/20';
  const btnGradient =
    color === 'purple'
      ? 'from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 hover:shadow-purple-500/30'
      : 'from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 hover:shadow-indigo-500/30';

  return (
    <Card
      className={`group relative overflow-hidden border border-white/10 bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} backdrop-blur-sm ${hoverBorder} transition-all duration-300 hover:shadow-lg ${hoverShadow}`}
    >
      <div className="relative p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <p className="flex-1 text-sm font-semibold text-foreground leading-snug">
            {quest.description}
          </p>
          <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/30">
            <span className="text-xs font-bold font-numeric text-yellow-400">{quest.xpValue}</span>
            <span className="text-[10px] font-medium text-yellow-400/80">XP</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">{quest.communityId}</span>
            <span>•</span>
            <span className="font-numeric">#{quest.periodSeq}</span>
          </div>
          <Button
            size="sm"
            disabled={quest.isCompleted}
            className={`text-xs font-semibold transition-all duration-200 ${
              quest.isCompleted
                ? 'bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/20 cursor-default'
                : `bg-gradient-to-r ${btnGradient} text-white shadow-sm hover:shadow-md`
            }`}
          >
            {quest.isCompleted ? t('ai.completed', '✓ Done') : t('ai.completeStatus', 'Complete')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const QuestDetails: React.FC<QuestDetailsProps> = ({ communityId }) => {
  const { language } = LanguageStore();

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

  // Filter quests for the specific community
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
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
      </TabsList>

      {/* Daily: Today only */}
      <TabsContent value="daily" className="mt-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            <h3 className="text-base font-bold text-foreground">{t('ai.today', 'Today')}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {today.map(q => (
              <QuestRow key={q.id} quest={q} color="purple" />
            ))}
            {today.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-8 px-4 rounded-lg border border-dashed border-white/10 bg-white/5">
                <p className="text-sm text-muted-foreground">
                  {t('ai.noQuests', 'No quests available')}
                </p>
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      {/* Weekly */}
      <TabsContent value="weekly" className="mt-6 space-y-6">
        {/* This Week */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <h3 className="text-base font-bold text-foreground">{t('ai.thisWeek', 'This Week')}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {thisWeek.map(q => (
              <QuestRow key={q.id} quest={q} color="indigo" />
            ))}
            {thisWeek.length === 0 && (
              <p className="text-sm text-gray-400">{t('ai.noQuests', 'No quests')}</p>
            )}
          </div>
        </div>
        {/* Last Week */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400/60" />
            <h3 className="text-base font-bold text-foreground/80">
              {t('ai.lastWeek', 'Last Week')}
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {lastWeek.map(q => (
              <QuestRow key={q.id} quest={q} color="indigo" />
            ))}
            {lastWeek.length === 0 && (
              <p className="text-sm text-gray-400">{t('ai.noQuests', 'No quests')}</p>
            )}
          </div>
        </div>
        {/* Two Weeks Ago */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-400/40" />
            <h3 className="text-base font-bold text-foreground/60">
              {t('ai.twoWeeksAgo', 'Two Weeks Ago')}
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {twoWeeksAgo.map(q => (
              <QuestRow key={q.id} quest={q} color="indigo" />
            ))}
            {twoWeeksAgo.length === 0 && (
              <p className="text-sm text-gray-400">{t('ai.noQuests', 'No quests')}</p>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default QuestDetails;
