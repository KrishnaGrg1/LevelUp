'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Lock, Globe, Crown, Plus, Pin } from 'lucide-react';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyCommunities, getAllCommunities, joinCommunity } from '@/lib/services/communities';
import CreateCommunityModal from './CreateCommunityModal';
import CustomizePinModal from './CustomizePin';
import SearchCommunityModal from './SearchCommunities';
import { toast } from 'sonner';
import type { CommunityDTO } from '@/lib/generated';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';
import authStore from '@/stores/useAuth';

export default function CommunitiesSection() {
  const { language } = LanguageStore();
  const { user, _hasHydrated } = authStore();
  const router = useRouter();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  
  // Fetch user communities data
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['my-communities', language],
    queryFn: () => getMyCommunities(language),
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    // Only check onboarding status after the store has hydrated AND user data is available
    if (!_hasHydrated || !user) return;
    
    if (user.hasOnboarded) {
      setOnboardingCompleted(true);
      setOnboardingOpen(false);
    } else if (!onboardingCompleted) {
      // Only show onboarding if user hasn't completed it and we haven't marked it as completed in this session
      setOnboardingOpen(true);
    }
  }, [_hasHydrated, user, onboardingCompleted]);
  // Fetch all communities data
  const {
    data: allCommunitiesData,
    isPending: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
  } = useQuery({
    queryKey: ['all-communities', language],
    queryFn: () => getAllCommunities(language),
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const communities = data?.body?.data || [];
  const allCommunities = allCommunitiesData?.body?.data || [];

  const queryClient = useQueryClient();

  // Join community mutation
  const joinMutation = useMutation({
    mutationFn: (communityId: string) => joinCommunity(language, communityId),
    onSuccess: () => {
      toast.success(t('community:toast.joinedSuccess', language));
      queryClient.invalidateQueries({ queryKey: ['my-communities'] });
      queryClient.invalidateQueries({ queryKey: ['all-communities'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('community:toast.joinFailed', language));
    },
  });

  const handleJoinCommunity = (e: React.MouseEvent, communityId: string) => {
    e.stopPropagation(); // Prevent navigation when clicking Join button
    joinMutation.mutate(communityId);
  };

  const handleOnboardingComplete = () => {
    // Mark onboarding as completed in this session to prevent reopening
    setOnboardingCompleted(true);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <OnboardingFlow 
        open={onboardingOpen} 
        onOpenChange={setOnboardingOpen} 
        lang={language}
        onComplete={handleOnboardingComplete}
      />

      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold md:text-3xl lg:text-4xl">My Communities</h1>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
              Manage and explore your professional communities
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setOpenJoinModal(true)}
              variant="outline"
              size="lg"
              className="shadow-sm"
            >
              <Users className="h-4 w-4" />
              {t('community:card.join', language)}
            </Button>
            <Button
              onClick={() => setOpenCreateModal(true)}
              variant="default"
              size="lg"
              className="bg-zinc-900 shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              {t('community:createModal.title', language)}
            </Button>
          </div>
        </div>

        <CreateCommunityModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} />
        <SearchCommunityModal isOpen={openJoinModal} onClose={() => setOpenJoinModal(false)} />
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <CardHeader>
                <div className="animate-pulse">
                  <div className="mb-3 h-6 w-32 rounded bg-gray-300 dark:bg-gray-600"></div>
                  <div className="mb-2 h-4 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-4 w-28 rounded bg-gray-300 dark:bg-gray-600"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-full rounded bg-gray-300 dark:bg-gray-600"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mb-8">
          <Card className="border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <Users className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Failed to load communities</h3>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error instanceof Error ? error.message : 'An unknown error occurred'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <Button
          onClick={e => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          variant="outline"
          size="default"
          className="shadow-sm"
        >
          <Pin className="h-4 w-4" />
          Customize Pins
        </Button>

        <CustomizePinModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          communities={communities.map(c => ({
            id: c.id,
            name: c.name,
            isPinned: c.isPinned ?? false,
          }))}
        />
      </div>
      {/* Communities Grid */}
      {!isPending && !isError && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Create Community Card - Always First */}
          <Card
            onClick={() => setOpenCreateModal(true)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 shadow-sm transition-all duration-300 hover:border-gray-400 hover:bg-gray-100 hover:shadow-md dark:border-gray-800 dark:bg-black dark:hover:border-gray-700 dark:hover:bg-gray-900"
          >
            <CardContent className="relative flex h-full min-h-[200px] flex-col items-center justify-center pt-6 pb-6">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-black shadow-md transition-all duration-300 group-hover:scale-110 dark:bg-white">
                <Plus className="h-10 w-10 font-bold text-white dark:text-black" strokeWidth={3} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                Create Community
              </h3>
              <p className="px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                Start a new community and invite members
              </p>
            </CardContent>
          </Card>

          {/* Existing Communities */}
          {communities.map((community: CommunityDTO, index: number) => {
            const isPrivate = community.isPrivate === true;
            const isAdmin = community.userRole === 'ADMIN';
            const isPinned = community.isPinned;

            return (
              <Card
                key={community.id || index}
                onClick={() => router.push(`/${language}/user/community/${community.id}`)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-black dark:hover:border-gray-700"
              >
                {/* Subtle top accent bar */}
                <div className="h-1 w-full bg-gray-900 dark:bg-gray-100" />

                {/* Pinned Icon - Top Right Corner */}
                {isPinned && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/90 shadow-md dark:bg-white/90">
                      <Pin className="h-4 w-4 text-white dark:text-black" fill="currentColor" />
                    </div>
                  </div>
                )}

                <CardHeader className="px-4 pt-4 pb-2">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Privacy Icon */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-200">
                        {isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-gray-700 md:text-xl dark:text-gray-100 dark:group-hover:text-gray-50">
                            {community.name}
                          </CardTitle>
                          {/* Pinned Badge next to title */}
                          {isPinned && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                              <Pin className="h-3 w-3" fill="currentColor" />
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                          {isPrivate ? 'Private Community' : 'Public Community'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {/* Admin Badge */}
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-black px-2.5 py-1 text-xs font-medium text-white shadow-sm dark:border-white/10 dark:bg-white dark:text-black">
                        <Crown className="h-3 w-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                        <Users className="h-3 w-3" />
                        Member
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                  {/* Members info */}
                  <div className="mb-3 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {community.currentMembers} / {community.maxMembers} members
                    </div>
                  </div>

                  {/* Description */}
                  {community.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {community.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Empty State - Only show when no communities at all */}
          {communities.length === 0 && (
            <div className="col-span-full md:col-span-2 lg:col-span-2">
              <Card className="border-2 border-dashed">
                <CardContent className="pt-6 pb-6 text-center">
                  <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">No communities yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Click the card on the left to create your first community
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* All Communities Section */}
      <div className="mt-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold md:text-3xl">All Communities</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Discover and join communities
          </p>
        </div>

        {/* Loading State for All Communities */}
        {isLoadingAll && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-black"
              >
                <CardHeader>
                  <div className="animate-pulse">
                    <div className="mb-3 h-6 w-32 rounded bg-gray-200 dark:bg-gray-800"></div>
                    <div className="mb-2 h-4 w-20 rounded bg-gray-200 dark:bg-gray-800"></div>
                    <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State for All Communities */}
        {isErrorAll && (
          <Card className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-400">
                <Users className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Failed to load communities</h3>
                  <p className="text-sm text-red-300">
                    {errorAll instanceof Error ? errorAll.message : 'An unknown error occurred'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Communities Grid */}
        {!isLoadingAll && !isErrorAll && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allCommunities.map((community: CommunityDTO, index: number) => {
              const isPrivate = community.isPrivate === true;
              const isAdmin = community.userRole === 'ADMIN';
              const isPinned = community.isPinned;

              return (
                <Card
                  key={community.id || index}
                  onClick={() => router.push(`/${language}/community/${community.id}`)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-black dark:hover:border-gray-700"
                >
                  {/* Subtle top accent bar */}
                  <div className="h-1 w-full bg-gray-900 dark:bg-gray-100" />

                  {/* Pinned Icon - Top Right Corner */}
                  {isPinned && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/90 shadow-md dark:bg-white/90">
                        <Pin className="h-4 w-4 text-white dark:text-black" fill="currentColor" />
                      </div>
                    </div>
                  )}

                  <CardHeader className="px-4 pt-4 pb-2">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Privacy Icon with glow effect */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 shadow-sm transition-all duration-300 dark:bg-gray-900 dark:text-gray-200">
                          {isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-gray-700 md:text-xl dark:text-gray-100 dark:group-hover:text-white">
                              {community.name}
                            </CardTitle>
                            {/* Pinned Badge next to title */}
                            {isPinned && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                                <Pin className="h-3 w-3" fill="currentColor" />
                                Pinned
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                            {isPrivate ? 'Private Community' : 'Public Community'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {/* Admin Badge */}
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-black px-2.5 py-1 text-xs font-medium text-white shadow-sm dark:border-white/10 dark:bg-white dark:text-black">
                          <Crown className="h-3 w-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                          <Users className="h-3 w-3" />
                          Member
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 pb-4">
                    {/* Members info */}
                    <div className="mb-3 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {community.currentMembers} / {community.maxMembers} members
                      </div>
                    </div>

                    {/* Description */}
                    {community.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {community.description}
                      </p>
                    )}

                    {/* Join Button for non-members */}
                    {!community.userRole && (
                      <button
                        onClick={e => handleJoinCommunity(e, community.id)}
                        disabled={joinMutation.isPending}
                        className="mt-4 w-full rounded-lg bg-black py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      >
                        {joinMutation.isPending ? 'Joining...' : 'Join'}
                      </button>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Empty State */}
            {allCommunities.length === 0 && (
              <div className="col-span-full">
                <Card className="border-2 border-dashed">
                  <CardContent className="pt-6 pb-6 text-center">
                    <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="mb-2 text-lg font-semibold">No communities available</h3>
                    <p className="text-muted-foreground text-sm">
                      Be the first to create a community
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
