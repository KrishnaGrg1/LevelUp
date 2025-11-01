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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User, PaginationMetadata } from '@/lib/generated';
import { Button } from '@/components/ui/button';
import DeleteDialog from '@/components/DeleteModal';

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading Users</h3>
          <p className="text-slate-400">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const users: User[] = (data?.body?.data?.users as unknown as User[]) || [];
  const metadata: PaginationMetadata | undefined = data?.body?.data?.pagination;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          User Management
        </h1>
        <p className="text-slate-400">Manage and monitor all registered users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="text-sm text-slate-400 mb-1">Total Users</div>
          <div className="text-3xl font-bold text-white">{metadata?.total || 0}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="text-sm text-slate-400 mb-1">Current Page</div>
          <div className="text-3xl font-bold text-white">{metadata?.page || 1}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <div className="text-sm text-slate-400 mb-1">Total Pages</div>
          <div className="text-3xl font-bold text-white">{metadata?.totalPages || 1}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/50 hover:bg-slate-800/50">
                <TableHead className="text-slate-300 font-semibold">ID</TableHead>
                <TableHead className="text-slate-300 font-semibold">Username</TableHead>
                <TableHead className="text-slate-300 font-semibold">Email</TableHead>
                <TableHead className="text-slate-300 font-semibold">XP</TableHead>
                <TableHead className="text-slate-300 font-semibold">Level</TableHead>
                <TableHead className="text-slate-300 font-semibold">Created At</TableHead>
                <TableHead className="text-slate-300 font-semibold">Status</TableHead>
                <TableHead className="text-slate-300 font-semibold ">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: User) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm text-slate-400">{user.id}</TableCell>
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
                    <TableCell className=" text-sm flex gap-2 ">
                      <a href={`user/${user.id}`}>
                        <Button variant="outline" size="sm" className="rounded-md cursor-pointer">
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
                        // Refetch the user list after successful deletion
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {metadata && (
          <div className="border-t border-slate-700/50 p-4 bg-slate-800/20">
            <BetterPagination
              paginationMetadata={metadata}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[10, 25, 50, 100]}
            />
          </div>
        )}
      </div>

      {/* Loading overlay for refetching */}
      {isFetching && !isPending && (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
            <span className="text-sm text-slate-300">Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
}
