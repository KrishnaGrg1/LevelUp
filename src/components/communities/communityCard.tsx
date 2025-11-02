'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Lock, Globe, Crown, Plus } from 'lucide-react';
import LanguageStore from '@/stores/useLanguage';
import { useQuery } from '@tanstack/react-query';
import { getMyCommunities } from '@/lib/services/communities';
import CreateCommunityModal from './CreateCommunityModal';

export default function CommunitiesSection() {
  const { language } = LanguageStore();
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // Fetch user communities data
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['my-communities', language],
    queryFn: () => getMyCommunities(language),
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const communities = data?.body?.data || [];

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
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
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
      </div>

      {/* Loading State */}
      {isPending && (
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

      {/* Error State */}
      {isError && (
        <div className="mb-8">
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-400">
                <Users className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Failed to load communities</h3>
                  <p className="text-sm text-red-300">
                    {error instanceof Error ? error.message : 'An unknown error occurred'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Communities Grid */}
      {!isPending && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Community Card - Always First */}
          <Card
            onClick={() => setOpenCreateModal(true)}
            className="relative border-2 border-dashed border-blue-400/60 rounded-xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden cursor-pointer group"
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <CardContent className="relative pt-6 pb-6 flex flex-col items-center justify-center h-full min-h-[200px]">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 shadow-lg">
                <Plus className="h-10 w-10 text-white font-bold" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Create Community
              </h3>
              <p className="text-sm text-gray-300 text-center px-4">
                Start a new community and invite members
              </p>
            </CardContent>
          </Card>

          {/* Existing Communities */}
          {communities.map((community: any, index: number) => {
            const isPrivate = community.visibility === 'private';
            const isAdmin = community.userRole === 'ADMIN';

            return (
              <Card
                key={community.id || index}
                className={`relative rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${
                  isPrivate
                    ? 'border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-gray-900/50 to-gray-900/30 hover:border-purple-400/50'
                    : 'border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-gray-900/50 to-gray-900/30 hover:border-emerald-400/50'
                }`}
              >
                {/* Subtle top accent bar */}
                <div
                  className={`h-1 w-full ${
                    isPrivate
                      ? 'bg-gradient-to-r from-purple-500/50 via-purple-400/50 to-pink-500/50'
                      : 'bg-gradient-to-r from-emerald-500/50 via-teal-400/50 to-cyan-500/50'
                  }`}
                ></div>

                <CardHeader className="pb-2 px-4 pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {/* Privacy Icon with glow effect */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
                          isPrivate
                            ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 text-purple-300 group-hover:shadow-purple-500/30'
                            : 'bg-gradient-to-br from-emerald-600/20 to-teal-600/20 text-emerald-300 group-hover:shadow-emerald-500/30'
                        }`}
                      >
                        {isPrivate ? <Lock className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg md:text-xl font-semibold text-gray-100 group-hover:text-white transition-colors">
                          {community.name}
                        </CardTitle>
                        <p
                          className={`text-xs mt-0.5 font-medium ${
                            isPrivate ? 'text-purple-400/80' : 'text-emerald-400/80'
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm">
                        <Crown className="h-3 w-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-sm">
                        <Users className="h-3 w-3" />
                        Member
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                  {/* Members info */}
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {community.currentMembers} / {community.maxMembers} members
                    </div>
                  </div>

                  {/* Description */}
                  {community.description && (
                    <p className="mt-3 text-sm text-gray-300 line-clamp-2">
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
    </div>
  );
}
