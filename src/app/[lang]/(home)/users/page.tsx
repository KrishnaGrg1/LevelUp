// components/UserManagement.tsx
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
import { BetterPagination } from '@/components/BetterPagination';
import { getAllUsers } from '@/lib/services/user';
import LanguageStore from '@/stores/useLanguage';
import { usePaginationStore } from '@/stores/usePagination';
import { QueryClient, useQuery } from '@tanstack/react-query';
import type { User, PaginationMetadata } from '@/lib/generated';
import { Button } from '@/components/ui/button';
import DeleteDialog from '@/components/DeleteModal';
import { useQueryClient } from '@tanstack/react-query';

export const UserManagement = () => {
  const queryClient = new QueryClient();
  const { language } = LanguageStore();
  const { page, pageSize, setPage, setPageSize } = usePaginationStore();

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setPageSize],
  );

  // Transform pagination metadata to match BetterPagination component
  const paginationMetadata: PaginationMetadata | undefined = React.useMemo(() => {
    if (!data?.body?.data?.pagination) return undefined;

    const pagination = data.body.data.pagination;
    return {
      total: pagination.total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: pagination.totalPages,
      total_pages: pagination.totalPages,
      previous_page: pagination.page > 1 ? pagination.page - 1 : undefined,
      next_page: pagination.page < pagination.totalPages ? pagination.page + 1 : undefined,
    };
  }, [data]);

  const users = data?.body?.data?.users ?? [];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2 font-bold">User Management</h1>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
          Manage all users with advanced pagination
        </p>
      </div>

      <div className="space-y-4">
        {/* Loading State */}
        {isPending && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading users...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <h3 className="text-destructive font-semibold mb-1">Error loading users</h3>
            <p className="text-destructive/80 text-sm">
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </p>
          </div>
        )}

        {/* Users Table */}
        {!isPending && !isError && data && (
          <>
            <div className="relative">
              {/* Fetching Indicator */}
              {isFetching && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-md px-3 py-1.5">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                    <span className="text-xs text-muted-foreground">Updating...</span>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Username</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">XP</TableHead>
                      <TableHead className="font-semibold">Level</TableHead>
                      <TableHead className="font-semibold">Created</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <svg
                              className="w-16 h-16 text-muted-foreground/50"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                              />
                            </svg>
                            <div>
                              <p className="font-medium text-foreground">No users found</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Try adjusting your search criteria
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user: User) => (
                        <TableRow key={user.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{user.UserName}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {user.xp.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Level {user.level}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                                user.isVerified
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}
                            >
                              {user.isVerified ? (
                                <>
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Verified
                                </>
                              ) : (
                                <>UnVerified</>
                              )}
                            </span>
                          </TableCell>
                          <TableCell className=" text-sm flex gap-2 text-right">
                            <a href={`user/${user.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-md cursor-pointer"
                              >
                                Edit
                              </Button>
                            </a>
                            <DeleteDialog
                              formAction="/api/v1/admin/delete"
                              title="Confirm Deletion"
                              description="Are you sure you want to delete this user? This action cannot be undone."
                              id={user.id}
                              onSuccess={() =>
                                queryClient.invalidateQueries({ queryKey: ['users'] })
                              }
                              // Refetch the user list after successful deletion
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            {paginationMetadata && (
              <BetterPagination
                className="mt-6"
                paginationMetadata={paginationMetadata}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[10, 25, 50, 100]}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
