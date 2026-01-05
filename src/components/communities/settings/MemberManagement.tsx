'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  getCommunityMembers,
  removeCommunityMember,
  changeMemberRole,
} from '@/lib/services/communities';
import LanguageStore from '@/stores/useLanguage';
import authStore from '@/stores/useAuth';
import { t } from '@/translations';
import { toast } from 'sonner';
import { Search, Shield, User, Trash2, Loader2, Crown, UserCog } from 'lucide-react';
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
import { Community } from '@/lib/generated';

interface MemberManagementProps {
  community: Partial<Community> & { id: string; ownerId: string };
  isOwner: boolean;
  isAdmin: boolean;
}

interface ApiMember {
  id: string;
  userId?: string;
  UserName?: string;
  username?: string;
  userName?: string;
  email?: string;
  profilePicture?: string | null;
  avatar?: string | null;
  isAdmin?: boolean;
  role?: 'ADMIN' | 'MEMBER' | 'OWNER' | string;
  userRole?: 'ADMIN' | 'MEMBER' | 'OWNER' | string;
  user?: {
    id?: string;
    UserName?: string;
    username?: string;
    userName?: string;
    email?: string;
    profilePicture?: string | null;
    avatar?: string | null;
  };
}

interface ApiResponse {
  data?: { members?: ApiMember[] } | ApiMember[];
  body?: {
    data?:
      | {
          members?: ApiMember[];
        }
      | ApiMember[];
  };
}

interface NormalizedMember {
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  user: {
    username: string;
    email: string;
    avatar: string | null;
  };
}

function normalizeMemberRole(raw: string | undefined, isAdmin?: boolean): 'ADMIN' | 'MEMBER' {
  const explicit = raw?.toString?.().toUpperCase?.();
  if (explicit === 'ADMIN') return 'ADMIN';
  if (explicit === 'MEMBER') return 'MEMBER';
  return isAdmin ? 'ADMIN' : 'MEMBER';
}

function pickUsername(m: ApiMember): string {
  return (
    m.user?.UserName ||
    m.user?.username ||
    m.user?.userName ||
    m.UserName ||
    m.username ||
    m.userName ||
    'Unknown'
  );
}

function pickEmail(m: ApiMember): string {
  return m.user?.email || m.email || '';
}

function pickAvatar(m: ApiMember): string | null {
  return (m.user?.profilePicture || m.user?.avatar || m.profilePicture || m.avatar || null) ?? null;
}

function pickUserId(m: ApiMember): string {
  return (m.user?.id || m.userId || m.id) as string;
}

