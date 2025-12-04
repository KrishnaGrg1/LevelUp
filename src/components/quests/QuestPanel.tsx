'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
    <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-card/80 via-card/50 to-card/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5" />

      <div className="relative p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Quest Management</h3>
            <p className="text-sm text-muted-foreground">View and track your quest progress</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-semibold"
            onClick={() => setOpenDetails(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            View Details
          </Button>
          <Button
            variant="outline"
            className="border-white/20 hover:bg-white/5 hover:border-white/30 transition-all duration-200"
            onClick={() => setOpenSettings(true)}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            Settings
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Quest Overview</DialogTitle>
            <DialogDescription>Track your daily and weekly quest progress</DialogDescription>
          </DialogHeader>
          <QuestDetails communityId={communityId} />
        </DialogContent>
      </Dialog>

      {/* Settings Modal (placeholder) */}
      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Quest Settings</DialogTitle>
            <DialogDescription>Configure your quest preferences</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg border border-dashed border-white/10 bg-white/5">
            <svg
              className="w-12 h-12 text-muted-foreground/50 mb-3"
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
            <p className="text-sm text-muted-foreground text-center">
              Quest settings will be available soon
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default QuestPanel;
