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
import { getAllCommunitiesAdmin, getCommunityStats } from '@/lib/services/admin-communities';
import { CategoryManagementModal } from './CategoryManagementModal';
import { CommunityActionsModal } from './CommunityActionsModal';
import { BetterPagination } from '@/components/BetterPagination';
import { Community } from '@/lib/generated';

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
      console.log('API Params:', {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-black dark:text-white">Community Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage communities, members, and categories across the platform
          </p>
        </div>
        <Button
          onClick={() => setCategoryModalOpen(true)}
          className="cursor-pointer bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white"
        >
          <Tag className="h-4 w-4 mr-2" />
          Manage Categories
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Communities
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {stats.totalCommunities}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Active communities</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Public Communities
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Unlock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {stats.publicCommunities}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {stats.totalCommunities > 0
                ? Math.round((stats.publicCommunities / stats.totalCommunities) * 100)
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Private Communities
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {stats.privateCommunities}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
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
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search communities by name..."
                value={searchInput}
                onChange={e => handleSearch(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Privacy Filter */}
            <Select value={privacyFilter} onValueChange={handlePrivacyFilter}>
              <SelectTrigger className="w-full md:w-[200px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Filter by privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    All Communities
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Unlock className="h-4 w-4 text-green-500" />
                    Public Only
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-orange-500" />
                    Private Only
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full md:w-[200px] border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="-name">Name (Z-A)</SelectItem>
                <SelectItem value="-createdAt">Newest First</SelectItem>
                <SelectItem value="createdAt">Oldest First</SelectItem>
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
              Communities
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalCommunities} total)
              </span>
            </CardTitle>
            {searchQuery && (
              <Badge variant="secondary" className="text-xs">
                Filtered results
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isPending ? (
            <div className="flex flex-col justify-center items-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-500">Loading communities...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
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
              <p className="text-red-600 dark:text-red-400 font-medium">
                Failed to load communities
              </p>
              <p className="text-gray-500 text-sm mt-1">Please try again later</p>
            </div>
          ) : communities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">No communities found</p>
              <p className="text-gray-500 text-sm mt-1">
                {searchQuery ? 'Try adjusting your search' : 'Create your first community'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b-2">
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Name
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Category
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Privacy
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Members
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                        Created
                      </TableHead>
                      <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communities.map((community: Community) => (
                      <TableRow
                        key={community.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <TableCell className="font-semibold text-gray-900 dark:text-gray-100">
                          {community.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="capitalize font-medium bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {community.category?.name || 'No Category'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {community.isPrivate ? (
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                                <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                              </div>
                              <span className="font-medium text-orange-700 dark:text-orange-400">
                                Private
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                                <Unlock className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="font-medium text-green-700 dark:text-green-400">
                                Public
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
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
                            className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          >
                            <Settings className="h-4 w-4" />
                            <span className="ml-2 hidden sm:inline">Manage</span>
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
