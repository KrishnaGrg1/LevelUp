'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getClansByCommunity, joinClan, getClanMembers, type Clan } from '@/lib/services/clans';
import LanguageStore from '@/stores/useLanguage';
import { useAuth } from '@/hooks/use-auth';
import { t } from '@/translations/index';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Lock, Globe, Crown, Trophy, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ClansListProps {
  communityId: string;
}

export default function ClansList({ communityId }: ClansListProps) {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuth(language);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['clans', communityId, language],
    queryFn: () => getClansByCommunity(communityId, language),
    staleTime: 60000,
    gcTime: 300000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const clans = data?.body?.data || [];

  // Fetch members for all clans to check if user is a member
  const clanMembersQueries = useQuery({
    queryKey: ['all-clan-members', communityId, language],
    queryFn: async () => {
      if (!clans.length) return {};
      const membersMap: Record<string, string[]> = {};

      await Promise.all(
        clans.map(async clan => {
          try {
            const response = await getClanMembers(clan.id, language);
            const members = response?.body?.data || [];
            membersMap[clan.id] = members.map(m => m.userId);
          } catch {
            membersMap[clan.id] = [];
          }
        }),
      );

      return membersMap;
    },
    enabled: clans.length > 0 && !!user,
    staleTime: 60000,
  });

  const clanMembersMap = clanMembersQueries.data || {};

  const joinMutation = useMutation({
    mutationFn: (clanId: string) => joinClan(clanId, language),
    onSuccess: () => {
      toast.success(t('clans.toast.joinedSuccess', language));
      queryClient.invalidateQueries({ queryKey: ['clans', communityId, language] });
      queryClient.invalidateQueries({ queryKey: ['all-clan-members', communityId, language] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('clans.toast.joinFailed', language));
    },
  });

  const handleJoinClan = (clanId: string) => {
    joinMutation.mutate(clanId);
  };

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="border-blue-500/20 bg-blue-500/5 dark:border-blue-400/20 dark:bg-blue-400/5"
          >
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-6 bg-blue-300/30 dark:bg-blue-600/30 rounded w-32 mb-3"></div>
                <div className="h-4 bg-blue-300/30 dark:bg-blue-600/30 rounded w-20 mb-2"></div>
                <div className="h-4 bg-blue-300/30 dark:bg-blue-600/30 rounded w-28"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-blue-300/30 dark:bg-blue-600/30 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-500/20 bg-red-500/5 dark:border-red-400/20 dark:bg-red-400/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <Shield className="h-5 w-5" />
            <div>
              <h3 className="font-semibold">{t('clans.errorLoadingClans', language)}</h3>
              <p className="text-sm text-red-500 dark:text-red-300">
                {error instanceof Error ? error.message : t('clans.unknownError', language)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (clans.length === 0) {
    return (
      <Card className="border-blue-500/20 bg-blue-500/5 dark:border-blue-400/20 dark:bg-blue-400/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Shield className="h-16 w-16 text-blue-400/50 dark:text-blue-300/50 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('clans.noClan', language)}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              {t('clans.noClansDescription', language)}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clans.map((clan: Clan) => {
        const memberCount = clan.stats?.memberCount ?? 0;
        const battlesWon = clan.stats?.battlesWon ?? 0;
        const occupancy = clan.limit > 0 ? Math.round((memberCount / clan.limit) * 100) : 0;

        // Check if current user is a member or admin of this clan
        const isMember = user ? clanMembersMap[clan.id]?.includes(user.id) : false;
        const isAdmin = user ? clan.owner.id === user.id : false;
        const canEnter = isMember || isAdmin;

        return (
          <Card
            key={clan.id}
            onClick={() => router.push(`/${language}/user/community/clan/${clan.id}`)}
            className={`relative rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${
              clan.isPrivate
                ? 'border border-purple-500/30 bg-gradient-to-br from-purple-100/50 via-white to-purple-50/50 hover:border-purple-400/70 dark:from-purple-950/30 dark:via-gray-900/50 dark:to-gray-900/30 dark:hover:border-purple-400/50'
                : 'border border-cyan-500/30 bg-gradient-to-br from-cyan-100/50 via-white to-cyan-50/50 hover:border-cyan-400/70 dark:from-cyan-950/30 dark:via-gray-900/50 dark:to-gray-900/30 dark:hover:border-cyan-400/50'
            }`}
          >
            {/* Top accent bar */}
            <div
              className={`h-1 w-full ${
                clan.isPrivate
                  ? 'bg-gradient-to-r from-purple-500/50 via-purple-400/50 to-pink-500/50'
                  : 'bg-gradient-to-r from-cyan-500/50 via-blue-400/50 to-teal-500/50'
              }`}
            ></div>

            <CardHeader className="pb-3 px-4 pt-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  {/* Privacy Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
                      clan.isPrivate
                        ? 'bg-gradient-to-br from-purple-200/40 to-pink-200/40 text-purple-600 group-hover:shadow-purple-300/30 dark:from-purple-600/20 dark:to-pink-600/20 dark:text-purple-300 dark:group-hover:shadow-purple-500/30'
                        : 'bg-gradient-to-br from-cyan-200/40 to-blue-200/40 text-cyan-600 group-hover:shadow-cyan-300/30 dark:from-cyan-600/20 dark:to-blue-600/20 dark:text-cyan-300 dark:group-hover:shadow-cyan-500/30'
                    }`}
                  >
                    {clan.isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-white transition-colors truncate">
                      {clan.name}
                    </CardTitle>
                    {clan.slug && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        @{clan.slug}
                      </p>
                    )}
                  </div>
                </div>

                {/* XP Badge */}
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40">
                  <Trophy className="h-3 w-3" />
                  <span className="text-xs font-semibold">{clan.xp}</span>
                </div>
              </div>

              {/* Description */}
              {clan.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {clan.description}
                </p>
              )}

              {/* Owner Info */}
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                <Avatar className="h-6 w-6">
                  <AvatarImage src={clan.owner.profilePicture || undefined} />
                  <AvatarFallback className="text-xs">
                    {clan.owner.UserName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                  {clan.owner.UserName}
                </span>
                {clan.owner.isVerified && (
                  <Shield
                    className="h-3 w-3 text-blue-500 dark:text-blue-400"
                    fill="currentColor"
                  />
                )}
              </div>
            </CardHeader>

            <CardContent className="px-4 pb-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-100 dark:bg-gray-800/40 rounded-lg p-2 border border-gray-300 dark:border-gray-700/50">
                  <div className="flex items-center gap-1 mb-1">
                    <Users className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {t('clans.members', language)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {memberCount}/{clan.limit}
                  </p>
                  <div className="mt-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        clan.isPrivate ? 'bg-purple-500' : 'bg-cyan-500'
                      } transition-all duration-300`}
                      style={{ width: `${occupancy}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800/40 rounded-lg p-2 border border-gray-300 dark:border-gray-700/50">
                  <div className="flex items-center gap-1 mb-1">
                    <Trophy className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {t('clans.victories', language)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {battlesWon}
                  </p>
                </div>
              </div>

              {/* Welcome Message */}
              {clan.welcomeMessage && (
                <div className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-2 border border-blue-300/50 dark:border-blue-500/20">
                  <p className="text-xs text-gray-700 dark:text-gray-300 italic line-clamp-1">
                    &quot;{clan.welcomeMessage}&quot;
                  </p>
                </div>
              )}

              {/* Join/Enter Button */}
              <button
                onClick={e => {
                  e.stopPropagation(); // Prevent navigation when clicking button
                  if (canEnter) {
                    // Navigate to clan detail page
                    router.push(`/${language}/clan/${clan.id}`);
                  } else {
                    handleJoinClan(clan.id);
                  }
                }}
                disabled={!canEnter && (memberCount >= clan.limit || joinMutation.isPending)}
                className={`w-full mt-3 ${
                  canEnter
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
                    : memberCount >= clan.limit
                      ? 'bg-gray-500 cursor-not-allowed'
                      : clan.isPrivate
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
                } text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {canEnter
                  ? t('clans.enterClan', language)
                  : joinMutation.isPending
                    ? t('clans.joining', language)
                    : memberCount >= clan.limit
                      ? t('clans.full', language)
                      : t('clans.joinClan', language)}
              </button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
