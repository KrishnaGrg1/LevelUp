'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Shield, Activity } from 'lucide-react';
import LanguageStore from '@/stores/useLanguage';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { adminOverview } from '@/lib/services/user';
import { UserGrowthChart } from '@/components/users/chart';
import AIQuestManagement from '@/components/admin/AIQuestManagement';
import { t } from '@/translations';

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
        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2 font-bold text-gray-900 dark:text-gray-100">
          {t('admin:dashboard.title', language)}
        </h1>
        <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400">
          {t('admin:dashboard.subtitle', language)}
        </p>
      </div>

      {/* Loading State */}
      {isPending && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mb-8">
          <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                <Activity className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">
                    {t('admin:dashboard.errors.failedToLoad', language)}
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-400">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 relative">
            {isFetching && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {t('admin:dashboard.stats.totalUsers', language)}
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalUsers?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t('admin:dashboard.stats.totalRegistered', language)}
              </p>
            </CardContent>
          </Card>

          {/* Verified Users */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 relative">
            {isFetching && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {t('admin:dashboard.stats.verifiedUsers', language)}
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600 dark:text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.verifiedUsers?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t('admin:dashboard.stats.verifiedAccounts', language)}
              </p>
            </CardContent>
          </Card>

          {/* Admin Users */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 relative">
            {isFetching && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {t('admin:dashboard.stats.adminUsers', language)}
              </CardTitle>
              <Shield className="h-4 w-4 text-purple-600 dark:text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.adminUsers?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t('admin:dashboard.stats.systemAdministrators', language)}
              </p>
            </CardContent>
          </Card>

          {/* Verification Rate */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 relative">
            {isFetching && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600"></div>
              </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {t('admin:dashboard.stats.verificationRate', language)}
              </CardTitle>
              <Activity className="h-4 w-4 text-orange-600 dark:text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stats.totalUsers > 0
                  ? `${Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}%`
                  : '0%'}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stats.verifiedUsers} {t('admin:dashboard.stats.of', language)} {stats.totalUsers}{' '}
                {t('admin:dashboard.stats.usersVerified', language)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Growth Analytics */}
      <div className="mb-8">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 text-2xl font-bold">
              {t('admin:dashboard.userGrowth.title', language)}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('admin:dashboard.userGrowth.subtitle', language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserGrowthChart />
          </CardContent>
        </Card>
      </div>

      {/* AI Quest Management */}
      <div className="mb-8">
        <AIQuestManagement />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 text-xl font-bold">
              {t('admin:dashboard.quickActions.userManagement.title', language)}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('admin:dashboard.quickActions.userManagement.description', language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Link
                href={`/${language}/admin/users`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 h-10 px-4 py-2"
              >
                {t('admin:dashboard.quickActions.userManagement.button', language)}
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('admin:dashboard.quickActions.userManagement.details', language)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 text-xl font-bold">
              {t('admin:dashboard.quickActions.systemSettings.title', language)}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('admin:dashboard.quickActions.systemSettings.description', language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-400 text-white cursor-not-allowed h-10 px-4 py-2"
                disabled
              >
                {t('admin:dashboard.quickActions.systemSettings.button', language)}
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('admin:dashboard.quickActions.systemSettings.details', language)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
