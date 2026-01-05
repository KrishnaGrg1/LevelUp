'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CommunitySettings from '@/components/communities/CommunitySettings';

export default function CommunitySettingsPage() {
  const params = useParams();
  const communityId = params.id as string;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <CommunitySettings communityId={communityId} />
    </div>
  );
}
