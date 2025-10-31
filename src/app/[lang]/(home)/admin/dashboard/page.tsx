'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Shield, Activity } from 'lucide-react';
import LanguageStore from '@/stores/useLanguage';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { adminOverview } from '@/lib/services/user';
import { UserGrowthChart } from '@/components/users/chart';

export default function AdminDashboard() {
  const { language } = LanguageStore();

  // Fetch admin overview data
  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ['admin-overview', language],
    queryFn: () => adminOverview(language),
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const stats = data?.body?.data;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2 font-bold text-blue-400">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
          System overview and administrative controls
        </p>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-blue-500/20 bg-blue-500/5">
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-4 bg-blue-300/30 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-blue-300/30 rounded w-16"></div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mb-8">
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-400">
                <Activity className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Failed to load dashboard data</h3>
                  <p className="text-sm text-red-300">
                    {error instanceof Error ? error.message : 'An unknown error occurred'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Cards */}
      {!isPending && !isError && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <Card className="border-2 border-blue-400/60 bg-blue-500/5 relative shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:border-blue-400/80 transition-all duration-300 ring-1 ring-blue-500/20">
            {isFetching && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium text-blue-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-b-lg">
              <div className="text-2xl font-bold text-blue-100 drop-shadow-sm">
                {stats.totalUsers?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-blue-300/80 font-medium">Total registered users</p>
            </CardContent>
          </Card>

          {/* Verified Users */}
          <Card className="border-2 border-sky-400/60 bg-sky-500/5 relative shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30 hover:border-sky-400/80 transition-all duration-300 ring-1 ring-sky-500/20">
            {isFetching && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-sky-500"></div>
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium text-sky-300">Verified Users</CardTitle>
              <UserCheck className="h-4 w-4 text-sky-400" />
            </CardHeader>
            <CardContent className="bg-gradient-to-br from-sky-500/10 to-cyan-600/5 rounded-b-lg">
              <div className="text-2xl font-bold text-sky-100 drop-shadow-sm">
                {stats.verifiedUsers?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-sky-300/80 font-medium">Users with verified accounts</p>
            </CardContent>
          </Card>

          {/* Admin Users */}
          <Card className="border-2 border-yellow-400/60 bg-yellow-500/5 relative shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 hover:border-yellow-400/80 transition-all duration-300 ring-1 ring-yellow-500/20">
            {isFetching && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-500"></div>
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium text-yellow-300">Admin Users</CardTitle>
              <Shield className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent className="bg-gradient-to-br from-yellow-500/10 to-amber-600/5 rounded-b-lg">
              <div className="text-2xl font-bold text-yellow-100 drop-shadow-sm">
                {stats.adminUsers?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-yellow-300/80 font-medium">System administrators</p>
            </CardContent>
          </Card>

          {/* Verification Rate */}
          <Card className="border-2 border-green-400/60 bg-green-500/5 relative shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 hover:border-green-400/80 transition-all duration-300 ring-1 ring-green-500/20">
            {isFetching && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-500"></div>
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium text-green-300">
                Verification Rate
              </CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 rounded-b-lg">
              <div className="text-2xl font-bold text-green-100 drop-shadow-sm">
                {stats.totalUsers > 0
                  ? `${Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}%`
                  : '0%'}
              </div>
              <p className="text-xs text-green-300/80 font-medium">
                {stats.verifiedUsers} of {stats.totalUsers} users verified
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Growth Analytics */}
      <div className="mb-8">
        <Card className="rounded-xl border-2 border-purple-400/60 border-dashed bg-purple-500/5">
          <CardHeader>
            <CardTitle className="text-purple-300 text-2xl font-bold">User Growth</CardTitle>
            <CardDescription>New users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <UserGrowthChart />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-blue-300 text-xl font-bold">User Management</CardTitle>
            <CardDescription>Comprehensive user administration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Link
                href={`/${language}/admin/users`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
              >
                View All Users
              </Link>
              <p className="text-sm text-muted-foreground">
                Manage all users in one place. Control access, assign roles, and monitor activity
                across your platform.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-sky-500/20">
          <CardHeader>
            <CardTitle className="text-sky-300">System Settings</CardTitle>
            <CardDescription>Configure system-wide settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-sky-600 text-white hover:bg-sky-700 h-10 px-4 py-2"
                disabled
              >
                Coming Soon
              </button>
              <p className="text-sm text-muted-foreground">
                Manage application settings, email templates, and system configuration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
