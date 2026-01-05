'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { t } from '@/translations';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import QuestDetails from '@/components/quests/QuestDetails';

interface QuestPanelProps {
  communityId: string; // Pass to QuestDetails for filtering
}

const QuestPanel: React.FC<QuestPanelProps> = ({ communityId }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <Card className="border-0 shadow-none">
      <div className="p-6">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-heading mb-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {t('quests.panel.title')}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('quests.panel.subtitle')}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            className="bg-green-600 font-semibold text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
            onClick={() => setOpenDetails(true)}
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {t('quests.panel.viewDetails')}
          </Button>
          <Button variant="outline" onClick={() => setOpenSettings(true)}>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {t('quests.panel.settings')}
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t('quests.panel.overview.title')}
            </DialogTitle>
            <DialogDescription>{t('quests.panel.overview.description')}</DialogDescription>
          </DialogHeader>
          <QuestDetails communityId={communityId} />
        </DialogContent>
      </Dialog>

      {/* Settings Modal (placeholder) */}
      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {t('quests.panel.settingsModal.title')}
            </DialogTitle>
            <DialogDescription>{t('quests.panel.settingsModal.description')}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/5 px-4 py-8">
            <svg
              className="text-muted-foreground/50 mb-3 h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <p className="text-muted-foreground text-center text-sm">
              {t('quests.panel.settingsModal.comingSoon')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default QuestPanel;
