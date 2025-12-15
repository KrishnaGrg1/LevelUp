'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { communityDetailById } from '@/lib/services/communities';
import CommunityProfile from '@/components/communities/CommunityProfile';
import CommunityLeaderboard from '@/components/communities/CommunityLeaderboard';
import TodaysQuests from '@/components/landing/todaysQuests';
import WeeklyQuests from '@/components/landing/weeklyQuests';
import MessageArea from '@/components/communities/MessageArea';
import LanguageStore from '@/stores/useLanguage';
import { MessageCircle, Target, Shield, Trophy, Users, Settings, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import ClansList from '@/components/clans/ClansList';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;
  const { language } = LanguageStore();
  const [questView, setQuestView] = useState<'daily' | 'weekly'>('daily');

  const { data: communityData, isPending } = useQuery({
    queryKey: ['community-details', communityId, language],
    queryFn: () => communityDetailById(language, communityId),
  });

  const community = communityData?.body?.data;

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header Bar */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-3 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:px-6 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0 border-2 border-blue-200 dark:border-blue-800 sm:h-10 sm:w-10">
              <AvatarImage src={community?.photo} alt={community?.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white sm:text-sm">
                {community?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-bold text-zinc-900 dark:text-white sm:text-lg">
                {community?.name}
              </h1>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 dark:text-zinc-400 sm:gap-2 sm:text-xs">
                <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="truncate">{community?._count?.members || 0} members</span>
                <span className="text-zinc-400">•</span>
                <span>{community?._count?.clans || 0} clans</span>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 sm:h-9 sm:w-9">
            <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="chat" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="mx-3 mt-2 mb-0 grid w-auto grid-cols-4 gap-0.5 rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-900 sm:mx-6 sm:mt-4 sm:gap-1 sm:p-1">
          <TabsTrigger
            value="chat"
            className="flex items-center justify-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800 sm:gap-2 sm:text-sm"
          >
            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger
            value="quests"
            className="flex items-center justify-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800 sm:gap-2 sm:text-sm"
          >
            <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Quests</span>
          </TabsTrigger>
          <TabsTrigger
            value="clans"
            className="flex items-center justify-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800 sm:gap-2 sm:text-sm"
          >
            <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Clans</span>
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="flex items-center justify-center gap-1.5 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800 sm:gap-2 sm:text-sm"
          >
            <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Leaderboard</span>
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent
          value="chat"
          className="data-[state=active]:flex mt-0 flex-1 overflow-hidden p-2 sm:p-4"
        >
          <div className="flex flex-1 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <MessageArea
              communityId={communityId}
              viewType="community"
              viewName={community?.name || 'Community'}
              memberCount={community?._count?.members || 0}
            />
          </div>
        </TabsContent>

        {/* Quests Tab */}
        <TabsContent
          value="quests"
          className="data-[state=active]:flex mt-0 flex-1 flex-col overflow-hidden p-2 sm:p-4"
        >
          <div className="mx-auto flex h-full w-full max-w-7xl flex-col space-y-3 sm:space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white sm:text-2xl">
                  Community Quests
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
                  Complete quests to earn XP and level up
                </p>
              </div>

              <div className="flex gap-1 rounded-lg border border-zinc-200 bg-white p-0.5 dark:border-zinc-800 dark:bg-zinc-900 sm:gap-2 sm:p-1">
                <button
                  onClick={() => setQuestView('daily')}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                    questView === 'daily'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setQuestView('weekly')}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                    questView === 'weekly'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              {questView === 'daily' ? (
                <TodaysQuests communityId={communityId} />
              ) : (
                <WeeklyQuests communityId={communityId} />
              )}
            </div>
          </div>
        </TabsContent>

        {/* Clans Tab */}
        <TabsContent
          value="clans"
          className="data-[state=active]:flex mt-0 flex-1 flex-col overflow-hidden p-2 sm:p-4"
        >
          <div className="mx-auto flex h-full w-full max-w-7xl flex-col space-y-3 sm:space-y-4">
            <div className="mb-2 sm:mb-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white sm:text-2xl">
                Community Clans
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
                Join a clan to collaborate and compete with others
              </p>
            </div>

            <div className="flex-1 overflow-auto">
              <ClansList communityId={communityId} />
            </div>
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent
          value="leaderboard"
          className="data-[state=active]:flex mt-0 flex-1 flex-col overflow-hidden p-2 sm:p-4"
        >
          <div className="mx-auto flex h-full w-full max-w-7xl flex-col space-y-3 sm:space-y-4">
            <div className="mb-2 sm:mb-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white sm:text-2xl">
                Leaderboard
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
                Top members ranked by XP in this community
              </p>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="grid gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
                <div className="lg:col-span-2">
                  <CommunityLeaderboard communityId={communityId} />
                </div>
                <div>
                  <CommunityProfile communityId={communityId} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
