'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Loader2,
  Search,
  Settings,
  Users,
  Lock,
  Unlock,
  Tag,
  Shield,
  BarChart3,
} from 'lucide-react';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';
import { getAllCommunitiesAdmin, getCommunityStats } from '@/lib/services/admin-communities';
import { CategoryManagementModal } from './CategoryManagementModal';
import { CommunityActionsModal } from './CommunityActionsModal';
import { BetterPagination } from '@/components/BetterPagination';
import { Community } from '@/lib/generated';
import { devLog } from '@/lib/logger';

export default function CommunityManagement() {
  const { language } = LanguageStore();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchInput, setSearchInput] = useState(''); // User's input
  const [searchQuery, setSearchQuery] = useState(''); // Debounced search query
  const [privacyFilter, setPrivacyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1); // Reset to first page on search
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch communities
  const { data, isPending, isError } = useQuery({
    queryKey: ['adminCommunities', language, page, pageSize, searchQuery, privacyFilter, sortBy],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', pageSize.toString());
      if (searchQuery) params.append('search', searchQuery);
      if (privacyFilter !== 'all') {
        params.append('isPrivate', (privacyFilter === 'private').toString());
      }
      if (sortBy) params.append('sortBy', sortBy);

      // Debug: Log what we're sending
      devLog('API Params:', {
        page: page.toString(),
        limit: pageSize.toString(),
        search: searchQuery || 'none',
        privacyFilter: privacyFilter,
        isPrivate: privacyFilter !== 'all' ? (privacyFilter === 'private').toString() : 'not sent',
        sortBy: sortBy || 'none',
        fullURL: params.toString(),
      });

      return getAllCommunitiesAdmin(language, params);
    },
  });

  // Fetch stats separately
  const { data: statsData } = useQuery({
    queryKey: ['adminCommunityStats', language],
    queryFn: () => getCommunityStats(language),
  });

  const communities = data?.body?.data?.communities || [];
  const totalPages = data?.body?.data?.pagination?.totalPages || 1;
  const totalCommunities = data?.body?.data?.pagination?.total || 0;
  const stats = statsData?.body?.data || {
    totalCommunities: 0,
    publicCommunities: 0,
    privateCommunities: 0,
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const handlePrivacyFilter = (value: string) => {
    setPrivacyFilter(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const openActionsModal = (community: Community) => {
    setSelectedCommunity(community);
    setActionsModalOpen(true);
  };

  return (
    <div className="min-h-screen space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 p-6 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            {t('admin:communityManagement.title', language)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('admin:communityManagement.description', language)}
          </p>
        </div>
        <Button
          onClick={() => setCategoryModalOpen(true)}
          className="cursor-pointer bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <Tag className="mr-2 h-4 w-4" />
          {t('admin:communityManagement.buttons.manageCategories', language)}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-none bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg transition-shadow hover:shadow-xl dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {t('admin:communityManagement.stats.totalCommunities', language)}
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {stats.totalCommunities}
            </div>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
              {t('admin:communityManagement.stats.activeCommunities', language)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-green-50 to-green-100 shadow-lg transition-shadow hover:shadow-xl dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              {t('admin:communityManagement.privacy.publicCommunities', language)}
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
              <Unlock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {stats.publicCommunities}
            </div>
            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
              {stats.totalCommunities > 0
                ? Math.round((stats.publicCommunities / stats.totalCommunities) * 100)
                : 0}
              % {t('admin:communityManagement.privacy.ofTotal', language)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg transition-shadow hover:shadow-xl dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              {t('admin:communityManagement.privacy.privateCommunities', language)}
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
              <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {stats.privateCommunities}
            </div>
            <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">
              {stats.totalCommunities > 0
                ? Math.round((stats.privateCommunities / stats.totalCommunities) * 100)
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder={t('admin:communityManagement.filters.search', language)}
                value={searchInput}
                onChange={e => handleSearch(e.target.value)}
                className="border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Privacy Filter */}
            <Select value={privacyFilter} onValueChange={handlePrivacyFilter}>
              <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 md:w-[200px]">
                <SelectValue placeholder="Filter by privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t('admin:communityManagement.filters.allCommunities', language)}
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Unlock className="h-4 w-4 text-green-500" />
                    {t('admin:communityManagement.filters.publicOnly', language)}
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-orange-500" />
                    {t('admin:communityManagement.filters.privateOnly', language)}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">
                  {t('admin:communityManagement.sorting.nameAZ', language)}
                </SelectItem>
                <SelectItem value="-name">
                  {t('admin:communityManagement.sorting.nameZA', language)}
                </SelectItem>
                <SelectItem value="-createdAt">
                  {t('admin:communityManagement.sorting.newestFirst', language)}
                </SelectItem>
                <SelectItem value="createdAt">
                  {t('admin:communityManagement.sorting.oldestFirst', language)}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Communities Table */}
      <Card className="border-none shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              {t('admin:communityManagement.messages.communities', language)}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalCommunities} {t('admin:communityManagement.messages.total', language)})
              </span>
            </CardTitle>
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                {t('admin:communityManagement.messages.filteredResults', language)}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isPending ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-blue-500" />
              <p className="text-gray-500">
                {t('admin:communityManagement.messages.loadingCommunities', language)}
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="font-medium text-red-600 dark:text-red-400">
                {t('admin:communityManagement.messages.failedToLoad', language)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {t('admin:communityManagement.messages.tryAgainLater', language)}
              </p>
            </div>
          ) : communities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-600 dark:text-gray-400">
                {t('admin:communityManagement.messages.noCommunitiesFound', language)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? t('admin:communityManagement.messages.tryAdjustingSearch', language)
                  : t('admin:communityManagement.messages.createFirstCommunity', language)}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 hover:bg-transparent">
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        {t('admin:communityManagement.tableHeaders.name', language)}
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        {t('admin:communityManagement.tableHeaders.category', language)}
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        {t('admin:communityManagement.tableHeaders.privacy', language)}
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        {t('admin:communityManagement.tableHeaders.members', language)}
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        {t('admin:communityManagement.tableHeaders.created', language)}
                      </TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">
                        {t('admin:communityManagement.tableHeaders.actions', language)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communities.map((community: Community) => (
                      <TableRow
                        key={community.id}
                        className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                          {community.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-blue-200 bg-blue-50 font-medium text-blue-700 capitalize dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          >
                            <Tag className="mr-1 h-3 w-3" />
                            {community.category?.name ||
                              t('admin:communityManagement.tableHeaders.noCategory', language)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {community.isPrivate ? (
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950">
                                <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                              </div>
                              <span className="font-medium text-orange-700 dark:text-orange-400">
                                {t('admin:communityManagement.privacy.private', language)}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                                <Unlock className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="font-medium text-green-700 dark:text-green-400">
                                {t('admin:communityManagement.privacy.public', language)}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {community._count?.members || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {new Date(community.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openActionsModal(community)}
                            className="cursor-pointer transition-colors hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                          >
                            <Settings className="h-4 w-4" />
                            <span className="ml-2 hidden sm:inline">
                              {t('admin:communityManagement.buttons.manage', language)}
                            </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-4">
                <BetterPagination
                  paginationMetadata={{
                    total: totalCommunities,
                    page: page,
                    pageSize: pageSize,
                    totalPages: totalPages,
                  }}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CategoryManagementModal open={categoryModalOpen} onOpenChange={setCategoryModalOpen} />
      <CommunityActionsModal
        open={actionsModalOpen}
        onOpenChange={setActionsModalOpen}
        community={
          selectedCommunity
            ? {
                id: selectedCommunity.id,
                name: selectedCommunity.name,
                isPrivate: selectedCommunity.isPrivate,
                category: selectedCommunity.category?.name || '',
              }
            : null
        }
      />
    </div>
  );
}
