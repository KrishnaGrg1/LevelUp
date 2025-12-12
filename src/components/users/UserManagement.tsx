'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BetterPagination } from '@/components/BetterPagination';
import { getAllUsers } from '@/lib/services/user';
import LanguageStore from '@/stores/useLanguage';
import { usePaginationStore } from '@/stores/usePagination';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User, PaginationMetadata } from '@/lib/generated';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DeleteDialog from '@/components/DeleteModal';
import {
  Users,
  TrendingUp,
  Calendar,
  Mail,
  Star,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Edit,
} from 'lucide-react';

export default function UserManagement() {
  const { language } = LanguageStore();
  const { page, pageSize, setPage, setPageSize } = usePaginationStore();
  const queryClient = useQueryClient();

  // Fetch users with pagination
  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['users', language, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      return await getAllUsers(language, params);
    },
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Handle page change
  const handlePageChange = React.useCallback(
    (newPage: number) => {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setPage],
  );

  // Handle page size change
  const handlePageSizeChange = React.useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      setPage(1); // Reset to first page when changing page size
    },
    [setPageSize, setPage],
  );

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-zinc-900 dark:text-zinc-50" />
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading users...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex min-h-[400px] items-center justify-center">
            <Card className="border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10">
              <CardContent className="p-8 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-600 dark:text-red-400" />
                <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Error Loading Users
                </h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
                <Button onClick={() => window.location.reload()} className="mt-4 cursor-pointer">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const users: User[] = (data?.body?.data?.users as unknown as User[]) || [];
  const metadata: PaginationMetadata | undefined = data?.body?.data?.pagination;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-heading text-4xl font-bold text-black dark:text-white">
            User Management
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage and monitor all registered users
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            label="Total Users"
            value={metadata?.total?.toLocaleString() || '0'}
            bgColor="bg-blue-50 dark:bg-blue-900/10"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
            label="Current Page"
            value={(metadata?.page || 1).toString()}
            bgColor="bg-purple-50 dark:bg-purple-900/10"
          />
          <StatCard
            icon={<Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />}
            label="Total Pages"
            value={(metadata?.totalPages || 1).toString()}
            bgColor="bg-green-50 dark:bg-green-900/10"
          />
        </div>

        {/* Users Table */}
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5" />
              All Users
            </CardTitle>
            <CardDescription>
              Showing {users.length} of {metadata?.total || 0} users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50 hover:bg-zinc-50 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/50">
                    <TableHead className="font-semibold text-zinc-900 dark:text-zinc-50">
                      ID
                    </TableHead>
                    <TableHead className="font-semibold text-zinc-900 dark:text-zinc-50">
                      Username
                    </TableHead>
                    <TableHead className="font-semibold text-zinc-900 dark:text-zinc-50">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold text-zinc-900 dark:text-zinc-50">
                      XP
                    </TableHead>
                    <TableHead className="font-semibold text-zinc-900 dark:text-zinc-50">
                      Level
                    </TableHead>
                    <TableHead className="font-semibold text-zinc-900 dark:text-zinc-50">
                      Joined
                    </TableHead>
                    <TableHead className="font-semibold text-zinc-900 dark:text-zinc-50">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-zinc-900 dark:text-zinc-50">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-32 text-center text-zinc-600 dark:text-zinc-400"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="h-8 w-8 text-zinc-400" />
                          <p>No users found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user: User) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
                      >
                        <TableCell className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                          {/* {user.id.slice(0, 8)}... */}
                          {user.id}
                        </TableCell>
                        <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                          {user.UserName}
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            <Star className="h-3 w-3" />
                            {user.xp.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          >
                            <TrendingUp className="h-3 w-3" />
                            Level {user.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-zinc-600 dark:text-zinc-400">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`gap-1 ${
                              user.isVerified
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                          >
                            {user.isVerified ? (
                              <>
                                <ShieldCheck className="h-3 w-3" />
                                Verified
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <a href={`users/${user.id}/edit`}>
                              <Button variant="outline" size="sm" className="cursor-pointer gap-1">
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>
                            </a>
                            <DeleteDialog
                              title="Confirm Deletion"
                              description="Are you sure you want to delete this user? This action cannot be undone."
                              id={user.id}
                              onSuccess={() => {
                                queryClient.invalidateQueries({ queryKey: ['users'] });
                                queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {metadata && (
              <div className="mt-4">
                <BetterPagination
                  paginationMetadata={metadata}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  pageSizeOptions={[10, 25, 50, 100]}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loading overlay for refetching */}
        {isFetching && !isPending && (
          <div className="fixed bottom-4 right-4 z-50">
            <Card className="border-0 shadow-lg">
              <CardContent className="flex items-center gap-3 p-4">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-900 dark:text-zinc-50" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Updating...
                </span>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}) {
  return (
    <Card className=" shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bgColor}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
            <p className="mt-1 font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
