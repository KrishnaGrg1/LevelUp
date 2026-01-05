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
    staleTime: 60000,
    gcTime: 300000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const stats = data?.body?.data;

  // Loading Skeleton Component
  const StatsSkeleton = () => (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex animate-pulse flex-col gap-2">
          <div className="bg-muted h-4 w-24 rounded"></div>
          <div className="bg-muted h-8 w-16 rounded"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted h-3 w-32 animate-pulse rounded"></div>
      </CardContent>
    </Card>
  );

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground font-heading text-3xl font-bold tracking-tight">
          {t('admin:dashboard.title', language)}
        </h1>
        <p className="text-muted-foreground">{t('admin:dashboard.subtitle', language)}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isPending ? (
          [...Array(4)].map((_, i) => <StatsSkeleton key={i} />)
        ) : isError ? (
          <Card className="bg-destructive/10 border-destructive/20 col-span-full">
            <CardContent className="text-destructive flex items-center gap-3 pt-6">
              <Activity className="h-5 w-5" />
              <p>{error instanceof Error ? error.message : 'Failed to load stats'}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Total Users */}
            <Card className="bg-card border-border relative overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              {isFetching && (
                <div className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                </div>
              )}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {t('admin:dashboard.stats.totalUsers', language)}
                </CardTitle>
                <Users className="text-primary h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-foreground font-numeric text-2xl font-bold">
                  {stats?.totalUsers?.toLocaleString() || '0'}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {t('admin:dashboard.stats.totalRegistered', language)}
                </p>
              </CardContent>
            </Card>

            {/* Verified Users */}
            <Card className="bg-card border-border relative overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              {isFetching && (
                <div className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </div>
              )}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {t('admin:dashboard.stats.verifiedUsers', language)}
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-foreground font-numeric text-2xl font-bold">
                  {stats?.verifiedUsers?.toLocaleString() || '0'}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {t('admin:dashboard.stats.verifiedAccounts', language)}
                </p>
              </CardContent>
            </Card>

            {/* Admin Users */}
            <Card className="bg-card border-border relative overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              {isFetching && (
                <div className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
                </div>
              )}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {t('admin:dashboard.stats.adminUsers', language)}
                </CardTitle>
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-foreground font-numeric text-2xl font-bold">
                  {stats?.adminUsers?.toLocaleString() || '0'}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {t('admin:dashboard.stats.systemAdministrators', language)}
                </p>
              </CardContent>
            </Card>

            {/* Verification Rate */}
            <Card className="bg-card border-border relative overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              {isFetching && (
                <div className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
                </div>
              )}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {t('admin:dashboard.stats.verificationRate', language)}
                </CardTitle>
                <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-foreground font-numeric text-2xl font-bold">
                  {stats && stats.totalUsers > 0
                    ? `${Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}%`
                    : '0%'}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {stats?.verifiedUsers} {t('admin:dashboard.stats.of', language)}{' '}
                  {stats?.totalUsers} {t('admin:dashboard.stats.usersVerified', language)}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* User Growth Analytics */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground font-heading text-xl font-bold">
              {t('admin:dashboard.userGrowth.title', language)}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('admin:dashboard.userGrowth.subtitle', language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserGrowthChart />
          </CardContent>
        </Card>
      </div>

      {/* AI Quest Management - Component itself should be checked for consistent styling, but it uses ShadeCN cards so likely fine */}
      <div className="">
        <AIQuestManagement />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 pb-6 md:grid-cols-2">
        <Card className="bg-card border-border hover:border-primary/50 group cursor-pointer shadow-sm transition-colors">
          <CardHeader>
            <CardTitle className="text-foreground group-hover:text-primary text-xl font-bold transition-colors">
              {t('admin:dashboard.quickActions.userManagement.title', language)}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('admin:dashboard.quickActions.userManagement.description', language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Link
                href={`/${language}/admin/users`}
                className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
              >
                {t('admin:dashboard.quickActions.userManagement.button', language)}
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border opacity-60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-bold">
              {t('admin:dashboard.quickActions.systemSettings.title', language)}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('admin:dashboard.quickActions.systemSettings.description', language)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <button
                className="ring-offset-background focus-visible:ring-ring bg-muted text-muted-foreground inline-flex h-10 w-full cursor-not-allowed items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                disabled
              >
                {t('admin:dashboard.quickActions.systemSettings.button', language)}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
