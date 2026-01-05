'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Shield as ShieldIcon, Search, Info, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getClansByCommunity, checkClanMembership, type Clan } from '@/lib/services/clans';
import LanguageStore from '@/stores/useLanguage';
import CreateClanModal from '@/components/clans/CreateClanModal';
import { communityDetailById } from '@/lib/services/communities';
import MessageArea from './MessageArea';
import { ClanAccessDenied } from './ClanAccessDenied';
import authStore from '@/stores/useAuth';
import { t } from '@/translations/index';
interface CommunityDetailProps {
  communityId: string;
  showMode?: 'both' | 'chat-only' | 'clans-only';
}

export default function CommunityDetail({ communityId, showMode = 'both' }: CommunityDetailProps) {
  const { language } = LanguageStore();
  const { user } = authStore();
  const [selectedView, setSelectedView] = useState<'community' | string>('community');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: communityData } = useQuery({
    queryKey: ['community-details', communityId, language],
    queryFn: () => communityDetailById(language, communityId),
  });

  const community = communityData?.body?.data;

  const { data, isPending } = useQuery({
    queryKey: ['clans', communityId, language],
    queryFn: () => getClansByCommunity(communityId, language),
    staleTime: 60000,
  });

  const clans = data?.body?.data || [];
  
  const filteredClansByMembership = clans.filter((clan: Clan) => {
    if (showMode === 'clans-only') return true;
    return clan.isMember === true;
  });
  
  const filteredClans = filteredClansByMembership.filter((clan: Clan) =>
    clan.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedClan =
    selectedView !== 'community' ? clans.find((c: Clan) => c.id === selectedView) : null;

  const { data: membershipData, isLoading: isCheckingMembership } = useQuery({
    queryKey: ['clan-membership', selectedView, user?.id],
    queryFn: async () => {
      if (selectedView === 'community' || !user?.id) return { isMember: true };
      return await checkClanMembership(user.id, selectedView);
    },
    enabled: !!selectedView && selectedView !== 'community',
    staleTime: 30000, // Cache for 30 seconds
  });

  return (
    <div className="relative flex h-full min-h-0 bg-white dark:bg-black">
      {/* Left Sidebar - Clans List */}
      {(showMode === 'both' || showMode === 'clans-only') && (
        <div className="flex w-full flex-col border-r border-gray-200 bg-white lg:w-96 lg:flex-shrink-0 dark:border-gray-800 dark:bg-black">
          {/* Community Header */}
          <div className="border-b border-gray-200 p-4 dark:border-gray-800">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black dark:bg-white">
                <ShieldIcon className="h-6 w-6 text-white dark:text-black" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold text-black dark:text-white">
                  {community?.name}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {community?._count?.members} members · {community?._count?.clans} clans
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 flex-1 border-gray-300 text-xs text-black hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
              >
                <Link
                  href={`/${language}/user/community/${communityId}/details`}
                  className="inline-flex items-center justify-center"
                >
                  <Info className="mr-1 h-3 w-3" />
                  Details
                </Link>
              </Button>
              <CreateClanModal communityId={communityId} />
            </div>
          </div>

          {/* Search */}
          <div className="border-b border-gray-200 p-3 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search clans..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-10 rounded-lg border-gray-200 bg-white pl-9 text-sm dark:border-gray-800 dark:bg-black"
              />
            </div>
          </div>

          {/* Community Channel */}
          <div className="border-b border-gray-200 px-3 py-2 dark:border-gray-800">
            <button
              onClick={() => setSelectedView('community')}
              className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                selectedView === 'community'
                  ? 'border-l-2 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
                  <ShieldIcon className="h-5 w-5 text-black dark:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {community?.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <Users className="h-3 w-3" />
                    {community?._count?.members} members
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Clans List */}
          <div className="flex-1 space-y-2 overflow-y-auto p-2">
            <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
              Available Clans
            </div>

            {isPending ? (
              <div className="space-y-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg bg-gray-100 p-2 dark:bg-gray-700"
                  />
                ))}
              </div>
            ) : filteredClans.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <ShieldIcon className="mx-auto mb-2 h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('clans:noClansFound')}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredClans.map((clan: Clan) => (
                  <button
                    key={clan.id}
                    onClick={() => setSelectedView(clan.id)}
                    className={`w-full rounded-lg p-2 text-left transition-colors ${
                      selectedView === clan.id
                        ? 'border-l-2 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
                        <ShieldIcon className="h-5 w-5 text-black dark:text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {clan.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <Users className="h-3 w-3" />
                          {clan.stats?.memberCount ?? 0} members
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content - Chat Area */}
      {(showMode === 'both' || showMode === 'chat-only') && (
        <div className="flex flex-1 flex-col">
          {/* Show loading state while checking clan membership */}
          {selectedView !== 'community' && isCheckingMembership ? (
            <div className="flex flex-1 items-center justify-center bg-white dark:bg-black">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-gray-700 dark:text-gray-300" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Checking access...</p>
              </div>
            </div>
          ) : selectedView !== 'community' && membershipData?.isMember === false ? (
            /* Show access denied if not a member */
            <ClanAccessDenied
              clanName={selectedClan?.name || 'this clan'}
              accessDeniedCode="NOT_MEMBER"
              onGoBack={() => setSelectedView('community')}
            />
          ) : (
            /* Show MessageArea only if member or community channel */
            <MessageArea
              communityId={selectedView === 'community' ? communityId : undefined}
              clanId={selectedView !== 'community' ? selectedView : undefined}
              viewType={selectedView === 'community' ? 'community' : 'clan'}
              viewName={
                selectedView === 'community' ? community?.name || '' : selectedClan?.name || ''
              }
              memberCount={
                selectedView === 'community'
                  ? community?._count?.members || 0
                  : selectedClan?.stats?.memberCount || 0
              }
              isPrivate={selectedView !== 'community' ? selectedClan?.isPrivate : false}
            />
          )}
        </div>
      )}
    </div>
  );
}
