'use client';

import React, { useState, useMemo } from 'react';
import { Search, Users, Globe, Lock, TrendingUp, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { searchCommunities, joinCommunity, joinPrivateCommunity } from '@/lib/services/communities';
import LanguageStore from '@/stores/useLanguage';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { Community } from '@/lib/generated';

type SortOption = 'all' | 'most-joined' | 'public' | 'private';
type TabOption = 'search' | 'joinCode';

interface SearchCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchCommunityModal({ isOpen, onClose }: SearchCommunityModalProps) {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [sortFilter, setSortFilter] = useState<SortOption>('all');
  const [debouncedSearch] = useDebounce(search, 500);
  const [activeTab, setActiveTab] = useState<TabOption>('search');
  const [joinCode, setJoinCode] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['search-communities', debouncedSearch],
    queryFn: () => searchCommunities(language, debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  // Memoize communities to prevent unnecessary re-renders
  const communities = useMemo(() => data?.body?.data ?? [], [data?.body?.data]);

  // Filter and sort communities based on the selected filter
  const filteredAndSortedCommunities = useMemo(() => {
    let filtered = [...communities];

    // Apply visibility filter
    if (sortFilter === 'public') {
      filtered = filtered.filter((c: Community) => c.isPrivate === false);
    } else if (sortFilter === 'private') {
      filtered = filtered.filter((c: Community) => c.isPrivate === true);
    }

    // Sort by most joined members
    if (sortFilter === 'most-joined') {
      filtered = filtered.sort((a, b) => (b._count?.members ?? 0) - (a._count?.members ?? 0));
    }

    return filtered;
  }, [communities, sortFilter]);

  // Join mutation
  const joinMutation = useMutation({
    mutationFn: (communityId: string) => joinCommunity(language, communityId),
    onSuccess: () => {
      toast.success('Successfully joined community!');
      queryClient.invalidateQueries({ queryKey: ['my-communities'] });
      queryClient.invalidateQueries({ queryKey: ['search-communities'] });
    },
    onError: (error: unknown) => {
      const err = error as { message?: string; error?: string };
      const errorMessage = err.message || 'Community Join  failed';
      toast.error(errorMessage);
    },
  });

  // Join private community with code mutation
  const joinPrivateMutation = useMutation({
    mutationFn: (code: string) => joinPrivateCommunity(language, code),
    onSuccess: () => {
      toast.success('Successfully joined private community!');
      queryClient.invalidateQueries({ queryKey: ['my-communities'] });
      setJoinCode('');
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { message?: string; error?: string };
      const errorMessage = err.message || 'Failed to join community with code';
      toast.error(errorMessage);
    },
  });

  const handleJoin = (communityId: string) => {
    joinMutation.mutate(communityId);
  };

  const handleJoinWithCode = () => {
    if (!joinCode.trim()) {
      toast.error('Please enter a join code');
      return;
    }
    joinPrivateMutation.mutate(joinCode.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] max-w-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <DialogHeader className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                Discover Communities
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Search and join communities that match your interests
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => setActiveTab('search')}
              variant={activeTab === 'search' ? 'default' : 'outline'}
              size="sm"
              className={
                activeTab === 'search'
                  ? 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                  : ''
              }
            >
              <Search className="h-4 w-4" />
              Search Communities
            </Button>
            <Button
              onClick={() => setActiveTab('joinCode')}
              variant={activeTab === 'joinCode' ? 'default' : 'outline'}
              size="sm"
              className={
                activeTab === 'joinCode'
                  ? 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                  : ''
              }
            >
              <Key className="h-4 w-4" />
              Join Private Community
            </Button>
          </div>
        </DialogHeader>

        <div className="h-[60vh] space-y-3 py-3 pr-2">
          {activeTab === 'search' ? (
            <>
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search communities..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-11 border-gray-300 bg-gray-50 pl-10 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                />
              </div>

              {/* Filter Buttons */}
              {search.length > 0 && communities.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter:
                  </span>
                  <Button
                    size="sm"
                    variant={sortFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setSortFilter('all')}
                    className={
                      sortFilter === 'all'
                        ? 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                        : ''
                    }
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={sortFilter === 'most-joined' ? 'default' : 'outline'}
                    onClick={() => setSortFilter('most-joined')}
                    className={
                      sortFilter === 'most-joined'
                        ? 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                        : ''
                    }
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Most Joined
                  </Button>
                  <Button
                    size="sm"
                    variant={sortFilter === 'public' ? 'default' : 'outline'}
                    onClick={() => setSortFilter('public')}
                    className={
                      sortFilter === 'public'
                        ? 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                        : ''
                    }
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Public
                  </Button>
                  <Button
                    size="sm"
                    variant={sortFilter === 'private' ? 'default' : 'outline'}
                    onClick={() => setSortFilter('private')}
                    className={
                      sortFilter === 'private'
                        ? 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                        : ''
                    }
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Private
                  </Button>
                </div>
              )}

              {/* Communities List */}
              <div className="custom-scrollbar max-h-[calc(85vh-280px)] space-y-3 overflow-y-auto pr-2">
                {isLoading && (
                  <div className="py-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Searching...</p>
                  </div>
                )}

                {!isLoading && search.length === 0 && (
                  <div className="py-12 text-center">
                    <Search className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Start typing to search for communities
                    </p>
                  </div>
                )}

                {!isLoading && search.length > 0 && filteredAndSortedCommunities.length === 0 && (
                  <div className="py-12 text-center">
                    <Users className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">No communities found</p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                )}

                {!isLoading &&
                  filteredAndSortedCommunities.map((community: Community) => {
                    const isPublic = !community.isPrivate;
                    const currentMembers = community._count?.members || 0;
                    const maxMembers = community.memberLimit;
                    const isFull = currentMembers >= maxMembers;

                    return (
                      <div
                        key={community.id}
                        className="dark:hover:bg-gray-750 flex items-start justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                              {community.name}
                            </h3>
                            <div className="flex shrink-0 items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              {isPublic ? (
                                <>
                                  <Globe className="h-3.5 w-3.5" />
                                  <span>Public</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3.5 w-3.5" />
                                  <span>Private</span>
                                </>
                              )}
                            </div>
                          </div>

                          {community.description && (
                            <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                              {community.description}
                            </p>
                          )}

                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Users className="h-4 w-4" />
                            <span>
                              {currentMembers} / {maxMembers} members
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleJoin(community.id)}
                          disabled={isFull || joinMutation.isPending || community.isPrivate}
                          size="sm"
                          className={`ml-4 shrink-0 ${
                            community.isPrivate
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700'
                              : isFull
                                ? ''
                                : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                          }`}
                          variant={isFull ? 'outline' : 'default'}
                        >
                          {joinMutation.isPending && !community.isPrivate ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          ) : community.isPrivate ? (
                            'Request to Join'
                          ) : isFull ? (
                            'Full'
                          ) : (
                            'Join'
                          )}
                        </Button>
                      </div>
                    );
                  })}
              </div>

              {/* Results Count */}
              {!isLoading && search.length > 0 && filteredAndSortedCommunities.length > 0 && (
                <div className="border-t border-gray-200 pt-2 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredAndSortedCommunities.length} of {communities.length}{' '}
                    {communities.length === 1 ? 'community' : 'communities'}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Join with Code Section */
            <div className="flex flex-col items-center justify-center space-y-6 py-12">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Key className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Join Private Community
                </h3>
                <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
                  Enter the invite code you received to join a private community
                </p>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div className="relative">
                  <Key className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Enter join code (e.g., 50RV-FB1B)"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && joinCode.trim()) {
                        handleJoinWithCode();
                      }
                    }}
                    className="h-12 border-gray-300 bg-gray-50 pl-10 text-center font-mono text-lg tracking-wider text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
                    maxLength={10}
                  />
                </div>

                <Button
                  onClick={handleJoinWithCode}
                  disabled={!joinCode.trim() || joinPrivateMutation.isPending}
                  className="h-11 w-full bg-zinc-900 font-medium shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {joinPrivateMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900" />
                      <span>Joining...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Join Community</span>
                    </div>
                  )}
                </Button>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="flex gap-3">
                    <div className="shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          i
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <p className="mb-1 font-medium">How to get a join code?</p>
                      <p className="text-blue-700 dark:text-blue-400">
                        Ask the community admin or a member to share the private invite code with
                        you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
