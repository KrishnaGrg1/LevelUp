'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { t } from '@/translations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import LanguageStore from '@/stores/useLanguage';
import {
  fetchAIHealth,
  fetchAIConfig,
  forceGenerateDailyQuests,
  forceGenerateWeeklyQuests,
  deleteQuest,
  adminGenerateDailyAll,
  adminGenerateDailyUser,
  adminGenerateWeeklyAll,
  adminGenerateWeeklyUser,
  adminGetQuestStats,
  adminBulkDeleteQuests,
  type BulkDeleteFilter,
} from '@/lib/services/ai';

export default function AIQuestManagement() {
  const { language } = LanguageStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [targetUserId, setTargetUserId] = useState('');
  const [bulkDeleteFilters, setBulkDeleteFilters] = useState<BulkDeleteFilter>({});

  // Fetch AI Health
  const {
    data: healthData,
    isLoading: healthLoading,
    refetch: refetchHealth,
  } = useQuery({
    queryKey: ['ai-health', language],
    queryFn: () => fetchAIHealth(language),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch AI Config
  const { data: configData, isLoading: configLoading } = useQuery({
    queryKey: ['ai-config', language],
    queryFn: () => fetchAIConfig(language),
  });

  // Force Generate Daily Quests Mutation
  const forceDailyMutation = useMutation({
    mutationFn: () => forceGenerateDailyQuests(language),
    onSuccess: response => {
      toast.success('Daily Quests Generated', {
        description: `Generated ${response.body.data.count} daily quests`,
      });
      refetchHealth();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error('Failed to generate daily quests', {
        description: err?.response?.data?.body?.message || 'Please try again',
      });
    },
  });

  // Force Generate Weekly Quests Mutation
  const forceWeeklyMutation = useMutation({
    mutationFn: () => forceGenerateWeeklyQuests(language),
    onSuccess: response => {
      toast.success('Weekly Quests Generated', {
        description: `Generated ${response.body.data.count} weekly quests`,
      });
      refetchHealth();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error('Failed to generate weekly quests', {
        description: err?.response?.data?.body?.message || 'Please try again',
      });
    },
  });

  // Delete Quest Mutation
  const deleteMutation = useMutation({
    mutationFn: (questId: string) => deleteQuest(questId, language),
    onSuccess: () => {
      toast.success('Quest Deleted', {
        description: 'Quest has been permanently deleted',
      });
      setDeleteDialogOpen(false);
      setSelectedQuestId(null);
      refetchHealth();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error('Failed to delete quest', {
        description: err?.response?.data?.body?.message || 'Please try again',
      });
    },
  });

  // Admin: Generate daily quests for all users
  const adminDailyAllMutation = useMutation({
    mutationFn: () => adminGenerateDailyAll(language),
    onSuccess: response => {
      toast.success('Daily Quests Generated for All Users', {
        description: `Generated ${response.body.data.totalTodayQuests} quests in ${response.body.data.timeElapsed}`,
      });
      refetchHealth();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error('Failed to generate daily quests for all users', {
        description: err?.response?.data?.body?.message || 'Please try again',
      });
    },
  });

  // Admin: Generate daily quests for specific user
  const adminDailyUserMutation = useMutation({
    mutationFn: (userId: string) => adminGenerateDailyUser(userId, language),
    onSuccess: response => {
      toast.success('Daily Quests Generated', {
        description: `Generated ${response.body.data.questCount} quests for ${response.body.data.username}`,
      });
      setTargetUserId('');
      refetchHealth();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error('Failed to generate daily quests', {
        description: err?.response?.data?.body?.message || 'Please try again',
      });
    },
  });

  // Admin: Generate weekly quests for all users
  const adminWeeklyAllMutation = useMutation({
    mutationFn: () => adminGenerateWeeklyAll(language),
    onSuccess: response => {
      toast.success('Weekly Quests Generated for All Users', {
        description: `Generated ${response.body.data.totalThisWeekQuests} quests in ${response.body.data.timeElapsed}`,
      });
      refetchHealth();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error('Failed to generate weekly quests for all users', {
        description: err?.response?.data?.body?.message || 'Please try again',
      });
    },
  });

  // Admin: Generate weekly quests for specific user
  const adminWeeklyUserMutation = useMutation({
    mutationFn: (userId: string) => adminGenerateWeeklyUser(userId, language),
    onSuccess: response => {
      toast.success('Weekly Quests Generated', {
        description: `Generated ${response.body.data.questCount} quests for ${response.body.data.username}`,
      });
      setTargetUserId('');
      refetchHealth();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error('Failed to generate weekly quests', {
        description: err?.response?.data?.body?.message || 'Please try again',
      });
    },
  });

  // Admin: Bulk delete quests
  const bulkDeleteMutation = useMutation({
    mutationFn: (filters: BulkDeleteFilter) => adminBulkDeleteQuests(filters, language),
    onSuccess: response => {
      toast.success('Quests Deleted', {
        description: `Deleted ${response.body.data.deletedCount} quests`,
      });
      setBulkDeleteFilters({});
      refetchHealth();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { body?: { message?: string } } } };
      toast.error('Failed to delete quests', {
        description: err?.response?.data?.body?.message || 'Please try again',
      });
    },
  });

  // Fetch Quest Statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['quest-stats', language],
    queryFn: () => adminGetQuestStats(language),
    refetchInterval: 60000, // Refresh every minute
  });

  const health = healthData?.body?.data;
  const config = configData?.body?.data;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {t('admin.aiQuestManagement.title', language)}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {t('admin.aiQuestManagement.subtitle', language)}
          </p>
        </div>
        <Button onClick={() => refetchHealth()} variant="outline" size="sm">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {t('admin.aiQuestManagement.refresh', language)}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            {t('admin.aiQuestManagement.tabs.overview', language)}
          </TabsTrigger>
          <TabsTrigger value="actions" className="text-xs sm:text-sm">
            {t('admin.aiQuestManagement.tabs.userActions', language)}
          </TabsTrigger>
          <TabsTrigger value="admin" className="text-xs sm:text-sm">
            {t('admin.aiQuestManagement.tabs.adminGenerate', language)}
          </TabsTrigger>
          <TabsTrigger value="statistics" className="text-xs sm:text-sm">
            {t('admin.aiQuestManagement.tabs.statistics', language)}
          </TabsTrigger>
          <TabsTrigger value="bulk-delete" className="text-xs sm:text-sm">
            {t('admin.aiQuestManagement.tabs.bulkDelete', language)}
          </TabsTrigger>
          <TabsTrigger value="config" className="text-xs sm:text-sm">
            {t('admin.aiQuestManagement.tabs.config', language)}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Health */}
          <Card className="border-0 shadow-none">
            <div className="p-4 sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-zinc-900 sm:text-xl dark:text-zinc-50">
                  {t('admin.aiQuestManagement.overview.systemHealth.title', language)}
                </h2>
                {health && (
                  <Badge
                    className={`${getStatusColor(health.status)} text-white`}
                    variant="default"
                  >
                    {health.status.toUpperCase()}
                  </Badge>
                )}
              </div>

              {healthLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-500/30 border-t-purple-500" />
                </div>
              ) : health ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                  {/* AI Service */}
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${health.services.ai.configured ? 'bg-green-500' : 'bg-red-500'}`}
                      />
                      <h3 className="text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                        {t('admin.aiQuestManagement.overview.systemHealth.aiService', language)}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {t('admin.aiQuestManagement.overview.systemHealth.model', language)}:{' '}
                      {health.services.ai.model ||
                        t('admin.aiQuestManagement.overview.systemHealth.notConfigured', language)}
                    </p>
                  </div>

                  {/* Database */}
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${health.services.database.healthy ? 'bg-green-500' : 'bg-red-500'}`}
                      />
                      <h3 className="text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                        {t('admin.aiQuestManagement.overview.systemHealth.database', language)}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {t('admin.aiQuestManagement.overview.systemHealth.response', language)}:{' '}
                      {health.services.database.responseTime}ms
                    </p>
                  </div>

                  {/* Uptime */}
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h3 className="mb-2 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t('admin.aiQuestManagement.overview.systemHealth.uptime', language)}
                    </h3>
                    <p className="text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
                    </p>
                  </div>

                  {/* Memory */}
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h3 className="mb-2 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t('admin.aiQuestManagement.overview.systemHealth.memory', language)}
                    </h3>
                    <p className="text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {health.memory.used}MB / {health.memory.total}MB
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-zinc-500 dark:text-zinc-400">
                  {t('admin.aiQuestManagement.overview.systemHealth.failed', language)}
                </p>
              )}
            </div>
          </Card>

          {/* Quest Statistics */}
          {health?.quests && (
            <Card className="border-0 shadow-none">
              <div className="p-4 sm:p-6">
                <h2 className="font-heading mb-6 text-lg font-bold text-zinc-900 sm:text-xl dark:text-zinc-50">
                  {t('admin.aiQuestManagement.overview.questStats.title', language)}
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {t('admin.aiQuestManagement.overview.questStats.totalQuests', language)}
                    </p>
                    <p className="font-numeric text-lg font-bold text-zinc-900 sm:text-2xl dark:text-zinc-50">
                      {health.quests.total}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {t('admin.aiQuestManagement.overview.questStats.completed', language)}
                    </p>
                    <p className="font-numeric text-lg font-bold text-green-600 sm:text-2xl dark:text-green-400">
                      {health.quests.completed}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {t('admin.aiQuestManagement.overview.questStats.todayActive', language)}
                    </p>
                    <p className="font-numeric text-lg font-bold text-purple-600 sm:text-2xl dark:text-purple-400">
                      {health.quests.todayActive}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {t('admin.aiQuestManagement.overview.questStats.thisWeekActive', language)}
                    </p>
                    <p className="font-numeric text-lg font-bold text-blue-600 sm:text-2xl dark:text-blue-400">
                      {health.quests.thisWeekActive}
                    </p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {t('admin.aiQuestManagement.overview.questStats.completionRate', language)}
                    </p>
                    <p className="font-numeric text-lg font-bold text-zinc-900 sm:text-2xl dark:text-zinc-50">
                      {health.quests.completionRate}%
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-6">
          <Card className="border-0 shadow-none">
            <div className="p-6">
              <h2 className="font-heading mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {t('quests.admin.title')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {t('quests.admin.forceDaily.title')}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {t('quests.admin.forceDaily.description')}
                    </p>
                  </div>
                  <Button
                    onClick={() => forceDailyMutation.mutate()}
                    disabled={forceDailyMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
                  >
                    {forceDailyMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {t('quests.admin.forceDaily.generating')}
                      </span>
                    ) : (
                      t('quests.admin.forceDaily.button')
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {t('quests.admin.forceWeekly.title')}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {t('quests.admin.forceWeekly.description')}
                    </p>
                  </div>
                  <Button
                    onClick={() => forceWeeklyMutation.mutate()}
                    disabled={forceWeeklyMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    {forceWeeklyMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {t('quests.admin.forceWeekly.generating')}
                      </span>
                    ) : (
                      t('quests.admin.forceWeekly.button')
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Admin Generate Tab */}
        <TabsContent value="admin" className="space-y-6">
          <Card className="border-0 shadow-none">
            <div className="p-4 sm:p-6">
              <h2 className="font-heading mb-6 text-lg font-bold text-zinc-900 sm:text-xl dark:text-zinc-50">
                {t('admin.aiQuestManagement.adminGenerate.title', language)}
              </h2>

              {/* Generate for All Users */}
              <div className="mb-8 space-y-4">
                <h3 className="text-base font-semibold text-zinc-900 sm:text-lg dark:text-zinc-50">
                  {t('admin.aiQuestManagement.adminGenerate.allUsers.title', language)}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h4 className="mb-2 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t('admin.aiQuestManagement.adminGenerate.allUsers.daily.title', language)}
                    </h4>
                    <p className="mb-4 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {t(
                        'admin.aiQuestManagement.adminGenerate.allUsers.daily.description',
                        language,
                      )}
                    </p>
                    <Button
                      onClick={() => adminDailyAllMutation.mutate()}
                      disabled={adminDailyAllMutation.isPending}
                      className="w-full bg-purple-600 text-xs hover:bg-purple-700 sm:text-sm"
                    >
                      {adminDailyAllMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          {t(
                            'admin.aiQuestManagement.adminGenerate.allUsers.daily.generating',
                            language,
                          )}
                        </span>
                      ) : (
                        t('admin.aiQuestManagement.adminGenerate.allUsers.daily.button', language)
                      )}
                    </Button>
                  </div>

                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h4 className="mb-2 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t('admin.aiQuestManagement.adminGenerate.allUsers.weekly.title', language)}
                    </h4>
                    <p className="mb-4 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {t(
                        'admin.aiQuestManagement.adminGenerate.allUsers.weekly.description',
                        language,
                      )}
                    </p>
                    <Button
                      onClick={() => adminWeeklyAllMutation.mutate()}
                      disabled={adminWeeklyAllMutation.isPending}
                      className="w-full bg-blue-600 text-xs hover:bg-blue-700 sm:text-sm"
                    >
                      {adminWeeklyAllMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          {t(
                            'admin.aiQuestManagement.adminGenerate.allUsers.weekly.generating',
                            language,
                          )}
                        </span>
                      ) : (
                        t('admin.aiQuestManagement.adminGenerate.allUsers.weekly.button', language)
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Generate for Specific User */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-zinc-900 sm:text-lg dark:text-zinc-50">
                  {t('admin.aiQuestManagement.adminGenerate.specificUser.title', language)}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h4 className="mb-2 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t(
                        'admin.aiQuestManagement.adminGenerate.specificUser.daily.title',
                        language,
                      )}
                    </h4>
                    <p className="mb-4 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {t(
                        'admin.aiQuestManagement.adminGenerate.specificUser.daily.description',
                        language,
                      )}
                    </p>
                    <input
                      type="text"
                      placeholder={t(
                        'admin.aiQuestManagement.adminGenerate.specificUser.daily.placeholder',
                        language,
                      )}
                      value={targetUserId}
                      onChange={e => setTargetUserId(e.target.value)}
                      className="mb-3 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    />
                    <Button
                      onClick={() => targetUserId && adminDailyUserMutation.mutate(targetUserId)}
                      disabled={!targetUserId || adminDailyUserMutation.isPending}
                      className="w-full bg-purple-600 text-xs hover:bg-purple-700 sm:text-sm"
                    >
                      {adminDailyUserMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          {t(
                            'admin.aiQuestManagement.adminGenerate.specificUser.daily.generating',
                            language,
                          )}
                        </span>
                      ) : (
                        t(
                          'admin.aiQuestManagement.adminGenerate.specificUser.daily.button',
                          language,
                        )
                      )}
                    </Button>
                  </div>

                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <h4 className="mb-2 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t(
                        'admin.aiQuestManagement.adminGenerate.specificUser.weekly.title',
                        language,
                      )}
                    </h4>
                    <p className="mb-4 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                      {t(
                        'admin.aiQuestManagement.adminGenerate.specificUser.weekly.description',
                        language,
                      )}
                    </p>
                    <input
                      type="text"
                      placeholder={t(
                        'admin.aiQuestManagement.adminGenerate.specificUser.weekly.placeholder',
                        language,
                      )}
                      value={targetUserId}
                      onChange={e => setTargetUserId(e.target.value)}
                      className="mb-3 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    />
                    <Button
                      onClick={() => targetUserId && adminWeeklyUserMutation.mutate(targetUserId)}
                      disabled={!targetUserId || adminWeeklyUserMutation.isPending}
                      className="w-full bg-blue-600 text-xs hover:bg-blue-700 sm:text-sm"
                    >
                      {adminWeeklyUserMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          {t(
                            'admin.aiQuestManagement.adminGenerate.specificUser.weekly.generating',
                            language,
                          )}
                        </span>
                      ) : (
                        t(
                          'admin.aiQuestManagement.adminGenerate.specificUser.weekly.button',
                          language,
                        )
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <Card className="border-0 shadow-none">
            <div className="p-4 sm:p-6">
              <h2 className="font-heading mb-6 text-lg font-bold text-zinc-900 sm:text-xl dark:text-zinc-50">
                {t('admin.aiQuestManagement.statistics.title', language)}
              </h2>

              {statsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-500/30 border-t-purple-500" />
                </div>
              ) : statsData?.body?.data ? (
                <div className="space-y-6">
                  {/* Overview Stats */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t('admin.aiQuestManagement.statistics.overview.title', language)}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t('admin.aiQuestManagement.statistics.overview.totalQuests', language)}
                        </p>
                        <p className="text-lg font-bold text-zinc-900 sm:text-2xl dark:text-zinc-50">
                          {statsData.body.data.overview.totalQuests.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t('admin.aiQuestManagement.statistics.overview.completed', language)}
                        </p>
                        <p className="text-lg font-bold text-green-600 sm:text-2xl dark:text-green-400">
                          {statsData.body.data.overview.completedQuests.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t('admin.aiQuestManagement.statistics.overview.pending', language)}
                        </p>
                        <p className="text-lg font-bold text-orange-600 sm:text-2xl dark:text-orange-400">
                          {statsData.body.data.overview.pendingQuests.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t(
                            'admin.aiQuestManagement.statistics.overview.completionRate',
                            language,
                          )}
                        </p>
                        <p className="text-lg font-bold text-zinc-900 sm:text-2xl dark:text-zinc-50">
                          {statsData.body.data.overview.completionRate}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t('admin.aiQuestManagement.statistics.overview.todayActive', language)}
                        </p>
                        <p className="text-lg font-bold text-purple-600 sm:text-2xl dark:text-purple-400">
                          {statsData.body.data.overview.todayActive.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t(
                            'admin.aiQuestManagement.statistics.overview.thisWeekActive',
                            language,
                          )}
                        </p>
                        <p className="text-lg font-bold text-blue-600 sm:text-2xl dark:text-blue-400">
                          {statsData.body.data.overview.thisWeekActive.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t('admin.aiQuestManagement.statistics.overview.activeUsers', language)}
                        </p>
                        <p className="text-lg font-bold text-zinc-900 sm:text-2xl dark:text-zinc-50">
                          {statsData.body.data.overview.activeUsers.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* By Type */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t('admin.aiQuestManagement.statistics.byType.title', language)}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      {statsData.body.data.byType.map(item => (
                        <div
                          key={item.type}
                          className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
                        >
                          <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                            {item.type}
                          </p>
                          <p className="text-base font-bold text-zinc-900 sm:text-xl dark:text-zinc-50">
                            {item._count.id.toLocaleString()}{' '}
                            {t('admin.aiQuestManagement.statistics.byType.quests', language)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Completions */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t('admin.aiQuestManagement.statistics.recentCompletions.title', language)}
                    </h3>
                    <div className="space-y-2">
                      {statsData.body.data.recentCompletions.map(completion => (
                        <div
                          key={completion.id}
                          className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="mb-1 text-xs font-medium text-zinc-900 sm:text-sm dark:text-zinc-50">
                                {completion.description.substring(0, 100)}...
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 sm:gap-4 dark:text-zinc-400">
                                <span>
                                  {t(
                                    'admin.aiQuestManagement.statistics.recentCompletions.by',
                                    language,
                                  )}{' '}
                                  {completion.user.UserName}
                                </span>
                                <span>
                                  {t(
                                    'admin.aiQuestManagement.statistics.recentCompletions.community',
                                    language,
                                  )}{' '}
                                  {completion.community.name}
                                </span>
                                <span>
                                  {t(
                                    'admin.aiQuestManagement.statistics.recentCompletions.xp',
                                    language,
                                  )}{' '}
                                  {completion.xpValue}
                                </span>
                                <span>{new Date(completion.completedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-zinc-500 dark:text-zinc-400">
                  {t('admin.aiQuestManagement.statistics.failed', language)}
                </p>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Bulk Delete Tab */}
        <TabsContent value="bulk-delete" className="space-y-6">
          <Card className="border-0 shadow-none">
            <div className="p-4 sm:p-6">
              <h2 className="font-heading mb-6 text-lg font-bold text-zinc-900 sm:text-xl dark:text-zinc-50">
                {t('admin.aiQuestManagement.bulkDelete.title', language)}
              </h2>
              <p className="mb-6 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                {t('admin.aiQuestManagement.bulkDelete.description', language)}
              </p>

              <div className="mb-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
                {/* User ID */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-700 sm:text-sm dark:text-zinc-300">
                    {t('admin.aiQuestManagement.bulkDelete.filters.userId.label', language)}
                  </label>
                  <input
                    type="text"
                    placeholder={t(
                      'admin.aiQuestManagement.bulkDelete.filters.userId.placeholder',
                      language,
                    )}
                    value={bulkDeleteFilters.userId || ''}
                    onChange={e =>
                      setBulkDeleteFilters({
                        ...bulkDeleteFilters,
                        userId: e.target.value || undefined,
                      })
                    }
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  />
                </div>

                {/* Community ID */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-700 sm:text-sm dark:text-zinc-300">
                    {t('admin.aiQuestManagement.bulkDelete.filters.communityId.label', language)}
                  </label>
                  <input
                    type="text"
                    placeholder={t(
                      'admin.aiQuestManagement.bulkDelete.filters.communityId.placeholder',
                      language,
                    )}
                    value={bulkDeleteFilters.communityId || ''}
                    onChange={e =>
                      setBulkDeleteFilters({
                        ...bulkDeleteFilters,
                        communityId: e.target.value || undefined,
                      })
                    }
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-700 sm:text-sm dark:text-zinc-300">
                    {t('admin.aiQuestManagement.bulkDelete.filters.type.label', language)}
                  </label>
                  <select
                    value={bulkDeleteFilters.type || ''}
                    onChange={e =>
                      setBulkDeleteFilters({
                        ...bulkDeleteFilters,
                        type: (e.target.value || undefined) as 'Daily' | 'Weekly' | undefined,
                      })
                    }
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  >
                    <option value="">
                      {t('admin.aiQuestManagement.bulkDelete.filters.type.allTypes', language)}
                    </option>
                    <option value="Daily">
                      {t('admin.aiQuestManagement.bulkDelete.filters.type.daily', language)}
                    </option>
                    <option value="Weekly">
                      {t('admin.aiQuestManagement.bulkDelete.filters.type.weekly', language)}
                    </option>
                  </select>
                </div>

                {/* Period Status */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-700 sm:text-sm dark:text-zinc-300">
                    {t('admin.aiQuestManagement.bulkDelete.filters.periodStatus.label', language)}
                  </label>
                  <select
                    value={bulkDeleteFilters.periodStatus || ''}
                    onChange={e =>
                      setBulkDeleteFilters({
                        ...bulkDeleteFilters,
                        periodStatus: e.target.value || undefined,
                      })
                    }
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  >
                    <option value="">
                      {t(
                        'admin.aiQuestManagement.bulkDelete.filters.periodStatus.allPeriods',
                        language,
                      )}
                    </option>
                    <option value="TODAY">
                      {t('admin.aiQuestManagement.bulkDelete.filters.periodStatus.today', language)}
                    </option>
                    <option value="YESTERDAY">
                      {t(
                        'admin.aiQuestManagement.bulkDelete.filters.periodStatus.yesterday',
                        language,
                      )}
                    </option>
                    <option value="THIS_WEEK">
                      {t(
                        'admin.aiQuestManagement.bulkDelete.filters.periodStatus.thisWeek',
                        language,
                      )}
                    </option>
                    <option value="LAST_WEEK">
                      {t(
                        'admin.aiQuestManagement.bulkDelete.filters.periodStatus.lastWeek',
                        language,
                      )}
                    </option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-700 sm:text-sm dark:text-zinc-300">
                    {t('admin.aiQuestManagement.bulkDelete.filters.startDate.label', language)}
                  </label>
                  <input
                    type="date"
                    value={bulkDeleteFilters.startDate?.split('T')[0] || ''}
                    onChange={e =>
                      setBulkDeleteFilters({
                        ...bulkDeleteFilters,
                        startDate: e.target.value ? `${e.target.value}T00:00:00Z` : undefined,
                      })
                    }
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-zinc-700 sm:text-sm dark:text-zinc-300">
                    {t('admin.aiQuestManagement.bulkDelete.filters.endDate.label', language)}
                  </label>
                  <input
                    type="date"
                    value={bulkDeleteFilters.endDate?.split('T')[0] || ''}
                    onChange={e =>
                      setBulkDeleteFilters({
                        ...bulkDeleteFilters,
                        endDate: e.target.value ? `${e.target.value}T23:59:59Z` : undefined,
                      })
                    }
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  />
                </div>
              </div>

              <Button
                onClick={() => bulkDeleteMutation.mutate(bulkDeleteFilters)}
                disabled={
                  bulkDeleteMutation.isPending ||
                  Object.keys(bulkDeleteFilters).filter(
                    k => bulkDeleteFilters[k as keyof BulkDeleteFilter],
                  ).length === 0
                }
                className="w-full bg-red-600 text-xs hover:bg-red-700 sm:text-sm"
              >
                {bulkDeleteMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {t('admin.aiQuestManagement.bulkDelete.deleting', language)}
                  </span>
                ) : (
                  t('admin.aiQuestManagement.bulkDelete.button', language)
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card className="border-0 shadow-none">
            <div className="p-4 sm:p-6">
              <h2 className="font-heading mb-6 text-lg font-bold text-zinc-900 sm:text-xl dark:text-zinc-50">
                {t('admin.aiQuestManagement.config.title', language)}
              </h2>
              {configLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-500/30 border-t-purple-500" />
                </div>
              ) : config ? (
                <div className="space-y-6">
                  {/* AI Settings */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t('admin.aiQuestManagement.config.aiSettings.title', language)}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t('admin.aiQuestManagement.config.aiSettings.model', language)}
                        </p>
                        <p className="text-sm font-medium text-zinc-900 sm:text-base dark:text-zinc-50">
                          {config.ai.model ||
                            t('admin.aiQuestManagement.config.aiSettings.notConfigured', language)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t('admin.aiQuestManagement.config.aiSettings.maxPromptLength', language)}
                        </p>
                        <p className="text-sm font-medium text-zinc-900 sm:text-base dark:text-zinc-50">
                          {config.ai.maxPromptChars}{' '}
                          {t('admin.aiQuestManagement.config.aiSettings.characters', language)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t(
                            'admin.aiQuestManagement.config.aiSettings.tokenCostPerChat',
                            language,
                          )}
                        </p>
                        <p className="text-sm font-medium text-zinc-900 sm:text-base dark:text-zinc-50">
                          {config.ai.tokenCostPerChat}{' '}
                          {t('admin.aiQuestManagement.config.aiSettings.tokens', language)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t('admin.aiQuestManagement.config.aiSettings.status', language)}
                        </p>
                        <Badge className={config.ai.configured ? 'bg-green-500' : 'bg-red-500'}>
                          {config.ai.configured
                            ? t('admin.aiQuestManagement.config.aiSettings.configured', language)
                            : t(
                                'admin.aiQuestManagement.config.aiSettings.notConfigured',
                                language,
                              )}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Quest Settings */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t('admin.aiQuestManagement.config.questSettings.title', language)}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t('admin.aiQuestManagement.config.questSettings.dailyCount', language)}
                        </p>
                        <p className="text-sm font-medium text-zinc-900 sm:text-base dark:text-zinc-50">
                          {config.quests.dailyCount}{' '}
                          {t('admin.aiQuestManagement.config.questSettings.perDay', language)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t('admin.aiQuestManagement.config.questSettings.weeklyCount', language)}
                        </p>
                        <p className="text-sm font-medium text-zinc-900 sm:text-base dark:text-zinc-50">
                          {config.quests.weeklyCount}{' '}
                          {t('admin.aiQuestManagement.config.questSettings.perWeek', language)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t(
                            'admin.aiQuestManagement.config.questSettings.questsPerCommunity',
                            language,
                          )}
                        </p>
                        <p className="text-sm font-medium text-zinc-900 sm:text-base dark:text-zinc-50">
                          {config.quests.questsPerCommunity}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <p className="mb-1 text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
                          {t(
                            'admin.aiQuestManagement.config.questSettings.dailySchedule',
                            language,
                          )}
                        </p>
                        <p className="font-mono text-xs text-zinc-900 dark:text-zinc-50">
                          {config.quests.generationSchedule.daily}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-zinc-900 sm:text-base dark:text-zinc-50">
                      {t('admin.aiQuestManagement.config.features.title', language)}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
                      {Object.entries(config.features).map(([key, value]) => (
                        <div
                          key={key}
                          className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-zinc-600 capitalize dark:text-zinc-400">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <Badge className={value ? 'bg-green-500' : 'bg-red-500'}>
                              {value ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-zinc-500 dark:text-zinc-400">
                  Failed to load configuration
                </p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quest? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedQuestId && deleteMutation.mutate(selectedQuestId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
