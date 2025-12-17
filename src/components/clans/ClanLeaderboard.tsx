'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getClanLeaderboard } from '@/lib/services/leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Loader2, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BetterPagination } from '@/components/BetterPagination';

interface ClanLeaderboardProps {
  clanId: string;
}

export default function ClanLeaderboard({ clanId }: ClanLeaderboardProps) {
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isPending, isError } = useQuery({
    queryKey: ['clan-leaderboard', clanId, page, limit],
    queryFn: () => getClanLeaderboard(clanId, { page, limit }),
    staleTime: 30000,
    enabled: !!clanId,
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
      <Card className="border-cyan-500/20 bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600 dark:text-cyan-400" />
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
            Failed to load clan leaderboard
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
            <Shield className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">No members found in this clan</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-cyan-500/20 bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-cyan-500/10 bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-900/20 dark:to-transparent">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            {data.clan.name} Rankings
          </CardTitle>
          <Badge className="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 border-0">
            {data.clan.xp.toLocaleString()} Clan XP
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
                    ? 'bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-900/10 dark:to-transparent'
                    : ''
                }`}
              >
                {/* Rank */}
                <div className="w-10 flex justify-center">{getRankIcon(rank)}</div>

                {/* Avatar & Name */}
                <Avatar className="h-10 w-10 border-2 border-cyan-200 dark:border-cyan-800">
                  <AvatarImage
                    src={member.user.profilePicture || undefined}
                    alt={member.user.UserName}
                  />
                  <AvatarFallback className="bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 font-semibold text-sm">
                    {member.user.UserName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                    {member.user.UserName}
                  </p>
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Clan XP</p>
                  <p className="text-base font-bold text-cyan-600 dark:text-cyan-400">
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
