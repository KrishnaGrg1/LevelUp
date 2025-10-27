import MyCommunities from '@/components/landing/myCommunities';
import StatsSummary from '@/components/landing/statsSummary';
import TodaysQuests from '@/components/landing/todaysQuests';

export default function DashboardPage() {
  return (
    <div>
      <MyCommunities />
      <TodaysQuests />
      <StatsSummary />
    </div>
  );
}
