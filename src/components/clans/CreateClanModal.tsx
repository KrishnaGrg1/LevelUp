'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClan, type CreateClanPayload } from '@/lib/services/clans';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations/index';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateClanModalProps {
  communityId: string;
}

export default function CreateClanModal({ communityId }: CreateClanModalProps) {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState<CreateClanPayload>({
    name: '',
    communityId,
    description: '',
    isPrivate: false,
    limit: 50,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateClanPayload) => createClan(payload, language),
    onSuccess: () => {
      toast.success(t('clans.toast.createdSuccess', language));
      queryClient.invalidateQueries({ queryKey: ['clans', communityId] });
      queryClient.invalidateQueries({ queryKey: ['community-details'] });
      setOpen(false);
      setFormData({
        name: '',
        communityId,
        description: '',
        isPrivate: false,
        limit: 50,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('clans.toast.createFailed', language));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim().length < 3) {
      toast.error(t('clans.createModal.nameMinLength', language));
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 bg-black px-3 text-xs text-white shadow-sm hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          {t('clans.createClan', language)}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-gray-200 bg-white sm:max-w-[500px] dark:border-gray-800 dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            {t('clans.createModal.title', language)}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {t('clans.createModal.description', language)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900 dark:text-white">
              {t('clans.createModal.clanName', language)} *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('clans.createModal.namePlaceholder', language)}
              required
              minLength={3}
              maxLength={100}
              className="border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-900 dark:text-white">
              {t('clans.createModal.descriptionLabel', language)}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('clans.createModal.descriptionPlaceholder', language)}
              maxLength={500}
              rows={3}
              className="resize-none border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit" className="text-gray-900 dark:text-white">
              {t('clans.createModal.memberLimit', language)}
            </Label>
            <Input
              id="limit"
              type="number"
              value={formData.limit}
              onChange={e => setFormData({ ...formData, limit: parseInt(e.target.value) || 50 })}
              min={1}
              max={1000}
              className="border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="space-y-0.5">
              <Label htmlFor="isPrivate" className="cursor-pointer text-gray-900 dark:text-white">
                {t('clans.createModal.privateClan', language)}
              </Label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('clans.createModal.privateDescription', language)}
              </p>
            </div>
            <Switch
              id="isPrivate"
              checked={formData.isPrivate}
              onCheckedChange={checked => setFormData({ ...formData, isPrivate: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
              disabled={createMutation.isPending}
            >
              {t('clans.createModal.cancel', language)}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('clans.creating', language)}
                </>
              ) : (
                t('clans.createClan', language)
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
