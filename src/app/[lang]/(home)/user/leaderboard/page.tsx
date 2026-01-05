'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getGlobalLeaderboard,
  getTopCommunities,
  getTopClans,
  type CommunitySortBy,
  type ClanSortBy,
  type SortOrder,
} from '@/lib/services/leaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Loader2, Users, Shield, Calendar } from 'lucide-react';
import { BetterPagination } from '@/components/BetterPagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type TabKey = 'global' | 'communities' | 'clans';

export default function LeaderboardsPage() {
  const [tab, setTab] = useState<TabKey>('global');

  // Global
  const [globalPage, setGlobalPage] = useState(1);
  const globalLimit = 20;

  const globalQuery = useQuery({
    queryKey: ['global-leaderboard', globalPage, globalLimit],
    queryFn: () => getGlobalLeaderboard({ page: globalPage, limit: globalLimit }),
    staleTime: 30000,
  });

  // Communities
  const [communityPage, setCommunityPage] = useState(1);
  const [communitySortBy, setCommunitySortBy] = useState<CommunitySortBy>('xp');
  const [communityOrder, setCommunityOrder] = useState<SortOrder>('desc');
  const communityLimit = 20;

  const communityQuery = useQuery({
    queryKey: ['top-communities', communityPage, communityLimit, communitySortBy, communityOrder],
    queryFn: () =>
      getTopCommunities({
        page: communityPage,
        limit: communityLimit,
        sortBy: communitySortBy,
        order: communityOrder,
      }),
    staleTime: 30000,
  });

  // Clans
  const [clanPage, setClanPage] = useState(1);
  const [clanSortBy, setClanSortBy] = useState<ClanSortBy>('xp');
  const [clanOrder, setClanOrder] = useState<SortOrder>('desc');
  const [clanCommunityFilter, setClanCommunityFilter] = useState('');
  const [clanCommunityApplied, setClanCommunityApplied] = useState('');
  const clanLimit = 20;

  const clanQuery = useQuery({
    queryKey: ['top-clans', clanPage, clanLimit, clanSortBy, clanOrder, clanCommunityApplied],
    queryFn: () =>
      getTopClans({
        page: clanPage,
        limit: clanLimit,
        sortBy: clanSortBy,
        order: clanOrder,
        communityId: clanCommunityApplied || undefined,
      }),
    staleTime: 30000,
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return <Trophy className="h-6 w-6 fill-yellow-500 text-yellow-500" aria-label="1st place" />;
    if (rank === 2)
      return <Medal className="h-6 w-6 fill-gray-400 text-gray-400" aria-label="2nd place" />;
    if (rank === 3)
      return <Award className="h-6 w-6 fill-amber-600 text-amber-600" aria-label="3rd place" />;
    return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
  };

  const renderGlobal = () => {
    const { data, isPending, isError } = globalQuery;
    const limit = globalLimit;

    return (
      <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
        <CardHeader className="border-b border-gray-200 dark:border-gray-800">
          <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Top Players</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isPending ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-gray-700 dark:text-gray-300" />
            </div>
          ) : isError ? (
            <div className="py-20 text-center">
              <p className="text-red-500 dark:text-red-400">Failed to load leaderboard</p>
            </div>
          ) : !data?.results || data.results.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">No users found</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {data.results.map((user, index) => {
                  const rank = (globalPage - 1) * limit + index + 1;
                  const isTopThree = rank <= 3;

                  return (
                    <div
                      key={user.id}
                      className={`flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50 ${
                        isTopThree ? 'bg-gray-50 dark:bg-gray-900/30' : ''
                      }`}
                    >
                      <div className="flex w-12 justify-center">{getRankIcon(rank)}</div>

                      <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-800">
                        <AvatarImage src={user.profilePicture || undefined} alt={user.UserName} />
                        <AvatarFallback className="bg-gray-100 font-semibold text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                          {user.UserName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-gray-900 dark:text-white">
                          {user.UserName}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="border border-gray-200 bg-gray-100 text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                          >
                            Level {user.level}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.tokens.toLocaleString()} tokens
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">XP</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {user.xp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {data.pagination.totalPages > 1 && (
                <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                  <BetterPagination
                    paginationMetadata={{
                      total: data.pagination.total,
                      page: globalPage,
                      pageSize: limit,
                      totalPages: data.pagination.totalPages,
                    }}
                    onPageChange={setGlobalPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCommunities = () => {
    const { data, isPending, isError } = communityQuery;
    const limit = communityLimit;

    return (
      <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
        <CardHeader className="flex flex-col gap-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
              <Trophy className="h-5 w-5 text-gray-900 dark:text-gray-100" /> Top Communities
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              Sorted by {communitySortBy} ({communityOrder})
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Sort By</label>
              <Select
                value={communitySortBy}
                onValueChange={v => {
                  setCommunitySortBy(v as CommunitySortBy);
                  setCommunityPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xp">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" /> XP
                    </div>
                  </SelectItem>
                  <SelectItem value="members">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> Members
                    </div>
                  </SelectItem>
                  <SelectItem value="createdAt">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Created
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Order</label>
              <Select
                value={communityOrder}
                onValueChange={v => {
                  setCommunityOrder(v as SortOrder);
                  setCommunityPage(1);
                }}
              >
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
        </CardHeader>

        <CardContent className="p-0">
          {isPending ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-gray-700 dark:text-gray-300" />
            </div>
          ) : isError ? (
            <div className="py-20 text-center">
              <p className="text-red-500 dark:text-red-400">Failed to load communities</p>
            </div>
          ) : !data?.results || data.results.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">No communities found</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {data.results.map((community, index) => {
                  const rank = (communityPage - 1) * limit + index + 1;
                  const isTopThree = rank <= 3;
                  const occupancy = Math.round(
                    (community.memberCount / community.memberLimit) * 100,
                  );

                  return (
                    <div
                      key={community.id}
                      className={`flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50 ${
                        isTopThree ? 'bg-gray-50 dark:bg-gray-900/30' : ''
                      }`}
                    >
                      <div className="flex w-12 justify-center">{getRankIcon(rank)}</div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-bold text-gray-900 dark:text-white">
                          {community.name}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge className="border border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                            <Trophy className="mr-1 h-3 w-3" />
                            {community.xp.toLocaleString()} XP
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="border border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                          >
                            <Users className="mr-1 h-3 w-3" />
                            {community.memberCount} / {community.memberLimit} ({occupancy}%)
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Created {new Date(community.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {communitySortBy === 'xp' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              XP
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {community.xp.toLocaleString()}
                            </p>
                          </>
                        )}
                        {communitySortBy === 'members' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Members
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {community.memberCount}
                            </p>
                          </>
                        )}
                        {communitySortBy === 'createdAt' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Age
                            </p>
                            <p className="text-base font-bold text-gray-900 dark:text-gray-100">
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

              {data.pagination.totalPages > 1 && (
                <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                  <BetterPagination
                    paginationMetadata={{
                      total: data.pagination.total,
                      page: communityPage,
                      pageSize: limit,
                      totalPages: data.pagination.totalPages,
                    }}
                    onPageChange={setCommunityPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderClans = () => {
    const { data, isPending, isError } = clanQuery;
    const limit = clanLimit;

    return (
      <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
        <CardHeader className="flex flex-col gap-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
              <Shield className="h-5 w-5 text-gray-900 dark:text-gray-100" /> Top Clans
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              Sorted by {clanSortBy} ({clanOrder})
              {clanCommunityApplied && <span> | Community: {clanCommunityApplied}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Sort By</label>
              <Select
                value={clanSortBy}
                onValueChange={v => {
                  setClanSortBy(v as ClanSortBy);
                  setClanPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xp">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" /> XP
                    </div>
                  </SelectItem>
                  <SelectItem value="members">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> Members
                    </div>
                  </SelectItem>
                  <SelectItem value="createdAt">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Created
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Order</label>
              <Select
                value={clanOrder}
                onValueChange={v => {
                  setClanOrder(v as SortOrder);
                  setClanPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Highest First</SelectItem>
                  <SelectItem value="asc">Lowest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">
                Community ID (optional)
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter community id"
                  value={clanCommunityFilter}
                  onChange={e => setClanCommunityFilter(e.target.value)}
                />
                <button
                  onClick={() => {
                    setClanCommunityApplied(clanCommunityFilter.trim());
                    setClanPage(1);
                  }}
                  className="rounded-md bg-black px-3 py-2 text-sm text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Apply
                </button>
                {clanCommunityApplied && (
                  <button
                    onClick={() => {
                      setClanCommunityFilter('');
                      setClanCommunityApplied('');
                      setClanPage(1);
                    }}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isPending ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-gray-700 dark:text-gray-300" />
            </div>
          ) : isError ? (
            <div className="py-20 text-center">
              <p className="text-red-500 dark:text-red-400">Failed to load clans</p>
            </div>
          ) : !data?.results || data.results.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400">No clans found</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {data.results.map((clan, index) => {
                  const rank = (clanPage - 1) * limit + index + 1;
                  const isTopThree = rank <= 3;
                  const occupancy = Math.round((clan.memberCount / clan.limit) * 100);

                  return (
                    <div
                      key={clan.id}
                      className={`flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50 ${
                        isTopThree ? 'bg-gray-50 dark:bg-gray-900/30' : ''
                      }`}
                    >
                      <div className="flex w-12 justify-center">{getRankIcon(rank)}</div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-bold text-gray-900 dark:text-white">
                          {clan.name}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge className="border border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                            <Trophy className="mr-1 h-3 w-3" />
                            {clan.xp.toLocaleString()} XP
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="border border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                          >
                            <Users className="mr-1 h-3 w-3" />
                            {clan.memberCount} / {clan.limit} ({occupancy}%)
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Created {new Date(clan.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {clanSortBy === 'xp' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              XP
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {clan.xp.toLocaleString()}
                            </p>
                          </>
                        )}
                        {clanSortBy === 'members' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Members
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {clan.memberCount}
                            </p>
                          </>
                        )}
                        {clanSortBy === 'createdAt' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              Age
                            </p>
                            <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                              {Math.floor(
                                (Date.now() - new Date(clan.createdAt).getTime()) /
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

              {data.pagination.totalPages > 1 && (
                <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                  <BetterPagination
                    paginationMetadata={{
                      total: data.pagination.total,
                      page: clanPage,
                      pageSize: limit,
                      totalPages: data.pagination.totalPages,
                    }}
                    onPageChange={setClanPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 dark:bg-black">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="mb-2">
          <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Leaderboards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Global users, top communities, and top clans — all in one place.
          </p>
        </div>

        <Tabs value={tab} onValueChange={v => setTab(v as TabKey)}>
          <TabsList className="grid h-11 w-full grid-cols-3 rounded-lg border border-gray-200 bg-white sm:w-[520px] dark:border-gray-800 dark:bg-black">
            <TabsTrigger
              value="global"
              className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Global Users
            </TabsTrigger>
            <TabsTrigger
              value="communities"
              className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Top Communities
            </TabsTrigger>
            <TabsTrigger
              value="clans"
              className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
            >
              Top Clans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-4">
            {renderGlobal()}
          </TabsContent>

          <TabsContent value="communities" className="mt-4">
            {renderCommunities()}
          </TabsContent>

          <TabsContent value="clans" className="mt-4">
            {renderClans()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
