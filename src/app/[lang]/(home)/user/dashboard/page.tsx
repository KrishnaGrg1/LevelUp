'use client';

import { useQuery } from '@tanstack/react-query';
import CommunitiesSection from '@/components/communities/communityCard';
import StatsSummary from '@/components/landing/statsSummary';
import DashboardQuests from '@/components/DashboardQuests';
import { getMyCommunities } from '@/lib/services/communities';
import { fetchDailyQuests } from '@/lib/services/ai';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = authStore();
  const { language } = LanguageStore();

  const { data: communities } = useQuery({
    queryKey: ['my-communities', language],
    queryFn: () => getMyCommunities(language),
    staleTime: 60000,
  });

  const { data: dailyQuests } = useQuery({
    queryKey: ['daily-quests', language],
    queryFn: () => fetchDailyQuests(language),
    staleTime: 60000,
  });

  // Calculate stats from fetched data
  const stats = {
    totalLevel: user?.level ?? 0,
    communities: communities?.body?.data?.length ?? 0,
    questsDone:
      (dailyQuests?.body?.data?.today?.filter(q => q.isCompleted).length ?? 0) +
      (dailyQuests?.body?.data?.yesterday?.filter(q => q.isCompleted).length ?? 0) +
      (dailyQuests?.body?.data?.dayBeforeYesterday?.filter(q => q.isCompleted).length ?? 0),
    streak: calculateStreak(
      dailyQuests?.body?.data?.today,
      dailyQuests?.body?.data?.yesterday,
      dailyQuests?.body?.data?.dayBeforeYesterday,
    ),
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
      <CommunitiesSection />

      <DashboardQuests />

      {user ? (
        <StatsSummary stats={stats} />
      ) : (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      )}
    </div>
  );
}

function calculateStreak(
  today?: Array<{ isCompleted?: boolean }>,
  yesterday?: Array<{ isCompleted?: boolean }>,
  dayBefore?: Array<{ isCompleted?: boolean }>,
): number {
  if (!today && !yesterday && !dayBefore) return 0;

  let streak = 0;
  const todayComplete = today?.some(q => q.isCompleted);
  const yesterdayComplete = yesterday?.some(q => q.isCompleted);
  const dayBeforeComplete = dayBefore?.some(q => q.isCompleted);

  if (todayComplete) streak++;
  if (yesterdayComplete) streak++;
  if (dayBeforeComplete) streak++;

  return streak;
}
