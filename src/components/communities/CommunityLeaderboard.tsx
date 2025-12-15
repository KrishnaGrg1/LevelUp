'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCommunityLeaderboard } from '@/lib/services/leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Loader2, Users } from 'lucide-react';
import { BetterPagination } from '@/components/BetterPagination';

interface CommunityLeaderboardProps {
  communityId: string;
}

export default function CommunityLeaderboard({ communityId }: CommunityLeaderboardProps) {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isPending, isError } = useQuery({
    queryKey: ['community-leaderboard', communityId, page, limit],
    queryFn: () => getCommunityLeaderboard(communityId, { page, limit }),
    staleTime: 30000,
    enabled: !!communityId,
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return <Trophy className="h-5 w-5 text-yellow-500 fill-yellow-500" aria-label="1st place" />;
    if (rank === 2)
      return <Medal className="h-5 w-5 text-gray-400 fill-gray-400" aria-label="2nd place" />;
    if (rank === 3)
      return <Award className="h-5 w-5 text-amber-600 fill-amber-600" aria-label="3rd place" />;
    return <span className="text-sm font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
  };

  if (isPending) {
    return (
      <Card className="border-blue-500/20 bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-500/20 bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <p className="text-center text-red-500 dark:text-red-400">
            Failed to load community leaderboard
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data?.results || data.results.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="text-center py-10">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">No members found in this community</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-500/20 bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-blue-500/10 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {data.community.name} Leaderboard
          </CardTitle>
          <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-0">
            {data.community.xp.toLocaleString()} Community XP
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.results.map((member, index) => {
            const rank = (page - 1) * limit + index + 1;
            const isTopThree = rank <= 3;

            return (
              <div
                key={member.id}
                className={`flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  isTopThree
                    ? 'bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent'
                    : ''
                }`}
              >
                {/* Rank */}
                <div className="w-10 flex justify-center">{getRankIcon(rank)}</div>

                {/* Avatar & Name */}
                <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-800">
                  <AvatarImage
                    src={member.user.profilePicture || undefined}
                    alt={member.user.UserName}
                  />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-sm">
                    {member.user.UserName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                    {member.user.UserName}
                  </p>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 mt-1"
                  >
                    Level {member.level}
                  </Badge>
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">XP</p>
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {member.totalXP.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
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

        {data.pagination && (
          <div className="p-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            Showing {((page - 1) * limit + 1).toLocaleString()} -{' '}
            {Math.min(page * limit, data.pagination.total).toLocaleString()} of{' '}
            {data.pagination.total.toLocaleString()} members
          </div>
        )}
      </CardContent>
    </Card>
  );
}
