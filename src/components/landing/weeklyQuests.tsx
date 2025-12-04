'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';
import { fetchWeeklyQuests, type Quest } from '@/lib/services/ai';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  // Backend filters by authenticated user, no communityId needed
}

const QuestCard: React.FC<{ quest: Quest }> = ({ quest }) => {
  return (
    <Card className="p-4 bg-indigo-800 border border-indigo-700">
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
          className={`text-white ${quest.isCompleted ? 'bg-green-700 hover:bg-green-600' : 'bg-indigo-700 hover:bg-indigo-600'}`}
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

const WeeklyQuests: React.FC<Props> = () => {
  const { language } = LanguageStore();
  const { data, isPending } = useQuery({
    queryKey: ['ai-weekly-quests', language],
    queryFn: () => fetchWeeklyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const thisWeek = data?.body?.data?.thisWeek ?? [];
  const lastWeek = data?.body?.data?.lastWeek ?? [];
  const twoWeeksAgo = data?.body?.data?.twoWeeksAgo ?? [];

  return (
    <section className="py-8 px-6 rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          {t('ai.weeklyTitle', "This Week's Quests")}
        </h2>
      </div>

      {isPending ? (
        <p className="text-sm text-gray-400">{t('common.loading', 'Loading...')}</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-white/80 font-semibold mb-2">{t('ai.thisWeek', 'This Week')}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {thisWeek.map(q => (
                <QuestCard key={q.id} quest={q} />
              ))}
              {thisWeek.length === 0 && (
                <p className="text-sm text-gray-400">{t('ai.noQuests', 'No quests')}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-white/80 font-semibold mb-2">{t('ai.lastWeek', 'Last Week')}</h3>
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
            <h3 className="text-white/80 font-semibold mb-2">
              {t('ai.twoWeeksAgo', 'Two Weeks Ago')}
            </h3>
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
