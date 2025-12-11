'use client';

import React, { useState } from 'react';
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
import { Loader2, Search, Settings, Users, Lock, Unlock, Tag } from 'lucide-react';
import LanguageStore from '@/stores/useLanguage';
import { getAllCommunitiesAdmin, getCommunityStats } from '@/lib/services/admin-communities';
import { CategoryManagementModal } from './CategoryManagementModal';
import { CommunityActionsModal } from './CommunityActionsModal';
import { BetterPagination } from '@/components/BetterPagination';

export default function CommunityManagement() {
  const { language } = LanguageStore();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);

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
  const totalCommunities = data?.body?.data?.pagination?.totalCommunities || 0;
  const stats = statsData?.body?.data || {
    totalCommunities: 0,
    publicCommunities: 0,
    privateCommunities: 0,
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handlePrivacyFilter = (value: string) => {
    setPrivacyFilter(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const openActionsModal = (community: any) => {
    setSelectedCommunity(community);
    setActionsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Management</h1>
          <p className="text-gray-500 mt-1">Manage communities, members, and categories</p>
        </div>
        <Button onClick={() => setCategoryModalOpen(true)} className="cursor-pointer">
          <Tag className="h-4 w-4 mr-2" />
          Manage Categories
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Communities</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCommunities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Communities</CardTitle>
            <Unlock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publicCommunities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Private Communities</CardTitle>
            <Lock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.privateCommunities}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search communities by name..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Privacy Filter */}
            <Select value={privacyFilter} onValueChange={handlePrivacyFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Communities</SelectItem>
                <SelectItem value="public">Public Only</SelectItem>
                <SelectItem value="private">Private Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full md:w-[200px]">
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
      <Card>
        <CardHeader>
          <CardTitle>Communities ({totalCommunities})</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">
              Failed to load communities. Please try again.
            </div>
          ) : communities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No communities found.</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Privacy</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communities.map((community: any) => (
                      <TableRow key={community.id}>
                        <TableCell className="font-medium">{community.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {community.category || 'No Category'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {community.isPrivate ? (
                              <>
                                <Lock className="h-4 w-4 text-orange-500" />
                                <span className="text-orange-600 dark:text-orange-400">
                                  Private
                                </span>
                              </>
                            ) : (
                              <>
                                <Unlock className="h-4 w-4 text-green-500" />
                                <span className="text-green-600 dark:text-green-400">Public</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            {community.membersCount || 0}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(community.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openActionsModal(community)}
                            className="cursor-pointer"
                          >
                            <Settings className="h-4 w-4" />
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
        community={selectedCommunity}
      />
    </div>
  );
}
