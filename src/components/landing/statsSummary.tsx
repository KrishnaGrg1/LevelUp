'use client';

import React from 'react';
import { t } from '@/translations';
import { Flame, Star, Trophy, Users } from 'lucide-react';

type StatKey = 'totalLevel' | 'communities' | 'questsDone' | 'streak';

interface StatsSummaryProps {
  stats: Record<StatKey, number>;
}

const StatIcon: Record<StatKey, React.ReactNode> = {
  totalLevel: <Trophy className="h-5 w-5 text-amber-300" />,
  communities: <Users className="h-5 w-5 text-cyan-300" />,
  questsDone: <Star className="h-5 w-5 text-lime-300" />,
  streak: <Flame className="h-5 w-5 text-orange-300" />,
};

const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  const statItems: Array<{ key: StatKey; value: number; helper?: string }> = [
    {
      key: 'totalLevel',
      value: stats.totalLevel,
      helper: t('dashboard.stats.helper.level', 'Overall progress'),
    },
    {
      key: 'communities',
      value: stats.communities,
      helper: t('dashboard.stats.helper.communities', 'Active groups'),
    },
    {
      key: 'questsDone',
      value: stats.questsDone,
      helper: t('dashboard.stats.helper.questsDone', 'Completed quests'),
    },
    {
      key: 'streak',
      value: stats.streak,
      helper: t('dashboard.stats.helper.streak', 'Day streak'),
    },
  ];

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white px-4 py-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              {t('dashboard.stats.title', 'Your momentum')}
            </p>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {t('dashboard.stats.subtitle', 'Keep leveling up every day')}
            </h3>
          </div>
          <div className="hidden rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 sm:block">
            {t('dashboard.stats.badge', 'Live snapshot')}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statItems.map(item => (
            <div
              key={item.key}
              className="group rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.4)] transition-transform duration-200 hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-800/60"
            >
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                <span>{t(`dashboard.stats.${item.key}`, item.key)}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700">
                  {StatIcon[item.key]}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black leading-none text-zinc-900 dark:text-white sm:text-4xl">
                  {item.value.toLocaleString()}
                </span>
              </div>

              {item.helper ? (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{item.helper}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          {t('dashboard.stats.footer', 'Updated each session with your latest activity')}
        </div>
      </div>
    </section>
  );
};

export default StatsSummary;
