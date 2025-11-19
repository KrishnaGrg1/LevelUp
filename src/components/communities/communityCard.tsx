'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Lock, Globe, Crown, Plus, Pin } from 'lucide-react';
import LanguageStore from '@/stores/useLanguage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyCommunities, getAllCommunities, joinCommunity } from '@/lib/services/communities';
import CreateCommunityModal from './CreateCommunityModal';
import CustomizePinModal from './CustomizePin';
import SearchCommunityModal from './SearchCommunities';
import { toast } from 'sonner';
import type { CommunityDTO } from '@/lib/generated';

export default function CommunitiesSection() {
  const { language } = LanguageStore();
  const router = useRouter();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      toast.success('Successfully joined community!');
      queryClient.invalidateQueries({ queryKey: ['my-communities'] });
      queryClient.invalidateQueries({ queryKey: ['all-communities'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to join community');
    },
  });

  const handleJoinCommunity = (e: React.MouseEvent, communityId: string) => {
    e.stopPropagation(); // Prevent navigation when clicking Join button
    joinMutation.mutate(communityId);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2 font-bold">My Communities</h1>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
              Manage and explore your professional communities
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setOpenJoinModal(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-green-600 dark:border-green-500 bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 h-10 px-4 py-2"
            >
              <Users className="h-4 w-4 mr-2" />
              Join Community
            </button>
            <button
              onClick={() => setOpenCreateModal(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
            >
              <span className="text-xl mr-2">+</span>
              Create Community
            </button>
          </div>
        </div>

        <CreateCommunityModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} />
        <SearchCommunityModal isOpen={openJoinModal} onClose={() => setOpenJoinModal(false)} />
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-28"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mb-8">
          <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50">
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
        <button
          onClick={e => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
          className="px-3 py-2 rounded-md bg-amber-500 text-white font-semibold hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          Customize Pins
        </button>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Community Card - Always First */}
          <Card
            onClick={() => setOpenCreateModal(true)}
            className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
          >
            <CardContent className="relative pt-6 pb-6 flex flex-col items-center justify-center h-full min-h-[200px]">
              <div className="w-20 h-20 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-md">
                <Plus className="h-10 w-10 text-white font-bold" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                Create Community
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center px-4">
                Start a new community and invite members
              </p>
            </CardContent>
          </Card>

          {/* Existing Communities */}
          {communities.map((community: CommunityDTO, index: number) => {
            const isPrivate = community.visibility === 'private';
            const isAdmin = community.userRole === 'ADMIN';
            const isPinned = community.isPinned;

            return (
              <Card
                key={community.id || index}
                onClick={() => router.push(`/${language}/user/community/${community.id}`)}
                className={`relative rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer ${
                  isPrivate
                    ? 'border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
                    : 'border-2 border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-700'
                }`}
              >
                {/* Subtle top accent bar */}
                <div
                  className={`h-1 w-full ${
                    isPrivate
                      ? 'bg-purple-500 dark:bg-purple-600'
                      : 'bg-green-500 dark:bg-green-600'
                  }`}
                ></div>

                {/* Pinned Icon - Top Right Corner */}
                {isPinned && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="w-8 h-8 rounded-full bg-amber-500 dark:bg-amber-600 flex items-center justify-center shadow-md">
                      <Pin className="h-4 w-4 text-white" fill="currentColor" />
                    </div>
                  </div>
                )}

                <CardHeader className="pb-2 px-4 pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {/* Privacy Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 ${
                          isPrivate
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        }`}
                      >
                        {isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-50 transition-colors">
                            {community.name}
                          </CardTitle>
                          {/* Pinned Badge next to title */}
                          {isPinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
                              <Pin className="h-3 w-3" fill="currentColor" />
                              Pinned
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-0.5 font-medium ${
                            isPrivate
                              ? 'text-purple-600 dark:text-purple-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}
                        >
                          {isPrivate ? 'Private Community' : 'Public Community'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {/* Admin Badge */}
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 shadow-sm">
                        <Crown className="h-3 w-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700 shadow-sm">
                        <Users className="h-3 w-3" />
                        Member
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                  {/* Members info */}
                  <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {community.currentMembers} / {community.maxMembers} members
                    </div>
                  </div>

                  {/* Description */}
                  {community.description && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
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
              <Card className="border-dashed border-2">
                <CardContent className="pt-6 pb-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No communities yet</h3>
                  <p className="text-sm text-muted-foreground">
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
          <h2 className="text-2xl md:text-3xl font-bold">All Communities</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Discover and join communities
          </p>
        </div>

        {/* Loading State for All Communities */}
        {isLoadingAll && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-blue-500/20 bg-blue-500/5">
                <CardHeader>
                  <div className="animate-pulse">
                    <div className="h-6 bg-blue-300/30 rounded w-32 mb-3"></div>
                    <div className="h-4 bg-blue-300/30 rounded w-20 mb-2"></div>
                    <div className="h-4 bg-blue-300/30 rounded w-28"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-2 bg-blue-300/30 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State for All Communities */}
        {isErrorAll && (
          <Card className="border-red-500/20 bg-red-500/5">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCommunities.map((community: CommunityDTO, index: number) => {
              const isPrivate = community.visibility === 'private';
              const isAdmin = community.userRole === 'ADMIN';
              const isPinned = community.isPinned;

              return (
                <Card
                  key={community.id || index}
                  onClick={() => router.push(`/${language}/community/${community.id}`)}
                  className={`relative rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer ${
                    isPrivate
                      ? 'border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
                      : 'border-2 border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-700'
                  }`}
                >
                  {/* Subtle top accent bar */}
                  <div
                    className={`h-1 w-full ${
                      isPrivate
                        ? 'bg-purple-500 dark:bg-purple-600'
                        : 'bg-green-500 dark:bg-green-600'
                    }`}
                  ></div>

                  {/* Pinned Icon - Top Right Corner */}
                  {isPinned && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-8 h-8 rounded-full bg-amber-500 dark:bg-amber-600 flex items-center justify-center shadow-md">
                        <Pin className="h-4 w-4 text-white" fill="currentColor" />
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-2 px-4 pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {/* Privacy Icon */}
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 ${
                            isPrivate
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          }`}
                        >
                          {isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-50 transition-colors">
                              {community.name}
                            </CardTitle>
                            {/* Pinned Badge next to title */}
                            {isPinned && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700">
                                <Pin className="h-3 w-3" fill="currentColor" />
                                Pinned
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs mt-0.5 font-medium ${
                              isPrivate
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-green-600 dark:text-green-400'
                            }`}
                          >
                            {isPrivate ? 'Private Community' : 'Public Community'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {/* Admin Badge */}
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 shadow-sm">
                          <Crown className="h-3 w-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700 shadow-sm">
                          <Users className="h-3 w-3" />
                          Member
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 pb-4">
                    {/* Members info */}
                    <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {community.currentMembers} / {community.maxMembers} members
                      </div>
                    </div>

                    {/* Description */}
                    {community.description && (
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {community.description}
                      </p>
                    )}

                    {/* Join Button for non-members */}
                    {!community.userRole && (
                      <button
                        onClick={e => handleJoinCommunity(e, community.id)}
                        disabled={joinMutation.isPending}
                        className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Card className="border-dashed border-2">
                  <CardContent className="pt-6 pb-6 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No communities available</h3>
                    <p className="text-sm text-muted-foreground">
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
