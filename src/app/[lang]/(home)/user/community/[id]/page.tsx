'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import CommunityDetail from '@/components/communities/CommunityDetail';
import CommunityProfile from '@/components/communities/CommunityProfile';
import TodaysQuests from '@/components/landing/todaysQuests';
import WeeklyQuests from '@/components/landing/weeklyQuests';
import { t } from '@/translations';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;
  const [questView, setQuestView] = useState<'daily' | 'weekly'>('daily');

  return (
    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 h-[calc(100vh-5rem)]">
      {/* Main Community Area - Takes priority space */}
      <div className="flex-1 min-w-0 overflow-auto">
        <CommunityDetail communityId={communityId} />
      </div>

      {/* Quests Sidebar - Fixed width on large screens, full width on mobile */}
      <aside className="lg:w-[380px] xl:w-[420px] flex-shrink-0 space-y-2.5 overflow-hidden flex flex-col">
        {/* Community Profile - Shows user's XP and level in this community */}
        <CommunityProfile communityId={communityId} />
        {/* Quest Toggle Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-1 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="flex gap-1">
            <button
              onClick={() => setQuestView('daily')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-medium text-xs transition-all duration-200 ${
                questView === 'daily'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <div
                className={`h-1 w-1 rounded-full transition-colors ${questView === 'daily' ? 'bg-emerald-400' : 'bg-zinc-400'}`}
              />
              {t('quests.landing.daily.button')}
            </button>
            <button
              onClick={() => setQuestView('weekly')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-medium text-xs transition-all duration-200 ${
                questView === 'weekly'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <div
                className={`h-1 w-1 rounded-full transition-colors ${questView === 'weekly' ? 'bg-blue-400' : 'bg-zinc-400'}`}
              />
              {t('quests.landing.weekly.button')}
            </button>
          </div>
        </div>

        {/* Quest Content */}
        <div className="flex-1 overflow-y-auto pb-4">
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
