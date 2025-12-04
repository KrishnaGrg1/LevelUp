'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { generateDailyQuests, generateWeeklyQuests } from '@/lib/services/ai';
import LanguageStore from '@/stores/useLanguage';
import { toast } from 'sonner';

interface Props {
  className?: string;
}

const GenerateButtons: React.FC<Props> = ({ className }) => {
  const queryClient = useQueryClient();
  const { language } = LanguageStore();

  const dailyMutation = useMutation({
    mutationFn: () => generateDailyQuests(language),
    onSuccess: () => {
      toast.success('Generated today\'s quests');
      queryClient.invalidateQueries({ queryKey: ['ai-daily-quests'] });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to generate daily quests');
    },
  });

  const weeklyMutation = useMutation({
    mutationFn: () => generateWeeklyQuests(language),
    onSuccess: () => {
      toast.success("Generated this week's quests");
      queryClient.invalidateQueries({ queryKey: ['ai-weekly-quests'] });
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to generate weekly quests');
    },
  });

  return (
    <div className={`flex flex-wrap gap-3 ${className ?? ''}`}>
      <Button
        onClick={() => dailyMutation.mutate()}
        disabled={dailyMutation.isPending}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {dailyMutation.isPending ? 'Generating Daily…' : "Generate Today's Quests"}
      </Button>
      <Button
        onClick={() => weeklyMutation.mutate()}
        disabled={weeklyMutation.isPending}
        variant="secondary"
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        {weeklyMutation.isPending ? 'Generating Weekly…' : "Generate This Week's Quests"}
      </Button>
    </div>
  );
};

export default GenerateButtons;
