'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getMyCommunities } from '@/lib/services/communities';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';

interface CommunityProfileProps {
  communityId: string;
}

export default function CommunityProfile({ communityId }: CommunityProfileProps) {
  const { language } = LanguageStore();

  const { data: communitiesData, isPending } = useQuery({
    queryKey: ['my-communities', language],
    queryFn: () => getMyCommunities(language),
    staleTime: 5 * 60 * 1000,
  });

  if (isPending) {
    return (
      <Card className="border shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
          </div>
        </div>
      </Card>
    );
  }

  const communities = communitiesData?.body?.data;
  if (!Array.isArray(communities)) return null;

  const community = communities.find((c: any) => c.id === communityId);
  if (!community) return null;

  // Extract community member data
  const communityXp = community.totalXP || 0;
  const communityLevel = community.level || 1;
  const memberRole = community.userRole || 'MEMBER';

  return (
    <Card className="border shadow-sm bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                {t('community.profile.title')}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{community.name}</p>
            </div>
            <Badge variant={memberRole === 'ADMIN' ? 'default' : 'secondary'} className="shrink-0">
              {memberRole}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Community Level */}
            <div className="p-3 sm:p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  {t('community.profile.level')}
                </p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 font-numeric">
                {communityLevel}
              </p>
            </div>

            {/* Community XP */}
            <div className="p-3 sm:p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  {t('community.profile.xp')}
                </p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 font-numeric">
                {communityXp.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span>{t('community.profile.progress')}</span>
              <span className="font-numeric">
                {communityXp} / {(communityLevel + 1) * 100} XP
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                style={{
                  width: `${Math.min((communityXp / ((communityLevel + 1) * 100)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
