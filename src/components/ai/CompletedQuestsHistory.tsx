'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LanguageStore from '@/stores/useLanguage';
import { fetchCompletedQuests, type Quest } from '@/lib/services/ai';

export default function CompletedQuestsHistory() {
  const { language } = LanguageStore();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'Daily' | 'Weekly'>('all');
  const limit = 20;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['completed-quests', language, page, filter],
    queryFn: () =>
      fetchCompletedQuests(language, page, limit, filter === 'all' ? undefined : filter),
  });

  const completedQuests = data?.body?.data?.quests ?? [];
  const pagination = data?.body?.data?.pagination;

  const QuestItem: React.FC<{ quest: Quest }> = ({ quest }) => {
    const isPurple = quest.type === 'Daily';
    const color = isPurple ? 'purple' : 'blue';

    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge className={`bg-${color}-600 text-white`}>{quest.type}</Badge>
              <Badge className="bg-green-600 text-white">✓ Completed</Badge>
            </div>
            <p className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {quest.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="font-medium">{quest.communityId}</span>
              <span>•</span>
              <span className="font-numeric">Quest #{quest.periodSeq}</span>
              <span>•</span>
              <span>{quest.periodStatus.replace(/_/g, ' ')}</span>
              {quest.date && (
                <>
                  <span>•</span>
                  <span>{new Date(quest.date).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>
          <div
            className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 bg-${color}-50 dark:bg-${color}-900/10 border border-${color}-200 dark:border-${color}-800`}
          >
            <span
              className={`font-numeric text-sm font-bold text-${color}-600 dark:text-${color}-400`}
            >
              +{quest.xpValue}
            </span>
            <span className={`text-xs font-medium text-${color}-600 dark:text-${color}-400`}>
              XP
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Quest History
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          View all your completed quests and earned rewards
        </p>
      </div>

      {/* Filters */}
      <Tabs
        value={filter}
        onValueChange={value => {
          setFilter(value as 'all' | 'Daily' | 'Weekly');
          setPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All Quests</TabsTrigger>
          <TabsTrigger value="Daily">Daily Only</TabsTrigger>
          <TabsTrigger value="Weekly">Weekly Only</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Quest List */}
      <Card className="border-0 shadow-none">
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-500/30 border-t-purple-500" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading quest history...</p>
              </div>
            </div>
          ) : completedQuests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                No completed quests yet
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Start completing quests to see your history here
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {completedQuests.map(quest => (
                  <QuestItem key={quest.id} quest={quest} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1 || isFetching}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setPage(p => p + 1)}
                      disabled={!pagination.hasMore || isFetching}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
