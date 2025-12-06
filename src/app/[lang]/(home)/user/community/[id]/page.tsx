'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import CommunityDetail from '@/components/communities/CommunityDetail';
import TodaysQuests from '@/components/landing/todaysQuests';
import WeeklyQuests from '@/components/landing/weeklyQuests';
import { t } from '@/translations';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;
  const [questView, setQuestView] = useState<'daily' | 'weekly'>('daily');

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-5rem)]">
      {/* Main Community Area - Takes priority space */}
      <div className="flex-1 min-w-0">
        <CommunityDetail communityId={communityId} />
      </div>

      {/* Quests Sidebar - Fixed width on large screens, full width on mobile */}
      <aside className="lg:w-[450px] xl:w-[500px] flex-shrink-0 space-y-4">
        {/* Quest Toggle Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-1.5 shadow-sm border border-zinc-200 dark:border-zinc-800 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex gap-1.5">
            <button
              onClick={() => setQuestView('daily')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                questView === 'daily'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full transition-colors ${questView === 'daily' ? 'bg-emerald-400' : 'bg-zinc-400'}`}
              />
              {t('quests.landing.daily.button')}
            </button>
            <button
              onClick={() => setQuestView('weekly')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                questView === 'weekly'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full transition-colors ${questView === 'weekly' ? 'bg-blue-400' : 'bg-zinc-400'}`}
              />
              {t('quests.landing.weekly.button')}
            </button>
          </div>
        </div>

        {/* Quest Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-10rem)] pb-6">
          <div className="transition-all duration-300 ease-in-out">
            {questView === 'daily' ? (
              <TodaysQuests communityId={communityId} />
            ) : (
              <WeeklyQuests communityId={communityId} />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
