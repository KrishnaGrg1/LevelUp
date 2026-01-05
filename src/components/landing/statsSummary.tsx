'use client';

import React from 'react';
import { t } from '@/translations';
import { useQuery } from '@tanstack/react-query';
import LanguageStore from '@/stores/useLanguage';
import authStore from '@/stores/useAuth';
import { getMyCommunities } from '@/lib/services/communities';
import { fetchCompletedQuests } from '@/lib/services/ai';
import { Badge } from '@/components/ui/badge';

const StatsSummary = () => {
  const { language } = LanguageStore();
  const { user } = authStore();

  const myCommunitiesQuery = useQuery({
    queryKey: ['my-communities', language],
    queryFn: () => getMyCommunities(language),
    staleTime: 60000,
  });

  // We only need the total count; request the smallest page.
  const completedTotalQuery = useQuery({
    queryKey: ['completed-quests-total', language],
    queryFn: () => fetchCompletedQuests(language, 1, 1),
    staleTime: 60000,
  });

  const communitiesCount = myCommunitiesQuery.data?.body?.data?.length ?? 0;
  const questsDone = completedTotalQuery.data?.body?.data?.pagination?.total ?? 0;
  const level = user?.level ?? 0;
  const xp = user?.xp ?? 0;

  const stats = [
    { label: t('dashboard.stats.totalLevel', 'Level'), value: level.toLocaleString() },
    { label: t('dashboard.stats.totalXP', 'Total XP'), value: xp.toLocaleString() },
    {
      label: t('dashboard.stats.communities', 'Communities'),
      value: communitiesCount.toLocaleString(),
    },
    { label: t('dashboard.stats.questsDone', 'Quests Done'), value: questsDone.toLocaleString() },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-black">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg dark:text-gray-100">
            {t('dashboard.stats.title', 'Your Stats')}
          </h2>
          <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
            {t('dashboard.stats.subtitle', 'Live overview of your progress')}
          </p>
        </div>
        {(myCommunitiesQuery.isFetching || completedTotalQuery.isFetching) && (
          <Badge
            variant="secondary"
            className="border border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
          >
            {t('dashboard.stats.refreshing', 'Refreshing')}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="font-numeric text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSummary;
