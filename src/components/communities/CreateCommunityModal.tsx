'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommunity } from '@/lib/services/communities';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';

interface CreateCommunityModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateCommunityModal({ open, onClose }: CreateCommunityModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberLimit, setMemberLimit] = useState<number>(100);
  const [isPrivate, setIsPrivate] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { language } = LanguageStore();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await createCommunity(language, formData);
    },
    onSuccess: data => {
      toast.success(data.body.message || t('community:toast.createdSuccess', language), {
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ['my-communities'] });
      resetForm();

      setTimeout(() => {
        onClose();
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('community:toast.createFailed', language));
    },
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setMemberLimit(100);
    setIsPrivate(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t('community:createModal.imageError', language));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('community:createModal.imageSizeError', language));
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error(t('community:createModal.nameRequired', language));
      return;
    }
    if (!description.trim()) {
      toast.error(t('community:createModal.descriptionRequired', language));
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('communityName', name.trim());
    formData.append('description', description.trim());
    formData.append('memberLimit', (memberLimit || 100).toString());
    formData.append('isPrivate', isPrivate.toString());

    // Add image if provided
    if (imageFile) {
      formData.append('photo', imageFile);
    }

    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-gray-200 bg-white sm:max-w-2xl dark:border-gray-800 dark:bg-gray-900">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('community:createModal.title', language)}
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('community:createModal.description', language)}
          </p>
        </DialogHeader>

        <div className="mt-5 space-y-5">
          {/* Community Picture and Basic Info - Side by Side */}
          <div className="flex gap-6">
            {/* Community Picture - Left Side */}
            <div className="flex flex-shrink-0 flex-col items-center">
              <Label className="mb-3 block text-sm font-medium text-gray-900 dark:text-gray-200">
                {t('community:createModal.communityImage', language)}
              </Label>

              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    id="communityImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="communityImage"
                    className="group flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 transition-all duration-200 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition-colors group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                        <Upload className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                      </div>
                      <p className="px-2 text-center text-xs text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">
                          {t('community:createModal.uploadImage', language)}
                        </span>
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50">
                  <Image
                    src={imagePreview}
                    alt="Community preview"
                    fill
                    className="object-cover object-center"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 rounded-full bg-red-500 p-1.5 text-white shadow-sm transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">Up to 5MB</p>
            </div>

            {/* Form Fields - Right Side */}
            <div className="flex-1 space-y-5">
              {/* Community Name */}
              <div>
                <Label htmlFor="communityName" className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {t('community:createModal.communityName', language)}{' '}
                  <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <Input
                  id="communityName"
                  placeholder={t('community:createModal.namePlaceholder', language)}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="mt-2 border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {t('community:createModal.descriptionLabel', language)}{' '}
                  <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder={t('community:createModal.descriptionPlaceholder', language)}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="mt-2 border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Member Limit */}
              <div>
                <Label htmlFor="memberLimit" className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {t('community:createModal.memberLimit', language)}{' '}
                  <span className="text-xs text-gray-500 dark:text-gray-400">(Default: 100)</span>
                </Label>
                <Input
                  id="memberLimit"
                  type="number"
                  min={1}
                  value={memberLimit}
                  onChange={e => setMemberLimit(Number(e.target.value))}
                  className="mt-2 border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Privacy Toggle */}
          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
              {t('community:createModal.privateCommunity', language)}
            </Label>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800/70">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {isPrivate
                      ? `🔒 ${t('community:card.private', language)}`
                      : `🌐 ${t('community:card.public', language)}`}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isPrivate
                        ? 'border border-orange-500/30 bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
                        : 'border border-green-500/30 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                    }`}
                  >
                    {isPrivate
                      ? t('community:createModal.privateDescription', language)
                      : t('community:card.public', language)}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex items-center">
                <Switch
                  checked={isPrivate}
                  onCheckedChange={(checked: boolean) => {
                    setIsPrivate(checked);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={createMutation.isPending}
          >
            {t('community:createModal.cancel', language)}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="bg-zinc-900 shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {createMutation.isPending
              ? t('community:createModal.creating', language)
              : t('community:createModal.create', language)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
