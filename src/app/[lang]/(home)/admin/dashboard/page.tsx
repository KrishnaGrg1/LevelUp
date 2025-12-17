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
        <div className="animate-pulse flex flex-col gap-2">
           <div className="h-4 bg-muted rounded w-24"></div>
           <div className="h-8 bg-muted rounded w-16"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">
          {t('admin:dashboard.title', language)}
        </h1>
        <p className="text-muted-foreground">
          {t('admin:dashboard.subtitle', language)}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isPending ? (
          [...Array(4)].map((_, i) => <StatsSkeleton key={i} />)
        ) : isError ? (
           <Card className="col-span-full bg-destructive/10 border-destructive/20">
            <CardContent className="pt-6 flex items-center gap-3 text-destructive">
               <Activity className="h-5 w-5" />
               <p>{error instanceof Error ? error.message : 'Failed to load stats'}</p>
            </CardContent>
           </Card>
        ) : (
          <>
            {/* Total Users */}
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                {isFetching && <div className="absolute top-2 right-2 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span></div>}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('admin:dashboard.stats.totalUsers', language)}
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground font-numeric">
                  {stats?.totalUsers?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('admin:dashboard.stats.totalRegistered', language)}
                </p>
              </CardContent>
            </Card>

            {/* Verified Users */}
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
               {isFetching && <div className="absolute top-2 right-2 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></div>}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('admin:dashboard.stats.verifiedUsers', language)}
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground font-numeric">
                  {stats?.verifiedUsers?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('admin:dashboard.stats.verifiedAccounts', language)}
                </p>
              </CardContent>
            </Card>

            {/* Admin Users */}
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
               {isFetching && <div className="absolute top-2 right-2 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span></div>}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('admin:dashboard.stats.adminUsers', language)}
                </CardTitle>
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground font-numeric">
                  {stats?.adminUsers?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('admin:dashboard.stats.systemAdministrators', language)}
                </p>
              </CardContent>
            </Card>

            {/* Verification Rate */}
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
               {isFetching && <div className="absolute top-2 right-2 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span></div>}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('admin:dashboard.stats.verificationRate', language)}
                </CardTitle>
                <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground font-numeric">
                  {stats && stats.totalUsers > 0
                    ? `${Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}%`
                    : '0%'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.verifiedUsers} {t('admin:dashboard.stats.of', language)} {stats?.totalUsers}{' '}
                  {t('admin:dashboard.stats.usersVerified', language)}
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
            <CardTitle className="text-foreground text-xl font-bold font-heading">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
        <Card className="bg-card border-border shadow-sm hover:border-primary/50 transition-colors cursor-pointer group">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-bold group-hover:text-primary transition-colors">
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
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto"
              >
                {t('admin:dashboard.quickActions.userManagement.button', language)}
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm opacity-60">
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
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-muted-foreground cursor-not-allowed h-10 px-4 py-2 w-full sm:w-auto"
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
