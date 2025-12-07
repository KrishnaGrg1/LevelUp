'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getCommunityMemberships } from '@/lib/services/ai';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';

interface CommunityProfileProps {
  communityId: string;
}

export default function CommunityProfile({ communityId }: CommunityProfileProps) {
  const { language } = LanguageStore();

  const { data: membershipsData, isPending } = useQuery({
    queryKey: ['community-memberships', language],
    queryFn: () => getCommunityMemberships(language),
    staleTime: 60 * 1000, // 1 minute - refresh more frequently for XP updates
    refetchOnWindowFocus: true,
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

  const memberships = membershipsData?.body?.data?.memberships || [];
  const memberProfile = memberships.find(m => m.communityId === communityId);

  if (!memberProfile) return null;

  // Extract community member data
  const communityXp = memberProfile.totalXP || 0;
  const communityLevel = memberProfile.level || 1;
  const communityName = memberProfile.community?.name || '';

  return (
    <Card className="border shadow-sm bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-zinc-900 dark:to-zinc-900/80">
      <div className="p-3 sm:p-4">
        <div className="space-y-3">
          {/* Header - More compact */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {t('community.profile.title')}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">{communityName}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Active</span>
            </div>
          </div>

          {/* Stats - Horizontal layout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Level */}
            <div className="flex-1 p-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-900/50">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium uppercase tracking-wide">
                  {t('community.profile.level')}
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {communityLevel}
              </p>
            </div>

            {/* XP */}
            <div className="flex-1 p-2.5 rounded-lg bg-white dark:bg-zinc-800 border border-purple-200 dark:border-purple-900/50">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium uppercase tracking-wide">
                  {t('community.profile.xp')}
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                {communityXp.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress - Compact */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                {t('community.profile.progress')}
              </span>
              <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                {communityXp} / {(communityLevel + 1) * 100} XP
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 transition-all duration-500"
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
