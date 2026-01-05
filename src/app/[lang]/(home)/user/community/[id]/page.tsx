'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import CommunityDetail from '@/components/communities/CommunityDetail';
import CommunityProfile from '@/components/communities/CommunityProfile';
import CommunityLeaderboard from '@/components/communities/CommunityLeaderboard';
import TodaysQuests from '@/components/landing/todaysQuests';
import WeeklyQuests from '@/components/landing/weeklyQuests';
import { t } from '@/translations';
import { MessageCircle, Target, User, Shield, Trophy, Settings, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LanguageStore from '@/stores/useLanguage';
import { communityDetailById } from '@/lib/services/communities';
import ClansList from '@/components/clans/ClansList';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;
  const [questView, setQuestView] = useState<'daily' | 'weekly'>('daily');
  const { language } = LanguageStore();

  const { data: communityData, isPending: isCommunityPending } = useQuery({
    queryKey: ['community-details', communityId, language],
    queryFn: () => communityDetailById(language, communityId),
    enabled: !!communityId,
    staleTime: 30000,
  });

  const community = communityData?.body?.data;

  return (
    <>
      {/* Mobile Layout */}
      <Tabs
        defaultValue="chat"
        className="fixed inset-x-0 top-20 bottom-16 flex flex-col lg:hidden"
      >
        <TabsList className="grid h-12 w-full flex-shrink-0 grid-cols-5 rounded-none border-b bg-white dark:bg-black">
          <TabsTrigger
            value="chat"
            className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:bg-gray-100 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-[10px] font-medium">Chat</span>
          </TabsTrigger>
          <TabsTrigger
            value="quests"
            className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:bg-gray-100 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            <Target className="h-4 w-4" />
            <span className="text-[10px] font-medium">Quests</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:bg-gray-100 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            <User className="h-4 w-4" />
            <span className="text-[10px] font-medium">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="clans"
            className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:bg-gray-100 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            <Shield className="h-4 w-4" />
            <span className="text-[10px] font-medium">Clans</span>
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:bg-gray-100 hover:text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            <Trophy className="h-4 w-4" />
            <span className="text-[10px] font-medium">Leaderboard</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-0 flex-1 overflow-hidden bg-white dark:bg-black">
          <CommunityDetail communityId={communityId} showMode="chat-only" />
        </TabsContent>

        <TabsContent
          value="quests"
          className="mt-0 flex-1 overflow-auto bg-white p-3 dark:bg-black"
        >
          <div className="mb-3 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-black">
            <div className="flex gap-1">
              <button
                onClick={() => setQuestView('daily')}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  questView === 'daily'
                    ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
                }`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${questView === 'daily' ? 'bg-emerald-400' : 'bg-zinc-400'}`}
                />
                {t('quests.landing.daily.button')}
              </button>
              <button
                onClick={() => setQuestView('weekly')}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  questView === 'weekly'
                    ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
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
          className="mt-0 flex-1 overflow-auto bg-white p-3 dark:bg-black"
        >
          <div className="space-y-3">
            <CommunityProfile communityId={communityId} />
            <CommunityLeaderboard communityId={communityId} />
          </div>
        </TabsContent>

        <TabsContent value="clans" className="mt-0 flex-1 overflow-hidden bg-white dark:bg-black">
          <div className="h-full">
            <CommunityDetail communityId={communityId} showMode="clans-only" />
          </div>
        </TabsContent>

        <TabsContent
          value="leaderboard"
          className="mt-0 flex-1 overflow-auto bg-white p-3 dark:bg-black"
        >
          <CommunityLeaderboard communityId={communityId} />
        </TabsContent>
      </Tabs>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Hub Header */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
                  <Shield className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {isCommunityPending ? 'Loading…' : (community?.name ?? 'Community')}
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {(community?._count?.members ?? 0).toLocaleString()} members
                    </span>
                    <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <span className="inline-flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5" />
                      {(community?._count?.clans ?? 0).toLocaleString()} clans
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                asChild
                className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                <Link
                  href={`/${language}/user/community/${communityId}/settings`}
                  className="inline-flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>

          {/* Hub Body */}
          <div className="grid min-h-[calc(100vh-14rem)] grid-cols-12 gap-4">
            <div className="col-span-12 flex min-h-0 flex-col xl:col-span-8">
              <Tabs defaultValue="chat" className="flex min-h-0 flex-col">
                <TabsList className="grid h-11 w-full flex-shrink-0 grid-cols-4 rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
                  <TabsTrigger
                    value="chat"
                    className="text-sm data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  >
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" /> Chat
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="quests"
                    className="text-sm data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Target className="h-4 w-4" /> Quests
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="clans"
                    className="text-sm data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Clans
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="leaderboard"
                    className="text-sm data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Trophy className="h-4 w-4" /> Leaderboard
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="mt-3 min-h-0 flex-1">
                  <div className="h-full min-h-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
                    <CommunityDetail communityId={communityId} />
                  </div>
                </TabsContent>

                <TabsContent value="quests" className="mt-3">
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-black">
                    <div className="mb-3 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-black">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setQuestView('daily')}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            questView === 'daily'
                              ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full transition-colors ${questView === 'daily' ? 'bg-emerald-400' : 'bg-zinc-400'}`}
                          />
                          {t('quests.landing.daily.button')}
                        </button>
                        <button
                          onClick={() => setQuestView('weekly')}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            questView === 'weekly'
                              ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
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
                  </div>
                </TabsContent>

                <TabsContent value="clans" className="mt-3">
                  <ClansList communityId={communityId} />
                </TabsContent>

                <TabsContent value="leaderboard" className="mt-3">
                  <CommunityLeaderboard communityId={communityId} />
                </TabsContent>
              </Tabs>
            </div>

            <aside className="col-span-12 flex min-h-0 flex-col gap-4 xl:col-span-4">
              <CommunityProfile communityId={communityId} />
              <div>
                <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
                  <div className="p-4">
                    <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      At a glance
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Default tab</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Chat</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Use the tabs to switch between chat, quests, clans, and leaderboard.
                    </p>
                  </div>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
