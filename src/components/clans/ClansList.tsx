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
    mutationFn: (clanId: string) => joinClan(language, clanId),
    onSuccess: () => {
      toast.success(t('clans.toast.joinedSuccess', language));
      queryClient.invalidateQueries({ queryKey: ['clans', communityId, language] });
      queryClient.invalidateQueries({ queryKey: ['all-clan-members', communityId] });
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black"
          >
            <CardHeader>
              <div className="animate-pulse">
                <div className="mb-3 h-6 w-32 rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="mb-2 h-4 w-20 rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border border-red-200 bg-white shadow-sm dark:border-red-900/40 dark:bg-black">
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
      <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Shield className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
            <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              {t('clans.noClan', language)}
            </h3>
            <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">
              {t('clans.noClansDescription', language)}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {clans.map((clan: Clan) => {
        const memberCount = clan.stats?.memberCount ?? 0;
        const battlesWon = clan.stats?.battlesWon ?? 0;
        const occupancy = clan.limit > 0 ? Math.round((memberCount / clan.limit) * 100) : 0;

        // Check if current user is a member of this clan
        const isMember = user ? clanMembersMap[clan.id]?.includes(user.id) : false;

        return (
          <Card
            key={clan.id}
            onClick={() => router.push(`/${language}/user/community/clan/${clan.id}`)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-black"
          >
            {/* Subtle top accent bar */}
            <div className="h-1 w-full bg-gray-900 dark:bg-gray-100" />

            <CardHeader className="px-4 pt-4 pb-3">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex flex-1 items-center gap-3">
                  {/* Privacy Icon */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-900 dark:border-gray-800 dark:bg-black dark:text-gray-100">
                    {clan.isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-white">
                      {clan.name}
                    </CardTitle>
                    {clan.slug && (
                      <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                        @{clan.slug}
                      </p>
                    )}
                  </div>
                </div>

                {/* XP Badge */}
                <div className="flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-1 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-300">
                  <Trophy className="h-3 w-3" />
                  <span className="text-xs font-semibold">{clan.xp}</span>
                </div>
              </div>

              {/* Description */}
              {clan.description && (
                <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {clan.description}
                </p>
              )}

              {/* Owner Info */}
              <div className="mb-3 flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                <Avatar className="h-6 w-6">
                  <AvatarImage src={clan.owner.profilePicture || undefined} />
                  <AvatarFallback className="text-xs">
                    {clan.owner.UserName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-xs text-gray-700 dark:text-gray-300">
                  {clan.owner.UserName}
                </span>
                {clan.owner.isVerified && (
                  <Shield
                    className="h-3 w-3 text-gray-900 dark:text-gray-100"
                    fill="currentColor"
                  />
                )}
              </div>
            </CardHeader>

            <CardContent className="px-4 pb-4">
              {/* Stats Grid */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-gray-300 bg-gray-100 p-2 dark:border-gray-700/50 dark:bg-gray-800/40">
                  <div className="mb-1 flex items-center gap-1">
                    <Users className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {t('clans.members', language)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {memberCount}/{clan.limit}
                  </p>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
                    <div
                      className="h-full bg-black transition-all duration-300 dark:bg-white"
                      style={{ width: `${occupancy}%` }}
                    ></div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-300 bg-gray-100 p-2 dark:border-gray-700/50 dark:bg-gray-800/40">
                  <div className="mb-1 flex items-center gap-1">
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
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-800 dark:bg-gray-900">
                  <p className="line-clamp-1 text-xs text-gray-700 italic dark:text-gray-300">
                    &quot;{clan.welcomeMessage}&quot;
                  </p>
                </div>
              )}

              {/* Join/Enter Button */}
              <button
                onClick={e => {
                  e.stopPropagation(); // Prevent navigation when clicking button
                  if (isMember) {
                    // Navigate to clan detail page
                    router.push(`/${language}/user/community/clan/${clan.id}`);
                  } else {
                    handleJoinClan(clan.id);
                  }
                }}
                disabled={!isMember && (memberCount >= clan.limit || joinMutation.isPending)}
                className={`mt-3 h-10 w-full rounded-lg text-sm font-semibold transition-colors ${
                  isMember
                    ? 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                    : memberCount >= clan.limit
                      ? 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                      : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                } disabled:opacity-60`}
              >
                {isMember
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
