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
  // No props needed - quests are filtered by authenticated user on backend
}

const QuestPanel: React.FC<QuestPanelProps> = () => {
  const [openDetails, setOpenDetails] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Button className="bg-purple-700 hover:bg-purple-600" onClick={() => setOpenDetails(true)}>
          Details
        </Button>
        <Button variant="outline" onClick={() => setOpenSettings(true)}>
          Settings
        </Button>
      </div>

      {/* Details Modal */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Quests</DialogTitle>
            <DialogDescription>Daily and Weekly quests</DialogDescription>
          </DialogHeader>
          <QuestDetails />
        </DialogContent>
      </Dialog>

      {/* Settings Modal (placeholder) */}
      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Quest Settings</DialogTitle>
            <DialogDescription>Configure quest preferences (coming soon)</DialogDescription>
          </DialogHeader>
          <div className="text-sm text-gray-500">No configurable options yet.</div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default QuestPanel;
