'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { updateCommunity } from '@/lib/services/communities';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';
import { Community } from '@/lib/generated';

type CommunityForGeneralSettings = Partial<Community> & {
  id: string;
  name?: string;
};

interface GeneralSettingsProps {
  community: CommunityForGeneralSettings;
  isOwner: boolean;
  isAdmin: boolean;
}

export default function GeneralSettings({ community, isOwner, isAdmin }: GeneralSettingsProps) {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: community.name || '',
    description: community.description || '',
    memberLimit: community.memberLimit || 100,
    isPrivate: community.isPrivate || false,
  });

  useEffect(() => {
    setFormData({
      name: community.name || '',
      description: community.description || '',
      memberLimit: community.memberLimit || 100,
      isPrivate: community.isPrivate || false,
    });
  }, [community]);

  const updateMutation = useMutation({
    mutationFn: () => updateCommunity(language, community.id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-details', community.id] });
      toast.success(t('community.settings.general.saved'));
    },
    onError: (error: Error) => {
      toast.error(error.message || t('community.settings.general.error'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.name.length < 3 || formData.name.length > 150) {
      toast.error('Community name must be between 3 and 150 characters');
      return;
    }

    if (formData.description && formData.description.length > 500) {
      toast.error('Description must be less than 500 characters');
      return;
    }

    if (formData.memberLimit < 1 || formData.memberLimit > 1000) {
      toast.error('Member limit must be between 1 and 1000');
      return;
    }

    updateMutation.mutate();
  };

  if (!isOwner && !isAdmin) {
    return (
      <Card className="border-slate-800 bg-slate-900/50 p-8">
        <div className="text-center text-slate-400">
          <p>{t('community.settings.permissions.ownerOnly')}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
          {t('community.settings.general.title')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t('community.settings.general.description')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Community Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-900 dark:text-white">
            {t('community.settings.general.communityName')}
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('community.settings.general.namePlaceholder')}
            className="border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
            maxLength={150}
            required
          />
          <p className="text-xs text-slate-500 dark:text-slate-500">
            {formData.name.length}/150 characters
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-slate-900 dark:text-white">
            {t('community.settings.general.descriptionLabel')}
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder={t('community.settings.general.descriptionPlaceholder')}
            className="min-h-[120px] border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
            maxLength={500}
          />
          <p className="text-xs text-slate-500 dark:text-slate-500">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Member Limit */}
        <div className="space-y-2">
          <Label htmlFor="memberLimit" className="text-slate-900 dark:text-white">
            {t('community.settings.general.memberLimit')}
          </Label>
          <Input
            id="memberLimit"
            type="number"
            value={formData.memberLimit}
            onChange={e => setFormData({ ...formData, memberLimit: parseInt(e.target.value) })}
            min={1}
            max={1000}
            className="border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
            required
          />
          <p className="text-xs text-slate-500">
            {t('community.settings.general.memberLimitDesc')}
          </p>
        </div>

        {/* Visibility Toggle */}
        <div className="space-y-4 rounded-lg border border-slate-300 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="visibility" className="font-semibold text-slate-900 dark:text-white">
                {t('community.settings.general.visibility')}
              </Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {formData.isPrivate
                  ? t('community.settings.general.privateDesc')
                  : t('community.settings.general.publicDesc')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm ${!formData.isPrivate ? 'font-medium text-green-600 dark:text-green-400' : 'text-slate-500'}`}
              >
                {t('community.settings.general.public')}
              </span>
              <Switch
                id="visibility"
                checked={formData.isPrivate}
                onCheckedChange={checked => setFormData({ ...formData, isPrivate: checked })}
                className="data-[state=checked]:bg-indigo-600"
              />
              <span
                className={`text-sm ${formData.isPrivate ? 'font-medium text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
              >
                {t('community.settings.general.private')}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-slate-900 px-8 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('community.settings.general.saving')}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {t('community.settings.general.saveChanges')}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
