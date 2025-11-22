'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CommunityDetail from '@/components/communities/CommunityDetail';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;

  return <CommunityDetail communityId={communityId} />;
}
