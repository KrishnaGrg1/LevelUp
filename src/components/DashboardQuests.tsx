'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from '@/translations';
import LanguageStore from '@/stores/useLanguage';
import { fetchDailyQuests, fetchWeeklyQuests, completeQuest, type Quest } from '@/lib/services/ai';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import authStore from '@/stores/useAuth';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getMyCommunities } from '@/lib/services/communities';

interface GroupedQuests {
  [communityId: string]: {
    communityName: string;
    quests: Quest[];
  };
}

const QuestCard: React.FC<{
  quest: Quest;
  onComplete: (questId: string) => void;
  isCompleting: boolean;
  type: 'daily' | 'weekly';
}> = ({ quest, onComplete, isCompleting, type }) => {
  const colorClass =
    type === 'daily'
      ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400'
      : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400';

  return (
    <Card className="border shadow-sm transition-all hover:shadow-md">
      <div className="p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-2 sm:gap-3">
          <p className="flex-1 text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug">
            {quest.description}
          </p>
          <div
            className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg border ${colorClass}`}
          >
            <span className="text-sm font-bold font-numeric">{quest.xpValue}</span>
            <span className="text-xs font-medium">XP</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-numeric">
            Quest #{quest.periodSeq}
          </span>
          <Button
            size="sm"
            disabled={quest.isCompleted || isCompleting}
            onClick={() => onComplete(quest.id)}
            className={`w-full sm:w-auto font-medium py-2 px-4 rounded-lg transition-all duration-200 text-xs ${
              quest.isCompleted
                ? 'bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20 cursor-default border-green-200 dark:border-green-800 disabled:opacity-50 disabled:cursor-not-allowed'
                : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm'
            }`}
          >
            {quest.isCompleted ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {t('quests.landing.completed')}
              </span>
            ) : (
              t('quests.landing.markComplete')
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CommunityQuestSection: React.FC<{
  communityId: string;
  communityName: string;
  quests: Quest[];
  onComplete: (questId: string) => void;
  isCompleting: boolean;
  type: 'daily' | 'weekly';
}> = ({ communityName, quests, onComplete, isCompleting, type }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors rounded-t-lg touch-manipulation"
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 dark:text-zinc-400 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 dark:text-zinc-400 shrink-0" />
          )}
          <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {communityName}
          </h3>
          <span className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {quests.length}{' '}
            {quests.length === 1 ? t('quests.dashboard.quest') : t('quests.dashboard.quests')}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3">
          {quests.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={onComplete}
              isCompleting={isCompleting}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function DashboardQuests() {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();
  const { setTokens } = authStore();

  const { data: communitiesData } = useQuery({
    queryKey: ['my-communities', language],
    queryFn: () => getMyCommunities(language),
    staleTime: 5 * 60 * 1000,
  });

  const { data: dailyData, isPending: isDailyPending } = useQuery({
    queryKey: ['ai-daily-quests', language],
    queryFn: () => fetchDailyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const { data: weeklyData, isPending: isWeeklyPending } = useQuery({
    queryKey: ['ai-weekly-quests', language],
    queryFn: () => fetchWeeklyQuests(language),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  const completeMutation = useMutation({
    mutationFn: (questId: string) => completeQuest(questId, language),
    onSuccess: response => {
      const { xpAwarded, currentLevel, tokensAwarded, currentTokens, communityXp, communityId } =
        response.body.data;
      const communityMap = new Map<string, string>();
      const communities = communitiesData?.body?.data;
      if (Array.isArray(communities)) {
        communities.forEach((community: { id: string; name: string }) => {
          communityMap.set(community.id, community.name);
        });
      }

      let description = `+${xpAwarded} XP (Global) • +${tokensAwarded} Tokens • Level ${currentLevel}`;
      if (communityXp !== undefined && communityId) {
        const communityName = communityMap.get(communityId) || communityId;
        description = `+${xpAwarded} XP (Global) • +${xpAwarded} XP (${communityName}) • +${tokensAwarded} Tokens • Level ${currentLevel}`;
      }

      toast.success(t('quests.landing.questCompleted'), {
        description,
      });
      if (typeof currentTokens === 'number') {
        setTokens(currentTokens);
      }
      queryClient.invalidateQueries({ queryKey: ['ai-daily-quests', language] });
      queryClient.invalidateQueries({ queryKey: ['ai-weekly-quests', language] });
      queryClient.invalidateQueries({ queryKey: ['my-communities', language] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error(t('quests.landing.questCompleteFailed'), {
        description: err?.response?.data?.body?.message || t('quests.details.errors.tryAgain'),
      });
    },
  });

  const handleComplete = (questId: string) => {
    completeMutation.mutate(questId);
  };

  // Build community ID to name map
  const communityMap = new Map<string, string>();
  const communities = communitiesData?.body?.data;
  if (Array.isArray(communities)) {
    communities.forEach((community: { id: string; name: string }) => {
      communityMap.set(community.id, community.name);
    });
  }

  // Group daily quests by community
  const dailyQuests = dailyData?.body?.data?.today ?? [];
  const groupedDaily: GroupedQuests = {};
  dailyQuests.forEach(quest => {
    if (!groupedDaily[quest.communityId]) {
      groupedDaily[quest.communityId] = {
        communityName: communityMap.get(quest.communityId) || quest.communityId,
        quests: [],
      };
    }
    groupedDaily[quest.communityId].quests.push(quest);
  });

  // Group weekly quests by community
  const weeklyQuests = weeklyData?.body?.data?.thisWeek ?? [];
  const groupedWeekly: GroupedQuests = {};
  weeklyQuests.forEach(quest => {
    if (!groupedWeekly[quest.communityId]) {
      groupedWeekly[quest.communityId] = {
        communityName: communityMap.get(quest.communityId) || quest.communityId,
        quests: [],
      };
    }
    groupedWeekly[quest.communityId].quests.push(quest);
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Daily Quests */}
      <Card className="border shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <h2 className="font-heading text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {t('quests.landing.daily.title')}
            </h2>
          </div>

          {isDailyPending ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.landing.loading')}
                </p>
              </div>
            </div>
          ) : Object.keys(groupedDaily).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {t('quests.landing.noQuests')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedDaily).map(([communityId, data]) => (
                <CommunityQuestSection
                  key={communityId}
                  communityId={communityId}
                  communityName={data.communityName}
                  quests={data.quests}
                  onComplete={handleComplete}
                  isCompleting={completeMutation.isPending}
                  type="daily"
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Weekly Quests */}
      <Card className="border shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <h2 className="font-heading text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {t('quests.landing.weekly.title')}
            </h2>
          </div>

          {isWeeklyPending ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('quests.landing.loading')}
                </p>
              </div>
            </div>
          ) : Object.keys(groupedWeekly).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {t('quests.landing.noQuests')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedWeekly).map(([communityId, data]) => (
                <CommunityQuestSection
                  key={communityId}
                  communityId={communityId}
                  communityName={data.communityName}
                  quests={data.quests}
                  onComplete={handleComplete}
                  isCompleting={completeMutation.isPending}
                  type="weekly"
                />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
