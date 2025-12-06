'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { generateDailyQuests, generateWeeklyQuests } from '@/lib/services/ai';
import LanguageStore from '@/stores/useLanguage';
import { toast } from 'sonner';
import { t } from '@/translations';

interface Props {
  className?: string;
}

const GenerateButtons: React.FC<Props> = ({ className }) => {
  const queryClient = useQueryClient();
  const { language } = LanguageStore();

  const dailyMutation = useMutation({
    mutationFn: () => generateDailyQuests(language),
    onSuccess: () => {
      toast.success(t('quests.generate.success.dailyGenerated'));
      queryClient.invalidateQueries({ queryKey: ['ai-daily-quests'] });
    },
    onError: (err: unknown) => {
      const error = err as { message?: string };
      toast.error(error?.message || t('quests.generate.errors.dailyFailed'));
    },
  });

  const weeklyMutation = useMutation({
    mutationFn: () => generateWeeklyQuests(language),
    onSuccess: () => {
      toast.success(t('quests.generate.success.weeklyGenerated'));
      queryClient.invalidateQueries({ queryKey: ['ai-weekly-quests'] });
    },
    onError: (err: unknown) => {
      const error = err as { message?: string };
      toast.error(error?.message || t('quests.generate.errors.weeklyFailed'));
    },
  });

  return (
    <div className={`flex flex-wrap gap-3 ${className ?? ''}`}>
      <Button
        onClick={() => dailyMutation.mutate()}
        disabled={dailyMutation.isPending}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        {dailyMutation.isPending
          ? t('quests.generate.buttons.generatingDaily')
          : t('quests.generate.buttons.generateDaily')}
      </Button>
      <Button
        onClick={() => weeklyMutation.mutate()}
        disabled={weeklyMutation.isPending}
        variant="secondary"
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        {weeklyMutation.isPending
          ? t('quests.generate.buttons.generatingWeekly')
          : t('quests.generate.buttons.generateWeekly')}
      </Button>
    </div>
  );
};

export default GenerateButtons;
