'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CommunityDetail from '@/components/communities/CommunityDetail';
import { Separator } from '@/components/ui/separator';
import QuestPanel from '@/components/quests/QuestPanel';
import TodaysQuests from '@/components/landing/todaysQuests';
import WeeklyQuests from '@/components/landing/weeklyQuests';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;

  return (
    <div className="space-y-8">
      <CommunityDetail communityId={communityId} />

      <Separator className="my-2" />

      <section>
        <h2 className="text-xl font-bold mb-3">Quests</h2>
        {/* Inline lists so quests fetch/render on page load */}
        <div className="space-y-10">
          <TodaysQuests />
          <WeeklyQuests />
        </div>
        {/* Keep the dialog panel for detailed view */}
        <div className="mt-6">
          <QuestPanel />
        </div>
      </section>
    </div>
  );
}
