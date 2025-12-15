'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGlobalLeaderboard } from '@/lib/services/leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { BetterPagination } from '@/components/BetterPagination';

export default function GlobalLeaderboardPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isPending, isError } = useQuery({
    queryKey: ['global-leaderboard', page, limit],
    queryFn: () => getGlobalLeaderboard({ page, limit }),
    staleTime: 30000,
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500" aria-label="1st place" />;
    if (rank === 2)
      return <Medal className="h-6 w-6 text-gray-400 fill-gray-400" aria-label="2nd place" />;
    if (rank === 3)
      return <Award className="h-6 w-6 text-amber-600 fill-amber-600" aria-label="3rd place" />;
    return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Global Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Top players ranked by total XP across all communities
          </p>
        </div>

        <Card className="border-purple-500/20 bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-purple-500/10">
            <CardTitle className="text-xl text-gray-900 dark:text-white">
              Top {limit} Players
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isPending ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-purple-600 dark:text-purple-400" />
              </div>
            ) : isError ? (
              <div className="text-center py-20">
                <p className="text-red-500 dark:text-red-400">Failed to load leaderboard</p>
              </div>
            ) : !data?.results || data.results.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">No users found</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.results.map((user, index) => {
                    const rank = (page - 1) * limit + index + 1;
                    const isTopThree = rank <= 3;

                    return (
                      <div
                        key={user.id}
                        className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          isTopThree
                            ? 'bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-900/10 dark:to-transparent'
                            : ''
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-12 flex justify-center">{getRankIcon(rank)}</div>

                        {/* Avatar & Name */}
                        <Avatar className="h-12 w-12 border-2 border-purple-200 dark:border-purple-800">
                          <AvatarImage src={user.profilePicture || undefined} alt={user.UserName} />
                          <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-semibold">
                            {user.UserName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {user.UserName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                            >
                              Level {user.level}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {user.tokens.toLocaleString()} tokens
                            </span>
                          </div>
                        </div>

                        {/* XP */}
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">XP</p>
                          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {user.xp.toLocaleString()}
                          </p>
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
            {data.pagination.total.toLocaleString()} players
          </div>
        )}
      </div>
    </div>
  );
}