export default function MemberManagement({ community, isOwner, isAdmin }: MemberManagementProps) {
  const { language } = LanguageStore();
  const { user } = authStore();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<NormalizedMember | null>(null);

  const {
    data: membersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['community-members', community.id, language],
    queryFn: () => getCommunityMembers(language, community.id),
  });

  // Normalize members shape from API endpoint
  const apiResponse = membersData as ApiResponse;

  // Handle different possible response structures
  let adminMembers: ApiMember[] = [];
  if (apiResponse?.body?.data) {
    const bodyData = apiResponse.body.data;
    if (Array.isArray(bodyData)) {
      adminMembers = bodyData;
    } else if (bodyData.members) {
      adminMembers = bodyData.members;
    }
  } else if (apiResponse?.data) {
    if (Array.isArray(apiResponse.data)) {
      adminMembers = apiResponse.data;
    } else if (apiResponse.data.members) {
      adminMembers = apiResponse.data.members;
    }
  }

  const members: NormalizedMember[] = adminMembers.map(m => {
    const userId = pickUserId(m);
    const baseRole = normalizeMemberRole((m.role ?? m.userRole) as string | undefined, m.isAdmin);
    const role: NormalizedMember['role'] = userId === community.ownerId ? 'OWNER' : baseRole;

    return {
      userId,
      role,
      user: {
        username: pickUsername(m),
        email: pickEmail(m),
        avatar: pickAvatar(m),
      },
    };
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => removeCommunityMember(language, community.id, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-members', community.id] });
      queryClient.invalidateQueries({ queryKey: ['community-details', community.id] });
      toast.success(t('community.settings.members.removed'));
      setDeleteModalOpen(false);
      setSelectedMember(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('community.settings.members.error'));
    },
  });

  const roleChangeMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: 'ADMIN' | 'MEMBER' }) =>
      changeMemberRole(language, community.id, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-members', community.id] });
      queryClient.invalidateQueries({ queryKey: ['community-details', community.id] });
      toast.success(t('community.settings.members.roleChanged'));
    },
    onError: (error: Error) => {
      toast.error(error.message || t('community.settings.members.error'));
    },
  });

  const filteredMembers = members.filter(
    member =>
      member.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRemoveMember = (member: NormalizedMember) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const confirmRemove = () => {
    if (selectedMember) {
      removeMutation.mutate(selectedMember.userId);
    }
  };

  const handleRoleChange = (memberId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'MEMBER' : 'ADMIN';
    roleChangeMutation.mutate({ memberId, role: newRole });
  };

  // Render UI for all; backend enforces permissions.

  return (
    <>
      <Card className="border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('community.settings.members.title')}
            </h2>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {t('community.settings.members.totalMembers')}:{' '}
              <span className="font-semibold text-slate-900 dark:text-white">{members.length}</span>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {t('community.settings.members.description')}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('community.settings.members.search')}
              className="border-slate-300 bg-white pl-10 text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white"
            />
          </div>
        </div>

        {/* Members List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <User className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <p className="mb-2 font-semibold text-red-600 dark:text-red-400">
              Unable to fetch members
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {(error as Error)?.message ||
                'There was an error loading the members list. Please try again.'}
            </p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <User className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>No members found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMembers.map(member => {
              const isCurrentUser = member.userId === user?.id;
              const isCommunityOwner =
                member.userId === community.ownerId || member.role === 'OWNER';
              const memberRole = member.role || 'MEMBER';

              // Permission intent:
              // - Owners can manage everyone except themselves.
              // - Admins can manage MEMBERS only (no actions on OWNER/ADMIN).
              const canManageThisMember =
                !isCurrentUser &&
                ((isOwner && !isCommunityOwner) ||
                  (isAdmin && !isOwner && memberRole === 'MEMBER' && !isCommunityOwner));

              return (
                <div
                  key={member.userId}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-slate-600"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      {member.user?.avatar ? (
                        <img
                          src={member.user.avatar}
                          alt={member.user.username}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                          <span className="text-lg font-bold text-white">
                            {member.user?.username?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                      {/* Role Badge */}
                      {isCommunityOwner && (
                        <div className="absolute -right-1 -bottom-1 rounded-full bg-yellow-500 p-1">
                          <Crown className="h-3 w-3 text-white" />
                        </div>
                      )}
                      {!isCommunityOwner && memberRole === 'ADMIN' && (
                        <div className="absolute -right-1 -bottom-1 rounded-full bg-indigo-500 p-1">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {member.user?.username || 'Unknown User'}
                        </p>
                        {isCurrentUser && (
                          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
                            You
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-sm text-slate-400">{member.user?.email}</p>
                        {isCommunityOwner && (
                          <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                            <Crown className="h-3 w-3" />
                            {t('community.settings.members.owner')}
                          </span>
                        )}
                        {!isCommunityOwner && memberRole === 'ADMIN' && (
                          <span className="flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-400">
                            <Shield className="h-3 w-3" />
                            {t('community.settings.members.admin')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {canManageThisMember && (
                    <div className="flex items-center gap-2">
                      {/* Role Toggle Button */}
                      <Button
                        onClick={() => handleRoleChange(member.userId, memberRole)}
                        disabled={roleChangeMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
                      >
                        {roleChangeMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : memberRole === 'ADMIN' ? (
                          <>
                            <User className="h-4 w-4" />
                            {t('community.settings.members.makeMember')}
                          </>
                        ) : (
                          <>
                            <UserCog className="h-4 w-4" />
                            {t('community.settings.members.makeAdmin')}
                          </>
                        )}
                      </Button>

                      {/* Remove Button */}
                      <Button
                        onClick={() => handleRemoveMember(member)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t('community.settings.members.remove')}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('community.settings.members.removeMember')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('community.settings.members.confirmRemove')} {selectedMember?.user?.username}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedMember(null);
              }}
              disabled={removeMutation.isPending}
            >
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              disabled={removeMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.removing')}
                </>
              ) : (
                t('common.remove')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
