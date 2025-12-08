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
} from '@/lib/services/ai';

export default function AIQuestManagement() {
  const { language } = LanguageStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

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
          <h1 className="text-3xl font-bold font-heading text-zinc-900 dark:text-zinc-50">
            AI Quest Management
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Monitor and manage AI-generated quests system
          </p>
        </div>
        <Button onClick={() => refetchHealth()} variant="outline" size="sm">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Health */}
          <Card className="border-0 shadow-none">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-heading text-zinc-900 dark:text-zinc-50">
                  System Health
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
                  <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : health ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* AI Service */}
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-2 h-2 rounded-full ${health.services.ai.configured ? 'bg-green-500' : 'bg-red-500'}`}
                      />
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">AI Service</h3>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Model: {health.services.ai.model || 'Not configured'}
                    </p>
                  </div>

                  {/* Database */}
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-2 h-2 rounded-full ${health.services.database.healthy ? 'bg-green-500' : 'bg-red-500'}`}
                      />
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Database</h3>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Response: {health.services.database.responseTime}ms
                    </p>
                  </div>

                  {/* Uptime */}
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Uptime</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
                    </p>
                  </div>

                  {/* Memory */}
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Memory</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {health.memory.used}MB / {health.memory.total}MB
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-zinc-500 dark:text-zinc-400">
                  Failed to load health data
                </p>
              )}
            </div>
          </Card>

          {/* Quest Statistics */}
          {health?.quests && (
            <Card className="border-0 shadow-none">
              <div className="p-6">
                <h2 className="text-xl font-bold font-heading text-zinc-900 dark:text-zinc-50 mb-6">
                  Quest Statistics
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total Quests</p>
                    <p className="text-2xl font-bold font-numeric text-zinc-900 dark:text-zinc-50">
                      {health.quests.total}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Completed</p>
                    <p className="text-2xl font-bold font-numeric text-green-600 dark:text-green-400">
                      {health.quests.completed}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Today Active</p>
                    <p className="text-2xl font-bold font-numeric text-purple-600 dark:text-purple-400">
                      {health.quests.todayActive}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                      This Week Active
                    </p>
                    <p className="text-2xl font-bold font-numeric text-blue-600 dark:text-blue-400">
                      {health.quests.thisWeekActive}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Completion Rate</p>
                    <p className="text-2xl font-bold font-numeric text-zinc-900 dark:text-zinc-50">
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
              <h2 className="text-xl font-bold font-heading text-zinc-900 dark:text-zinc-50 mb-6">
                {t('quests.admin.title')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {t('quests.admin.forceDaily.title')}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
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
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('quests.admin.forceDaily.generating')}
                      </span>
                    ) : (
                      t('quests.admin.forceDaily.button')
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {t('quests.admin.forceWeekly.title')}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
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
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card className="border-0 shadow-none">
            <div className="p-6">
              <h2 className="text-xl font-bold font-heading text-zinc-900 dark:text-zinc-50 mb-6">
                AI Configuration
              </h2>
              {configLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : config ? (
                <div className="space-y-6">
                  {/* AI Settings */}
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                      AI Settings
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Model</p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                          {config.ai.model || 'Not configured'}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                          Max Prompt Length
                        </p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                          {config.ai.maxPromptChars} characters
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                          Token Cost per Chat
                        </p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                          {config.ai.tokenCostPerChat} token(s)
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Status</p>
                        <Badge className={config.ai.configured ? 'bg-green-500' : 'bg-red-500'}>
                          {config.ai.configured ? 'Configured' : 'Not Configured'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Quest Settings */}
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                      Quest Settings
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                          Daily Quest Count
                        </p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                          {config.quests.dailyCount} per day
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                          Weekly Quest Count
                        </p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                          {config.quests.weeklyCount} per week
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                          Quests per Community
                        </p>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                          {config.quests.questsPerCommunity}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                          Daily Schedule
                        </p>
                        <p className="font-mono text-xs text-zinc-900 dark:text-zinc-50">
                          {config.quests.generationSchedule.daily}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Features</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {Object.entries(config.features).map(([key, value]) => (
                        <div
                          key={key}
                          className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">
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
