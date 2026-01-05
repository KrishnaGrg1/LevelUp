'use client';

import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { uploadCommunityPhoto } from '@/lib/services/communities';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';
import { toast } from 'sonner';
import { Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { Community } from '@/lib/generated';

interface CommunityWithPhoto extends Partial<Community> {
  id: string;
  ownerId: string;
  photo?: string;
}

interface PhotoSettingsProps {
  community: CommunityWithPhoto;
  isOwner: boolean;
  isAdmin: boolean;
}

export default function PhotoSettings({ community }: PhotoSettingsProps) {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadCommunityPhoto(language, community.id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-details', community.id] });
      toast.success(t('community.settings.photo.uploaded'));
      setPreview(null);
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('community.settings.photo.error'));
    },
  });

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('photo', selectedFile);

    uploadMutation.mutate(formData);
  };

  const clearSelection = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render UI for all; backend enforces permissions.

  return (
    <Card className="border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
          {t('community.settings.photo.title')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t('community.settings.photo.description')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Current Photo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t('community.settings.photo.currentPhoto')}
          </h3>
          {community.photo ? (
            <div className="relative inline-block">
              <img
                src={community.photo}
                alt={community.name}
                className="h-48 w-full max-w-md rounded-lg border-2 border-slate-300 object-cover dark:border-slate-700"
              />
            </div>
          ) : (
            <div className="flex h-48 w-full max-w-md items-center justify-center rounded-lg border-2 border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="text-center text-slate-400 dark:text-slate-500">
                <ImageIcon className="mx-auto mb-2 h-12 w-12" />
                <p>{t('community.settings.photo.noPhoto')}</p>
              </div>
            </div>
          )}
        </div>

        {/* Upload New Photo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {t('community.settings.photo.uploadNew')}
          </h3>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-300 bg-slate-100 hover:border-indigo-500/50 dark:border-slate-700 dark:bg-slate-800/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 w-full rounded-lg object-contain"
                />
                <button
                  onClick={e => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <p className="mb-1 font-medium text-slate-900 dark:text-white">
                  {t('community.settings.photo.dragDrop')}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('community.settings.photo.fileTypes')}
                </p>
              </div>
            )}
          </div>

          {/* Upload Button */}
          {selectedFile && (
            <div className="flex justify-end gap-3">
              <Button
                onClick={clearSelection}
                variant="outline"
                className="border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('community.settings.photo.uploading')}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
