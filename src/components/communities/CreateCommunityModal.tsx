'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommunity } from '@/lib/services/communities';
import LanguageStore from '@/stores/useLanguage';
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
      toast.success(data.body.message || 'Community created successfully!', {
        duration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ['my-communities'] });
      resetForm();

      setTimeout(() => {
        onClose();
      }, 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create community');
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
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
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
      toast.error('Community name is required');
      return;
    }
    if (!description.trim()) {
      toast.error('Community description is required');
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

    console.log('Submitting FormData with:', {
      communityName: name.trim(),
      description: description.trim(),
      memberLimit: memberLimit || 100,
      isPrivate,
      hasImage: !!imageFile,
    });

    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-[8px] transition-all duration-300" />

      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 text-gray-100 shadow-[0_0_25px_rgba(59,130,246,0.45)] border border-blue-500/20 rounded-2xl backdrop-blur-md transition-all duration-300">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Create New Community
          </DialogTitle>
          <p className="text-sm text-gray-300">
            Set up a new professional community. Invite members and start collaborating.
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-5">
          {/* Community Picture and Basic Info - Side by Side */}
          <div className="flex gap-6">
            {/* Community Picture - Left Side */}
            <div className="flex flex-col items-center flex-shrink-0">
              <Label className="text-sm font-medium text-gray-200 mb-3 block">Picture</Label>

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
                    className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-600 rounded-full cursor-pointer bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-200 group"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 group-hover:bg-blue-500/20 transition-colors">
                        <Upload className="h-5 w-5 text-blue-400" />
                      </div>
                      <p className="text-xs text-gray-300 text-center px-2">
                        <span className="font-semibold">Upload</span>
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-600 bg-gray-800/50">
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
                    className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500/90 hover:bg-red-600 text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2 text-center">Up to 5MB</p>
            </div>

            {/* Form Fields - Right Side */}
            <div className="flex-1 space-y-5">
              {/* Community Name */}
              <div>
                <Label htmlFor="communityName" className="text-sm font-medium text-gray-200">
                  Community Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="communityName"
                  placeholder="e.g., Tech Innovators"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="mt-2 bg-gray-800/70 border border-gray-600 text-gray-100 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-200">
                  Description <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Write a short description..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="mt-2 bg-gray-800/70 border border-gray-600 text-gray-100 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                />
              </div>

              {/* Member Limit */}
              <div>
                <Label htmlFor="memberLimit" className="text-sm font-medium text-gray-200">
                  Member Limit <span className="text-gray-400 text-xs">(Default: 100)</span>
                </Label>
                <Input
                  id="memberLimit"
                  type="number"
                  min={1}
                  value={memberLimit}
                  onChange={e => setMemberLimit(Number(e.target.value))}
                  className="mt-2 bg-gray-800/70 border border-gray-600 text-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Privacy Toggle */}
          <div>
            <Label className="text-sm font-medium text-gray-200 mb-2 block">
              Community Privacy
            </Label>
            <div className="flex items-center justify-between border border-gray-700/50 rounded-lg px-4 py-3 bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200">
                    {isPrivate ? '🔒 Private' : '🌐 Public'}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isPrivate
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}
                  >
                    {isPrivate ? 'Invite Only' : 'Anyone Can Join'}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex items-center">
                <Switch
                  checked={isPrivate}
                  onCheckedChange={(checked: boolean) => {
                    console.log('Switch toggled:', checked);
                    setIsPrivate(checked);
                  }}
                  className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-600 border-2 data-[state=checked]:border-blue-500 data-[state=unchecked]:border-gray-500"
                  style={{
                    backgroundColor: isPrivate ? '#2563eb' : '#4b5563',
                    borderColor: isPrivate ? '#3b82f6' : '#6b7280',
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
            className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {createMutation.isPending ? 'Creating...' : 'Create Community'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
