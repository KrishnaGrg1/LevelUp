'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getTopCommunities,
  type CommunitySortBy,
  type SortOrder,
} from '@/lib/services/leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trophy, Users, Calendar, Loader2, TrendingUp, Award } from 'lucide-react';
import LanguageStore from '@/stores/useLanguage';
import { BetterPagination } from '@/components/BetterPagination';
import { useRouter } from 'next/navigation';

export default function TopCommunitiesPage() {
  const { language } = LanguageStore();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<CommunitySortBy>('xp');
  const [order, setOrder] = useState<SortOrder>('desc');
  const limit = 20;

  const { data, isPending, isError } = useQuery({
    queryKey: ['top-communities', page, limit, sortBy, order],
    queryFn: () => getTopCommunities({ page, limit, sortBy, order }),
    staleTime: 60000,
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500" aria-label="1st place" />;
    if (rank === 2)
      return <Award className="h-6 w-6 text-gray-400 fill-gray-400" aria-label="2nd place" />;
    if (rank === 3)
      return <Award className="h-6 w-6 text-amber-600 fill-amber-600" aria-label="3rd place" />;
    return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Top Communities
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover the most active and thriving communities
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-4 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={value => setSortBy(value as CommunitySortBy)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xp">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        XP
                      </div>
                    </SelectItem>
                    <SelectItem value="members">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Members
                      </div>
                    </SelectItem>
                    <SelectItem value="createdAt">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Creation Date
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Order
                </label>
                <Select value={order} onValueChange={value => setOrder(value as SortOrder)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Highest First</SelectItem>
                    <SelectItem value="asc">Lowest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Communities List */}
        <Card className="border-blue-500/20 bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-blue-500/10">
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              Top {limit} Communities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isPending ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
              </div>
            ) : isError ? (
              <div className="text-center py-20">
                <p className="text-red-500 dark:text-red-400">Failed to load top communities</p>
              </div>
            ) : !data?.results || data.results.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">No communities found</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.results.map((community, index) => {
                    const rank = (page - 1) * limit + index + 1;
                    const isTopThree = rank <= 3;
                    const occupancy = Math.round(
                      (community.memberCount / community.memberLimit) * 100,
                    );

                    return (
                      <div
                        key={community.id}
                        onClick={() => router.push(`/${language}/user/community/${community.id}`)}
                        className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                          isTopThree
                            ? 'bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent'
                            : ''
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-12 flex justify-center shrink-0">{getRankIcon(rank)}</div>

                        {/* Community Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg">
                            {community.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                              <Trophy className="h-3 w-3 mr-1" />
                              {community.xp.toLocaleString()} XP
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              <Users className="h-3 w-3 mr-1" />
                              {community.memberCount} / {community.memberLimit} ({occupancy}%)
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Created {new Date(community.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right shrink-0">
                          {sortBy === 'xp' && (
                            <>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                XP
                              </p>
                              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                {community.xp.toLocaleString()}
                              </p>
                            </>
                          )}
                          {sortBy === 'members' && (
                            <>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Members
                              </p>
                              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                {community.memberCount}
                              </p>
                            </>
                          )}
                          {sortBy === 'createdAt' && (
                            <>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Age
                              </p>
                              <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                                {Math.floor(
                                  (Date.now() - new Date(community.createdAt).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                )}{' '}
                                days
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {data.pagination.totalPages > 1 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <BetterPagination
                      paginationMetadata={{
                        total: data.pagination.total,
                        page: page,
                        pageSize: limit,
                        totalPages: data.pagination.totalPages,
                      }}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {data?.pagination && (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Showing {((page - 1) * limit + 1).toLocaleString()} -{' '}
            {Math.min(page * limit, data.pagination.total).toLocaleString()} of{' '}
            {data.pagination.total.toLocaleString()} communities
          </div>
        )}
      </div>
    </div>
  );
}
