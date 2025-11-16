'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClan, type CreateClanPayload } from '@/lib/services/clans';
import LanguageStore from '@/stores/useLanguage';
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
      toast.success('Clan created successfully!');
      queryClient.invalidateQueries({ queryKey: ['clans', communityId] });
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
      toast.error(error.message || 'Failed to create clan');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim().length < 3) {
      toast.error('Clan name must be at least 3 characters');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Clan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Create New Clan</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Create a new clan within this community. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-900 dark:text-white">
              Clan Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter clan name"
              required
              minLength={3}
              maxLength={100}
              className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-900 dark:text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your clan..."
              maxLength={500}
              rows={3}
              className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit" className="text-gray-900 dark:text-white">
              Member Limit
            </Label>
            <Input
              id="limit"
              type="number"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: parseInt(e.target.value) || 50 })}
              min={1}
              max={1000}
              className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="space-y-0.5">
              <Label htmlFor="isPrivate" className="text-gray-900 dark:text-white cursor-pointer">
                Private Clan
              </Label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Only invited members can join
              </p>
            </div>
            <Switch
              id="isPrivate"
              checked={formData.isPrivate}
              onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Clan'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
