'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Users, Trash2, Lock, Unlock, Tag } from 'lucide-react';
import LanguageStore from '@/stores/useLanguage';
import { getCategories } from '@/lib/services/communities';
import {
  getCommunityMembers,
  removeCommunityMember,
  deleteCommunity,
  updateCommunityPrivacy,
  updateCommunityCategory,
} from '@/lib/services/admin-communities';
import { MemberData } from '@/lib/generated';
import { t } from '@/translations';

interface CommunityActionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  community: {
    id: string;
    name: string;
    isPrivate: boolean;
    category: string;
  } | null;
}

export function CommunityActionsModal({
  open,
  onOpenChange,
  community,
}: CommunityActionsModalProps) {
  const { language } = LanguageStore();
  const queryClient = useQueryClient();
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch community members
  const { data: membersData, isPending: loadingMembers } = useQuery({
    queryKey: ['communityMembers', community?.id, language],
    queryFn: () => getCommunityMembers(community!.id, language),
    enabled: open && !!community,
  });

  // Fetch categories for category change
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', language],
    queryFn: () => getCategories(language),
    enabled: open && !!community,
  });

  const members = membersData?.body?.data?.members || [];

  const categories = categoriesData?.body?.data?.categories || [];

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => removeCommunityMember(community!.id, userId, language),
    onSuccess: () => {
      toast.success(t('admin:actionsModal.toast.memberRemoved', language));
      setMemberToRemove(null);
      queryClient.invalidateQueries({ queryKey: ['communityMembers'] });
      queryClient.invalidateQueries({ queryKey: ['adminCommunities'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('admin:actionsModal.toast.memberRemoveFailed', language));
    },
  });

  // Delete community mutation
  const deleteCommunityMutation = useMutation({
    mutationFn: () => deleteCommunity(community!.id, language),
    onSuccess: () => {
      toast.success(t('admin:actionsModal.toast.communityDeleted', language));
      queryClient.invalidateQueries({ queryKey: ['adminCommunities'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('admin:actionsModal.toast.communityDeleteFailed', language));
    },
  });

  // Update privacy mutation
  const updatePrivacyMutation = useMutation({
    mutationFn: (isPrivate: boolean) => updateCommunityPrivacy(community!.id, isPrivate, language),
    onSuccess: () => {
      toast.success(t('admin:actionsModal.toast.privacyUpdated', language));
      queryClient.invalidateQueries({ queryKey: ['adminCommunities'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('admin:actionsModal.toast.privacyFailed', language));
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: (category: string) => updateCommunityCategory(community!.id, category, language),
    onSuccess: () => {
      toast.success(t('admin:actionsModal.toast.categoryUpdated', language));
      setSelectedCategory('');
      queryClient.invalidateQueries({ queryKey: ['adminCommunities'] });
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t('admin:actionsModal.toast.categoryFailed', language));
    },
  });

  const handleRemoveMember = (userId: string) => {
    setMemberToRemove(userId);
  };

  const confirmRemoveMember = () => {
    if (memberToRemove) {
      removeMemberMutation.mutate(memberToRemove);
    }
  };

  const handleDeleteCommunity = () => {
    deleteCommunityMutation.mutate();
  };

  const handleTogglePrivacy = () => {
    if (community) {
      updatePrivacyMutation.mutate(!community.isPrivate);
    }
  };

  const handleUpdateCategory = () => {
    if (selectedCategory && selectedCategory !== community?.category) {
      updateCategoryMutation.mutate(selectedCategory);
    }
  };

  if (!community) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{community.name}</DialogTitle>
            <DialogDescription>{t('admin:actionsModal.subtitle', language)}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Community Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Privacy Toggle */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {community.isPrivate ? (
                      <Lock className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Unlock className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {t('admin:actionsModal.sections.privacy.title', language)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('admin:actionsModal.sections.privacy.currentStatus', language)}:{' '}
                        {community.isPrivate
                          ? t('admin:communityManagement.privacy.private', language)
                          : t('admin:communityManagement.privacy.public', language)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleTogglePrivacy}
                    disabled={updatePrivacyMutation.isPending}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    {updatePrivacyMutation.isPending ? (
                      <>{t('admin:actionsModal.sections.privacy.updating', language)}</>
                    ) : (
                      t('admin:actionsModal.sections.privacy.changePrivacy', language)
                    )}
                  </Button>
                </div>

                {/* Category Change */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">
                        {t('admin:actionsModal.sections.category.title', language)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('admin:actionsModal.sections.category.currentCategory', language)}:{' '}
                        <span className="capitalize">{community.category}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder={t(
                            'admin:actionsModal.sections.category.selectCategory',
                            language,
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat: string) => (
                          <SelectItem key={cat} value={cat} className="capitalize">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleUpdateCategory}
                      disabled={
                        !selectedCategory ||
                        selectedCategory === community.category ||
                        updateCategoryMutation.isPending
                      }
                      className="cursor-pointer"
                    >
                      {updateCategoryMutation.isPending ? (
                        <>{t('admin:actionsModal.sections.category.updating', language)}</>
                      ) : (
                        t('admin:actionsModal.sections.category.changeCategory', language)
                      )}
                    </Button>
                  </div>
                </div>

                {/* Delete Community */}
                <div className="flex items-center justify-between p-3 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-400">
                        {t('admin:actionsModal.sections.danger.deleteCommunity', language)}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-500">
                        {t('admin:actionsModal.sections.danger.deleteDescription', language)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setDeleteDialogOpen(true)}
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    {t('admin:actionsModal.sections.danger.deleteButton', language)}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Members List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('admin:actionsModal.sections.members.title', language)} ({members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMembers ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="sr-only">
                      {t('admin:actionsModal.sections.members.loading', language)}
                    </span>
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {t('admin:actionsModal.sections.members.noMembers', language)}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {members.map((member: MemberData) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                            {member.UserName?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium">{member.UserName}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                          {member.isAdmin && <Badge variant="secondary">Community Admin</Badge>}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => member.id && handleRemoveMember(member.id)}
                          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          title={t('admin:actionsModal.sections.members.remove', language)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Community Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('admin:actionsModal.deleteDialog.title', language)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin:actionsModal.deleteDialog.description', language)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCommunityMutation.isPending}>
              {t('admin:actionsModal.deleteDialog.cancel', language)}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCommunity}
              disabled={deleteCommunityMutation.isPending}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {deleteCommunityMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t('admin:actionsModal.sections.danger.deleting', language)}
                </>
              ) : (
                t('admin:actionsModal.deleteDialog.confirm', language)
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Member Confirmation */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open: boolean) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('admin:actionsModal.removeDialog.title', language)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin:actionsModal.removeDialog.description', language)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMemberMutation.isPending}>
              {t('admin:actionsModal.removeDialog.cancel', language)}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveMember}
              disabled={removeMemberMutation.isPending}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {removeMemberMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t('admin:actionsModal.sections.danger.deleting', language)}
                </>
              ) : (
                t('admin:actionsModal.removeDialog.confirm', language)
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
