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
      return <Trophy className="h-5 w-5 fill-yellow-500 text-yellow-500" aria-label="1st place" />;
    if (rank === 2)
      return <Medal className="h-5 w-5 fill-gray-400 text-gray-400" aria-label="2nd place" />;
    if (rank === 3)
      return <Award className="h-5 w-5 fill-amber-600 text-amber-600" aria-label="3rd place" />;
    return <span className="text-sm font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
  };

  if (isPending) {
    return (
      <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
        <CardContent className="p-6">
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-700 dark:text-gray-300" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border border-red-200 bg-white shadow-sm dark:border-red-900/40 dark:bg-black">
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
      <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
        <CardContent className="p-6">
          <div className="py-10 text-center">
            <Shield className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">No members found in this clan</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
      <CardHeader className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
            <Trophy className="h-5 w-5 text-gray-900 dark:text-gray-100" />
            {data.clan.name} Rankings
          </CardTitle>
          <Badge className="border border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            {data.clan.xp.toLocaleString()} Clan XP
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {data.results.map((member, index) => {
            const rank = (page - 1) * limit + index + 1;
            const isTopThree = rank <= 3;

            return (
              <div
                key={member.id}
                className={`flex items-center gap-3 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  isTopThree ? 'bg-gray-50 dark:bg-gray-900/30' : ''
                }`}
              >
                {/* Rank */}
                <div className="flex w-10 justify-center">{getRankIcon(rank)}</div>

                {/* Avatar & Name */}
                <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-800">
                  <AvatarImage
                    src={member.user.profilePicture || undefined}
                    alt={member.user.UserName}
                  />
                  <AvatarFallback className="bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                    {member.user.UserName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {member.user.UserName}
                  </p>
                </div>

                {/* XP */}
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Clan XP</p>
                  <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {member.totalXP.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="border-t border-gray-200 p-3 dark:border-gray-800">
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
          <div className="border-t border-gray-200 p-2 text-center text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            Showing {((page - 1) * limit + 1).toLocaleString()} -{' '}
            {Math.min(page * limit, data.pagination.total).toLocaleString()} of{' '}
            {data.pagination.total.toLocaleString()} members
          </div>
        )}
      </CardContent>
    </Card>
  );
}
