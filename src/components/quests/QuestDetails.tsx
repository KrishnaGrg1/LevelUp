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
  // No props needed - backend filters by authenticated user
}

const QuestRow: React.FC<{ quest: Quest; color: 'purple' | 'indigo' }> = ({ quest, color }) => {
  const colorBase = color === 'purple' ? 'purple' : 'indigo';
  return (
    <Card className={`p-4 bg-${colorBase}-800 border border-${colorBase}-700`}>
      <div className="flex justify-between mb-2">
        <p className="font-semibold text-white">{quest.description}</p>
        <p className="text-yellow-400 font-bold">{quest.xpValue} XP</p>
      </div>
      <p className="text-gray-300 text-sm mb-1">{quest.communityId}</p>
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-xs">Seq {quest.periodSeq}</p>
        <Button
          variant="secondary"
          size="sm"
          className={`text-white ${quest.isCompleted ? 'bg-green-700 hover:bg-green-600' : `bg-${colorBase}-700 hover:bg-${colorBase}-600`}`}
          disabled={quest.isCompleted}
        >
          {quest.isCompleted
            ? t('ai.completed', 'Completed')
            : t('ai.completeStatus', 'Complete Status')}
        </Button>
      </div>
    </Card>
  );
};

const QuestDetails: React.FC<QuestDetailsProps> = () => {
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

  const today = daily.data?.body?.data?.today ?? [];
  const thisWeek = weekly.data?.body?.data?.thisWeek ?? [];
  const lastWeek = weekly.data?.body?.data?.lastWeek ?? [];
  const twoWeeksAgo = weekly.data?.body?.data?.twoWeeksAgo ?? [];

  return (
    <Tabs defaultValue="daily" className="w-full">
      <TabsList>
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
      </TabsList>

      {/* Daily: Today only */}
      <TabsContent value="daily" className="mt-4 space-y-6">
        {/* Today only */}
        <div>
          <h3 className="text-white/80 font-semibold mb-2">{t('ai.today', 'Today')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {today.map(q => (
              <QuestRow key={q.id} quest={q} color="purple" />
            ))}
            {today.length === 0 && (
              <p className="text-sm text-gray-400">{t('ai.noQuests', 'No quests')}</p>
            )}
          </div>
        </div>
      </TabsContent>

      {/* Weekly */}
      <TabsContent value="weekly" className="mt-4 space-y-6">
        {/* This Week */}
        <div>
          <h3 className="text-white/80 font-semibold mb-2">{t('ai.thisWeek', 'This Week')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
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
          <h3 className="text-white/80 font-semibold mb-2">{t('ai.lastWeek', 'Last Week')}</h3>
          <div className="grid md:grid-cols-2 gap-4">
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
          <h3 className="text-white/80 font-semibold mb-2">
            {t('ai.twoWeeksAgo', 'Two Weeks Ago')}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
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
