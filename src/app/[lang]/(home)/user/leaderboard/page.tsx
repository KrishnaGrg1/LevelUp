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
import { t } from '@/translations';

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

  const getRankIcon = (rank: number, color: 'yellow' | 'blue' | 'cyan') => {
    const map = {
      yellow: {
        first: 'text-yellow-500',
        second: 'text-gray-400',
        third: 'text-amber-600',
        bgFirst: 'from-yellow-50 dark:from-yellow-900/10',
      },
      blue: {
        first: 'text-blue-600',
        second: 'text-gray-400',
        third: 'text-amber-600',
        bgFirst: 'from-blue-50 dark:from-blue-900/10',
      },
      cyan: {
        first: 'text-cyan-600',
        second: 'text-gray-400',
        third: 'text-amber-600',
        bgFirst: 'from-cyan-50 dark:from-cyan-900/10',
      },
    } as const;

    const palette = map[color];

    if (rank === 1) return <Trophy className={`h-6 w-6 ${palette.first}`} aria-label="1st place" />;
    if (rank === 2) return <Medal className={`h-6 w-6 ${palette.second}`} aria-label="2nd place" />;
    if (rank === 3) return <Award className={`h-6 w-6 ${palette.third}`} aria-label="3rd place" />;
    return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
  };

  const renderGlobal = () => {
    const { data, isPending, isError } = globalQuery;
    const limit = globalLimit;

    return (
      <Card className="border-purple-500/20 bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-purple-500/10">
          <CardTitle className="text-xl text-gray-900 dark:text-white">
            {t('leaderboard.page.global.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isPending ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-purple-600 dark:text-purple-400" />
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-red-500 dark:text-red-400">
                {t('leaderboard.page.global.failed')}
              </p>
            </div>
          ) : !data?.results || data.results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">
                {t('leaderboard.page.global.noUsers')}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.results.map((user, index) => {
                  const rank = (globalPage - 1) * limit + index + 1;
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
                      <div className="w-12 flex justify-center">{getRankIcon(rank, 'yellow')}</div>

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
                            {t('leaderboard.page.global.level')} {user.level}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.tokens.toLocaleString()} {t('leaderboard.page.global.tokens')}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {t('leaderboard.xp')}
                        </p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {user.xp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {data.pagination.totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
      <Card className="border-blue-500/20 bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-blue-500/10 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-600" /> {t('leaderboard.page.communities.title')}
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              {t('leaderboard.page.communities.sortedBy', {
                sortBy: communitySortBy,
                order: communityOrder,
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">
                {t('leaderboard.page.communities.sortBy')}
              </label>
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
                      <Trophy className="h-4 w-4" /> {t('leaderboard.page.communities.xp')}
                    </div>
                  </SelectItem>
                  <SelectItem value="members">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> {t('leaderboard.page.communities.members')}
                    </div>
                  </SelectItem>
                  <SelectItem value="createdAt">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {t('leaderboard.page.communities.created')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">
                {t('leaderboard.page.communities.order')}
              </label>
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
                  <SelectItem value="desc">
                    {t('leaderboard.page.communities.highestFirst')}
                  </SelectItem>
                  <SelectItem value="asc">
                    {t('leaderboard.page.communities.lowestFirst')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isPending ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-red-500 dark:text-red-400">
                {t('leaderboard.page.communities.failed')}
              </p>
            </div>
          ) : !data?.results || data.results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">
                {t('leaderboard.page.communities.noCommunities')}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.results.map((community, index) => {
                  const rank = (communityPage - 1) * limit + index + 1;
                  const isTopThree = rank <= 3;
                  const occupancy = community.memberLimit
                    ? Math.round((community.memberCount / community.memberLimit) * 100)
                    : 0;

                  return (
                    <div
                      key={community.id}
                      className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        isTopThree
                          ? 'bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent'
                          : ''
                      }`}
                    >
                      <div className="w-12 flex justify-center">{getRankIcon(rank, 'blue')}</div>

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

                      <div className="text-right shrink-0">
                        {communitySortBy === 'xp' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {t('leaderboard.page.communities.xp')}
                            </p>
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                              {community.xp.toLocaleString()}
                            </p>
                          </>
                        )}
                        {communitySortBy === 'members' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {t('leaderboard.page.communities.members')}
                            </p>
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                              {community.memberCount}
                            </p>
                          </>
                        )}
                        {communitySortBy === 'createdAt' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {t('leaderboard.page.communities.age')}
                            </p>
                            <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                              {Math.floor(
                                (Date.now() - new Date(community.createdAt).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )}{' '}
                              {t('leaderboard.page.communities.days')}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {data.pagination.totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
      <Card className="border-cyan-500/20 bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-cyan-500/10 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-cyan-600" /> {t('leaderboard.page.clans.title')}
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              {t('leaderboard.page.clans.sortedBy', { sortBy: clanSortBy, order: clanOrder })}
              {clanCommunityApplied && (
                <span>
                  {' '}
                  | {t('leaderboard.page.clans.communityFilter', { id: clanCommunityApplied })}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">
                {t('leaderboard.page.clans.sortBy')}
              </label>
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
                      <Trophy className="h-4 w-4" /> {t('leaderboard.page.clans.xp')}
                    </div>
                  </SelectItem>
                  <SelectItem value="members">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> {t('leaderboard.page.clans.members')}
                    </div>
                  </SelectItem>
                  <SelectItem value="createdAt">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {t('leaderboard.page.clans.created')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">
                {t('leaderboard.page.clans.order')}
              </label>
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
                  <SelectItem value="desc">{t('leaderboard.page.clans.highestFirst')}</SelectItem>
                  <SelectItem value="asc">{t('leaderboard.page.clans.lowestFirst')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs text-gray-600 dark:text-gray-400">
                {t('leaderboard.page.clans.communityId')}
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder={t('leaderboard.page.clans.enterCommunityId')}
                  value={clanCommunityFilter}
                  onChange={e => setClanCommunityFilter(e.target.value)}
                />
                <button
                  onClick={() => {
                    setClanCommunityApplied(clanCommunityFilter.trim());
                    setClanPage(1);
                  }}
                  className="px-3 py-2 text-sm rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
                >
                  {t('leaderboard.page.clans.apply')}
                </button>
                {clanCommunityApplied && (
                  <button
                    onClick={() => {
                      setClanCommunityFilter('');
                      setClanCommunityApplied('');
                      setClanPage(1);
                    }}
                    className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {t('leaderboard.page.clans.clear')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isPending ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-600 dark:text-cyan-400" />
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <p className="text-red-500 dark:text-red-400">{t('leaderboard.page.clans.failed')}</p>
            </div>
          ) : !data?.results || data.results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">
                {t('leaderboard.page.clans.noClans')}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.results.map((clan, index) => {
                  const rank = (clanPage - 1) * limit + index + 1;
                  const isTopThree = rank <= 3;
                  const occupancy = clan.limit
                    ? Math.round((clan.memberCount / clan.limit) * 100)
                    : 0;

                  return (
                    <div
                      key={clan.id}
                      className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        isTopThree
                          ? 'bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-900/10 dark:to-transparent'
                          : ''
                      }`}
                    >
                      <div className="w-12 flex justify-center">{getRankIcon(rank, 'cyan')}</div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg">
                          {clan.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge className="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300">
                            <Trophy className="h-3 w-3 mr-1" />
                            {clan.xp.toLocaleString()} XP
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            <Users className="h-3 w-3 mr-1" />
                            {clan.memberCount} / {clan.limit} ({occupancy}%)
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Created {new Date(clan.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {clanSortBy === 'xp' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {t('leaderboard.page.clans.xp')}
                            </p>
                            <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                              {clan.xp.toLocaleString()}
                            </p>
                          </>
                        )}
                        {clanSortBy === 'members' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {t('leaderboard.page.clans.members')}
                            </p>
                            <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                              {clan.memberCount}
                            </p>
                          </>
                        )}
                        {clanSortBy === 'createdAt' && (
                          <>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {t('leaderboard.page.clans.age')}
                            </p>
                            <p className="text-base font-bold text-cyan-600 dark:text-cyan-400">
                              {Math.floor(
                                (Date.now() - new Date(clan.createdAt).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )}{' '}
                              {t('leaderboard.page.clans.days')}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {data.pagination.totalPages > 1 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            {t('leaderboard.page.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{t('leaderboard.page.subtitle')}</p>
        </div>

        <Tabs value={tab} onValueChange={v => setTab(v as TabKey)}>
          <TabsList className="grid grid-cols-3 w-full sm:w-[520px]">
            <TabsTrigger value="global">{t('leaderboard.page.tabs.global')}</TabsTrigger>
            <TabsTrigger value="communities">{t('leaderboard.page.tabs.communities')}</TabsTrigger>
            <TabsTrigger value="clans">{t('leaderboard.page.tabs.clans')}</TabsTrigger>
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
