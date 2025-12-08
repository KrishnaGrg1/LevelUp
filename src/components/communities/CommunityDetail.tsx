'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Shield as ShieldIcon, Search, Settings, Info, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getClansByCommunity, checkClanMembership, type Clan } from '@/lib/services/clans';
import LanguageStore from '@/stores/useLanguage';
import CreateClanModal from '@/components/clans/CreateClanModal';
import { communityDetailById } from '@/lib/services/communities';
import MessageArea from './MessageArea';
import { ClanAccessDenied } from './ClanAccessDenied';
import authStore from '@/stores/useAuth';

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
  const filteredClans = clans.filter((clan: Clan) =>
    clan.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedClan =
    selectedView !== 'community' ? clans.find((c: Clan) => c.id === selectedView) : null;

  // Check clan membership BEFORE rendering MessageArea
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
    <div className="flex h-full lg:h-[calc(100vh-5rem)] bg-gray-100 dark:bg-gray-900 relative">
      {/* Left Sidebar - Clans List */}
      {(showMode === 'both' || showMode === 'clans-only') && (
        <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col lg:flex-shrink-0">
          {/* Community Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <ShieldIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                  {community?.name}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {community?._count?.members} members · {community?._count?.clans} clans
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs border-gray-300 dark:border-gray-600"
              >
                <Info className="h-3 w-3 mr-1" />
                Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs border-gray-300 dark:border-gray-600"
              >
                <Settings className="h-3 w-3 mr-1" />
                Settings
              </Button>
              <CreateClanModal communityId={communityId} />
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search clans..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
              />
            </div>
          </div>

          {/* Community Channel */}
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSelectedView('community')}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                selectedView === 'community'
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-l-2 border-blue-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <ShieldIcon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
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
          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 py-2">
              Available Clans
            </div>

            {isPending ? (
              <div className="space-y-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse p-2 rounded-lg bg-gray-100 dark:bg-gray-700 h-16"
                  />
                ))}
              </div>
            ) : filteredClans.length === 0 ? (
              <div className="text-center py-8 px-4">
                <ShieldIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">No clans found</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredClans.map((clan: Clan) => (
                  <button
                    key={clan.id}
                    onClick={() => setSelectedView(clan.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      selectedView === clan.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-l-2 border-blue-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          clan.isPrivate
                            ? 'bg-purple-100 dark:bg-purple-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                        }`}
                      >
                        <ShieldIcon
                          className={`h-5 w-5 ${
                            clan.isPrivate
                              ? 'text-purple-600 dark:text-purple-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
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
        <div className="flex-1 flex flex-col">
          {/* Show loading state while checking clan membership */}
          {selectedView !== 'community' && isCheckingMembership ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
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
