import CommunitiesSection from '@/components/communities/communityCard';
import StatsSummary from '@/components/landing/statsSummary';
import TodaysQuests from '@/components/landing/todaysQuests';
import WeeklyQuests from '@/components/landing/weeklyQuests';

export default function DashboardPage() {
  return (
    <div>
      {/* <MyCommunities /> */}
      <CommunitiesSection />

      <TodaysQuests />
      <WeeklyQuests />
      <StatsSummary />
    </div>
  );
}
