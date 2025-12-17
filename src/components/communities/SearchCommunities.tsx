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
      <DialogContent className="max-w-2xl max-h-[95vh] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                Discover Communities
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Search and join communities that match your interests
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => setActiveTab('search')}
              variant={activeTab === 'search' ? 'default' : 'outline'}
              className={
                activeTab === 'search'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            >
              <Search className="h-4 w-4 mr-2" />
              Search Communities
            </Button>
            <Button
              onClick={() => setActiveTab('joinCode')}
              variant={activeTab === 'joinCode' ? 'default' : 'outline'}
              className={
                activeTab === 'joinCode'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            >
              <Key className="h-4 w-4 mr-2" />
              Join Private Community
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-3 h-[60vh] pr-2">
          {activeTab === 'search' ? (
            <>
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search communities..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 h-11 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Filter Buttons */}
              {search.length > 0 && communities.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter:
                  </span>
                  <Button
                    size="sm"
                    variant={sortFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setSortFilter('all')}
                    className={
                      sortFilter === 'all'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
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
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  >
                    <TrendingUp className="h-3.5 w-3.5 mr-1" />
                    Most Joined
                  </Button>
                  <Button
                    size="sm"
                    variant={sortFilter === 'public' ? 'default' : 'outline'}
                    onClick={() => setSortFilter('public')}
                    className={
                      sortFilter === 'public'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  >
                    <Globe className="h-3.5 w-3.5 mr-1" />
                    Public
                  </Button>
                  <Button
                    size="sm"
                    variant={sortFilter === 'private' ? 'default' : 'outline'}
                    onClick={() => setSortFilter('private')}
                    className={
                      sortFilter === 'private'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  >
                    <Lock className="h-3.5 w-3.5 mr-1" />
                    Private
                  </Button>
                </div>
              )}

              {/* Communities List */}
              <div className="space-y-3 overflow-y-auto max-h-[calc(85vh-280px)] pr-2 custom-scrollbar">
                {isLoading && (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
                  </div>
                )}

                {!isLoading && search.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Start typing to search for communities
                    </p>
                  </div>
                )}

                {!isLoading && search.length > 0 && filteredAndSortedCommunities.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No communities found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
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
                        className="flex items-start justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                              {community.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 shrink-0">
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
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
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
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' // Private request button color
                              : isFull
                                ? 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500' // Full
                                : 'bg-blue-600 hover:bg-blue-700 text-white' // Public join
                          }`}
                        >
                          {joinMutation.isPending && !community.isPrivate ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredAndSortedCommunities.length} of {communities.length}{' '}
                    {communities.length === 1 ? 'community' : 'communities'}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Join with Code Section */
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <Key className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Join Private Community
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  Enter the invite code you received to join a private community
                </p>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Enter join code (e.g., 50RV-FB1B)"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && joinCode.trim()) {
                        handleJoinWithCode();
                      }
                    }}
                    className="pl-10 h-12 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 text-center text-lg font-mono tracking-wider"
                    maxLength={10}
                  />
                </div>

                <Button
                  onClick={handleJoinWithCode}
                  disabled={!joinCode.trim() || joinPrivateMutation.isPending}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {joinPrivateMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Joining...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Join Community</span>
                    </div>
                  )}
                </Button>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                          i
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <p className="font-medium mb-1">How to get a join code?</p>
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
