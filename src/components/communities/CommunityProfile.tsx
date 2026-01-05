'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getCommunityMemberships } from '@/lib/services/ai';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';
import { computeLevelFromXp } from '@/lib/leveling';

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
      <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
        <div className="p-4 sm:p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
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
  const computed = computeLevelFromXp(communityXp);
  const communityLevel = memberProfile.level || computed.level;
  const communityName = memberProfile.community?.name || '';

  return (
    <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
      <div className="p-3 sm:p-4">
        <div className="space-y-3">
          {/* Header - More compact */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t('community.profile.title')}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{communityName}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Active</span>
            </div>
          </div>

          {/* Stats - Horizontal layout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Level */}
            <div className="flex-1 rounded-lg border border-gray-200 bg-white p-2.5 dark:border-gray-800 dark:bg-black">
              <div className="mb-0.5 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-100" />
                <p className="text-[10px] font-medium tracking-wide text-gray-600 uppercase dark:text-gray-400">
                  {t('community.profile.level')}
                </p>
              </div>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
                {communityLevel}
              </p>
            </div>

            {/* XP */}
            <div className="flex-1 rounded-lg border border-gray-200 bg-white p-2.5 dark:border-gray-800 dark:bg-black">
              <div className="mb-0.5 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-100" />
                <p className="text-[10px] font-medium tracking-wide text-gray-600 uppercase dark:text-gray-400">
                  {t('community.profile.xp')}
                </p>
              </div>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
                {communityXp.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress - Compact */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-wide text-gray-500 uppercase dark:text-gray-400">
                {t('community.profile.progress')}
              </span>
              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                {computed.maxLevelReached
                  ? t('community.profile.maxLevelReached', 'Max level reached')
                  : `${computed.xpIntoLevel.toLocaleString()} / ${computed.xpForNext.toLocaleString()} XP`}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <div
                className="h-full bg-gray-900 transition-all duration-500 dark:bg-gray-100"
                style={{
                  width: `${computed.maxLevelReached ? 100 : Math.min((computed.xpIntoLevel / computed.xpForNext) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
