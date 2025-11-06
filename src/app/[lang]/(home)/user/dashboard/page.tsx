import CommunitiesSection from '@/components/communities/communityCard';

import StatsSummary from '@/components/landing/statsSummary';
import TodaysQuests from '@/components/landing/todaysQuests';

export default function DashboardPage() {
  return (
    <div>
      {/* <MyCommunities /> */}
      <CommunitiesSection />
      <TodaysQuests />
      <StatsSummary />
    </div>
  );
}
