import CommunitiesSection from '@/components/communities/communityCard';
import StatsSummary from '@/components/landing/statsSummary';
import DashboardQuests from '@/components/DashboardQuests';

export default function DashboardPage() {
  return (
    <div className="space-y-4 px-3 sm:space-y-6 sm:px-0">
      {/* <MyCommunities /> */}
      <CommunitiesSection />

      <DashboardQuests />

      <StatsSummary />
    </div>
  );
}
