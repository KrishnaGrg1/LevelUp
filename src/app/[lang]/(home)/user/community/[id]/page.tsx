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
import ClansList from '@/components/clans/ClansList';

import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';

import { MessageCircle, Target, Shield, Trophy, Users, Settings, Loader2 } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;
  const { language } = LanguageStore();
  const [questView] = useState<'daily' | 'weekly'>('daily');

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
      {/* HEADER */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
              <AvatarImage src={community?.photo} />
              <AvatarFallback>{community?.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold sm:text-base">{community?.name}</h1>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Users className="h-3 w-3" />
                {community?._count?.members || 0} members
              </div>
            </div>
          </div>

          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT CHAT */}
        <aside className="hidden w-[360px] border-r bg-white dark:bg-zinc-900 md:flex">
          <MessageArea
            communityId={communityId}
            viewType="community"
            viewName={community?.name || 'Community'}
            memberCount={community?._count?.members || 0}
          />
        </aside>

        {/* RIGHT CONTENT */}
        <main className="flex flex-1 flex-col">
          <Tabs defaultValue="quests" className="flex flex-1 flex-col overflow-hidden">
            {/* TAB BAR */}
            <TabsList className="mx-2 mt-2 w-fit gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900 sm:mx-4 sm:mt-4">
              {/* CHAT (MOBILE) */}
              <TabsTrigger value="chat" className="group gap-2 md:hidden">
                <MessageCircle className="h-4 w-4" />
                <span
                  className="
                    max-w-0 overflow-hidden whitespace-nowrap
                    opacity-0 transition-all duration-300
                    group-data-[state=active]:max-w-[120px]
                    group-data-[state=active]:opacity-100
                  "
                >
                  {t('community.tabs.chat')}
                </span>
              </TabsTrigger>

              {/* QUESTS */}
              <TabsTrigger value="quests" className="group gap-2">
                <Target className="h-4 w-4" />
                <span
                  className="
                    max-w-0 overflow-hidden whitespace-nowrap
                    opacity-0 transition-all duration-300
                    group-data-[state=active]:max-w-[120px]
                    group-data-[state=active]:opacity-100
                  "
                >
                  {t('community.tabs.quests')}
                </span>
              </TabsTrigger>

              {/* CLANS */}
              <TabsTrigger value="clans" className="group gap-2">
                <Shield className="h-4 w-4" />
                <span
                  className="
                    max-w-0 overflow-hidden whitespace-nowrap
                    opacity-0 transition-all duration-300
                    group-data-[state=active]:max-w-[120px]
                    group-data-[state=active]:opacity-100
                  "
                >
                  {t('community.tabs.clans')}
                </span>
              </TabsTrigger>

              {/* LEADERBOARD */}
              <TabsTrigger value="leaderboard" className="group gap-2">
                <Trophy className="h-4 w-4" />
                <span
                  className="
                    max-w-0 overflow-hidden whitespace-nowrap
                    opacity-0 transition-all duration-300
                    group-data-[state=active]:max-w-[160px]
                    group-data-[state=active]:opacity-100
                  "
                >
                  {t('community.tabs.leaderboard')}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* MOBILE CHAT */}
            <TabsContent value="chat" className="flex-1 md:hidden">
              <MessageArea
                communityId={communityId}
                viewType="community"
                viewName={community?.name || 'Community'}
                memberCount={community?._count?.members || 0}
              />
            </TabsContent>

            {/* QUESTS */}
            <TabsContent value="quests" className="flex-1 overflow-auto p-4">
              {questView === 'daily' ? (
                <TodaysQuests communityId={communityId} />
              ) : (
                <WeeklyQuests communityId={communityId} />
              )}
            </TabsContent>

            {/* CLANS */}
            <TabsContent value="clans" className="flex-1 overflow-auto p-4">
              <ClansList communityId={communityId} />
            </TabsContent>

            {/* LEADERBOARD */}
            <TabsContent value="leaderboard" className="flex-1 overflow-auto p-4">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <CommunityLeaderboard communityId={communityId} />
                </div>
                <CommunityProfile communityId={communityId} />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
