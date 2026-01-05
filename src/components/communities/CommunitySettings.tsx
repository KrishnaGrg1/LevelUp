'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Users,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { communityDetailById } from '@/lib/services/communities';
import LanguageStore from '@/stores/useLanguage';
import authStore from '@/stores/useAuth';
import { t } from '@/translations';
import GeneralSettings from './settings/GeneralSettings';
import PhotoSettings from './settings/PhotoSettings';
import MemberManagement from './settings/MemberManagement';
import OwnershipTransfer from './settings/OwnershipTransfer';
import { Community as CommunityType } from '@/lib/generated';

// Extended type to include photo and other runtime fields from API
interface CommunityWithExtras extends Partial<CommunityType> {
  id: string;
  name: string;
  photo?: string;
  ownerId: string;
  userRole?: 'ADMIN' | 'MEMBER';
  currentMembers?: number;
  maxMembers?: number;
  visibility?: 'public' | 'private';
  isPinned?: boolean;
  clansCount?: number;
}

interface CommunitySettingsProps {
  communityId: string;
}

export default function CommunitySettings({ communityId }: CommunitySettingsProps) {
  const router = useRouter();
  const { language } = LanguageStore();
  const { user } = authStore();
  const [activeTab, setActiveTab] = useState('general');

  const { data: communityData, isLoading } = useQuery({
    queryKey: ['community-details', communityId, language],
    queryFn: () => communityDetailById(language, communityId),
    enabled: !!communityId,
    staleTime: 30000,
  });

  // Also fetch user's communities to get role information
  const { data: myCommunitiesData, isPending: isMyCommunitiesPending } = useQuery({
    queryKey: ['my-communities', language],
    queryFn: async () => {
      const { getMyCommunities } = await import('@/lib/services/communities');
      return getMyCommunities(language);
    },
    staleTime: 30000,
  });

  // Cast to our minimal type to satisfy TS
  const communityBase = communityData?.body?.data as CommunityWithExtras | undefined;

  // Find this community in the user's communities list to get role info
  const myCommunity = myCommunitiesData?.body?.data?.find(c => c.id === communityId);

  // Merge the data
  const community = communityBase
    ? {
        ...communityBase,
        // Ownership is sourced from community details (community table). Use my-communities only
        // to resolve the viewer's role when needed.
        userRole: myCommunity?.userRole ?? communityBase.userRole,
      }
    : undefined;

  const isOwner = !!community?.ownerId && !!user?.id && community.ownerId === user.id;
  const isAdmin = community?.userRole === 'ADMIN';

  // Prevent flashing "access denied" before role validation finishes.
  if (isLoading || isMyCommunitiesPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
            Community not found
          </h2>
          <button
            onClick={() => router.back()}
            className="text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-400"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Owner and Admin access gate
  if (!isOwner && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <p className="text-sm text-red-600 dark:text-red-400">
            {t('community.settings.permissions.ownerOnly')}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-400"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-white px-4 py-8 sm:px-6 lg:px-8 dark:bg-black">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          {t('community.settings.backToCommunity')}
        </button>

        <div className="flex items-center gap-4">
          {community.photo && (
            <img
              src={community.photo}
              alt={community.name}
              className="h-16 w-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="mb-1 text-3xl font-bold text-black dark:text-white">
              {t('community.settings.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{community.name}</p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2 border border-gray-200 bg-gray-100 lg:grid-cols-4 dark:border-gray-800 dark:bg-gray-900">
          <TabsTrigger
            value="general"
            className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t('community.settings.tabs.general')}</span>
          </TabsTrigger>
          <TabsTrigger
            value="photo"
            className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t('community.settings.tabs.photo')}</span>
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t('community.settings.tabs.members')}</span>
          </TabsTrigger>
          <TabsTrigger
            value="ownership"
            className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{t('community.settings.tabs.ownership')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings community={community} isOwner={isOwner} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="photo">
          <PhotoSettings community={community} isOwner={isOwner} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="members">
          <MemberManagement community={community} isOwner={isOwner} isAdmin={isAdmin} />
        </TabsContent>

        <TabsContent value="ownership">
          <OwnershipTransfer community={community} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
