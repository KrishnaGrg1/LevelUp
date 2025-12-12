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
      toast.success('Member removed successfully');
      setMemberToRemove(null);
      queryClient.invalidateQueries({ queryKey: ['communityMembers'] });
      queryClient.invalidateQueries({ queryKey: ['adminCommunities'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove member');
    },
  });

  // Delete community mutation
  const deleteCommunityMutation = useMutation({
    mutationFn: () => deleteCommunity(community!.id, language),
    onSuccess: () => {
      toast.success('Community deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['adminCommunities'] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete community');
    },
  });

  // Update privacy mutation
  const updatePrivacyMutation = useMutation({
    mutationFn: (isPrivate: boolean) => updateCommunityPrivacy(community!.id, isPrivate, language),
    onSuccess: () => {
      toast.success('Privacy updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminCommunities'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update privacy');
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: (category: string) => updateCommunityCategory(community!.id, category, language),
    onSuccess: () => {
      toast.success('Category updated successfully');
      setSelectedCategory('');
      queryClient.invalidateQueries({ queryKey: ['adminCommunities'] });
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category');
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
            <DialogDescription>Manage community settings, members, and actions</DialogDescription>
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
                      <p className="font-medium">Privacy</p>
                      <p className="text-sm text-gray-500">
                        Currently {community.isPrivate ? 'Private' : 'Public'}
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
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `Make ${community.isPrivate ? 'Public' : 'Private'}`
                    )}
                  </Button>
                </div>

                {/* Category Change */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Tag className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">Category</p>
                      <p className="text-sm text-gray-500">
                        Current: <span className="capitalize">{community.category}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select category" />
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
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Delete Community */}
                <div className="flex items-center justify-between p-3 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-400">Delete Community</p>
                      <p className="text-sm text-red-600 dark:text-red-500">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setDeleteDialogOpen(true)}
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Members List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Members ({members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMembers ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No members found</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {members.map((member: any) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                            {member.username?.[0]?.toUpperCase() || 'U'}
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
                          onClick={() => handleRemoveMember(member.id)}
                          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
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
            <AlertDialogTitle>Delete Community</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{community.name}"? This will remove all members and
              all data associated with this community. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCommunityMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCommunity}
              disabled={deleteCommunityMutation.isPending}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {deleteCommunityMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
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
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the community? They will lose access
              immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeMemberMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveMember}
              disabled={removeMemberMutation.isPending}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {removeMemberMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                'Remove'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
