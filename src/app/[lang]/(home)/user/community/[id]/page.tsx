'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import CommunityDetail from '@/components/communities/CommunityDetail';
import CommunityProfile from '@/components/communities/CommunityProfile';
import TodaysQuests from '@/components/landing/todaysQuests';
import WeeklyQuests from '@/components/landing/weeklyQuests';
import { t } from '@/translations';
import { MessageCircle, Target, User, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;
  const [questView, setQuestView] = useState<'daily' | 'weekly'>('daily');

  return (
    <>
      {/* Mobile Layout */}
      <Tabs
        defaultValue="chat"
        className="lg:hidden flex flex-col fixed inset-x-0 top-20 bottom-16"
      >
        <TabsList className="w-full grid grid-cols-4 h-12 rounded-none border-b bg-white dark:bg-zinc-900 flex-shrink-0">
          <TabsTrigger
            value="chat"
            className="flex flex-col items-center justify-center gap-0.5 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-950/30 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-[10px] font-medium">Chat</span>
          </TabsTrigger>
          <TabsTrigger
            value="quests"
            className="flex flex-col items-center justify-center gap-0.5 data-[state=active]:bg-emerald-50 dark:data-[state=active]:bg-emerald-950/30 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400"
          >
            <Target className="h-4 w-4" />
            <span className="text-[10px] font-medium">Quests</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="flex flex-col items-center justify-center gap-0.5 data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-950/30 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400"
          >
            <User className="h-4 w-4" />
            <span className="text-[10px] font-medium">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="clans"
            className="flex flex-col items-center justify-center gap-0.5 data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-indigo-950/30 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400"
          >
            <Shield className="h-4 w-4" />
            <span className="text-[10px] font-medium">Clans</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="chat"
          className="flex-1 overflow-hidden mt-0 bg-gray-100 dark:bg-gray-900"
        >
          <CommunityDetail communityId={communityId} showMode="chat-only" />
        </TabsContent>

        <TabsContent
          value="quests"
          className="flex-1 overflow-auto mt-0 p-3 bg-zinc-50 dark:bg-zinc-950"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-1 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-3">
            <div className="flex gap-1">
              <button
                onClick={() => setQuestView('daily')}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md font-medium text-sm transition-all duration-200 ${
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
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md font-medium text-sm transition-all duration-200 ${
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
          {questView === 'daily' ? (
            <TodaysQuests communityId={communityId} />
          ) : (
            <WeeklyQuests communityId={communityId} />
          )}
        </TabsContent>

        <TabsContent
          value="profile"
          className="flex-1 overflow-auto mt-0 p-3 bg-zinc-50 dark:bg-zinc-950"
        >
          <CommunityProfile communityId={communityId} />
        </TabsContent>

        <TabsContent
          value="clans"
          className="flex-1 overflow-hidden mt-0 bg-gray-100 dark:bg-gray-900"
        >
          <div className="h-full">
            <CommunityDetail communityId={communityId} showMode="clans-only" />
          </div>
        </TabsContent>
      </Tabs>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-row gap-3 sm:gap-4 h-[calc(100vh-5rem)]">
        <div className="flex-1 min-w-0 overflow-auto">
          <CommunityDetail communityId={communityId} />
        </div>

        <aside className="w-[380px] xl:w-[420px] flex-shrink-0 space-y-2.5 overflow-hidden flex flex-col">
          <CommunityProfile communityId={communityId} />

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

          <div className="flex-1 overflow-y-auto pb-4">
            {questView === 'daily' ? (
              <TodaysQuests communityId={communityId} />
            ) : (
              <WeeklyQuests communityId={communityId} />
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
