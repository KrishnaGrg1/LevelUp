'use client';

import React, { useEffect, useState } from 'react';
import { getTimeRemaining, type TimeRemaining, type Quest } from '@/lib/services/ai';
import { Clock, CheckCircle2 } from 'lucide-react';

interface QuestTimerProps {
  quest: Quest;
  onReady?: () => void;
}

export default function QuestTimer({ quest, onReady }: QuestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(getTimeRemaining(quest));

  useEffect(() => {
    if (timeRemaining.isReady) {
      onReady?.();
      return;
    }

    const interval = setInterval(() => {
      const updated = getTimeRemaining(quest);
      setTimeRemaining(updated);

      if (updated.isReady) {
        clearInterval(interval);
        onReady?.();
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [quest, timeRemaining.isReady, onReady]);

  if (timeRemaining.isReady) {
    return (
      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">{timeRemaining.remainingText}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
        <Clock className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">{timeRemaining.remainingText}</span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-1000"
          style={{ width: `${timeRemaining.progressPercent}%` }}
        />
      </div>
    </div>
  );
}
