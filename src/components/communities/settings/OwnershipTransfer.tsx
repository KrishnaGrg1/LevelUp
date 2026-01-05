'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCommunityMembers, transferOwnership } from '@/lib/services/communities';
import LanguageStore from '@/stores/useLanguage';
import authStore from '@/stores/useAuth';
import { t } from '@/translations';
import { toast } from 'sonner';
import { AlertTriangle, Crown, Loader2, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Community } from '@/lib/generated';

interface OwnershipTransferProps {
  community: Partial<Community> & { id: string; ownerId: string };
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
  role?: 'ADMIN' | 'MEMBER' | string;
  userRole?: 'ADMIN' | 'MEMBER' | string;
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
  data?: {
    members?: ApiMember[];
  };
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
  role: 'ADMIN' | 'MEMBER';
  user: {
    username: string;
    email: string;
    avatar: string | null;
  };
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

function normalizeMemberRole(raw: string | undefined, isAdmin?: boolean): 'ADMIN' | 'MEMBER' {
  const explicit = raw?.toString?.().toUpperCase?.();
  if (explicit === 'ADMIN') return 'ADMIN';
  if (explicit === 'MEMBER') return 'MEMBER';
  return isAdmin ? 'ADMIN' : 'MEMBER';
}

export default function OwnershipTransfer({ community }: OwnershipTransferProps) {
  const { language } = LanguageStore();
  const { user } = authStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { data: membersData, isLoading } = useQuery({
    queryKey: ['community-members', community.id, language],
    queryFn: () => getCommunityMembers(language, community.id),
  });

  // Normalize members shape from API endpoint (same as MemberManagement)
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
  } else if (apiResponse?.data?.members) {
    adminMembers = apiResponse.data.members;
  } else if (Array.isArray(apiResponse?.data)) {
    adminMembers = apiResponse.data as ApiMember[];
  }

  const members: NormalizedMember[] = adminMembers.map(m => ({
    userId: pickUserId(m),
    role: normalizeMemberRole((m.role ?? m.userRole) as string | undefined, m.isAdmin),
    user: {
      username: pickUsername(m),
      email: pickEmail(m),
      avatar: pickAvatar(m),
    },
  }));

  // Only show members that are NOT the current owner.
  // (We also exclude current user for safety, though in practice the current user should be the owner here.)
  const eligibleMembers = members.filter(m => m.userId !== community.ownerId && m.userId !== user?.id);

  const transferMutation = useMutation({
    mutationFn: () =>
      transferOwnership(language, community.id, {
        newOwnerId: selectedMemberId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-details', community.id] });
      queryClient.invalidateQueries({ queryKey: ['community-members', community.id] });
      toast.success(t('community.settings.ownership.transferred'));

      // Redirect back to community after a short delay
      setTimeout(() => {
        router.push(`/${language}/user/community/${community.id}`);
      }, 2000);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('community.settings.ownership.error'));
    },
  });

  const handleTransfer = () => {
    if (!selectedMemberId) {
      toast.error(t('community.settings.ownership.selectMemberError'));
      return;
    }
    setShowConfirmation(true);
  };

  const confirmTransfer = () => {
    transferMutation.mutate();
  };

  const selectedMember = members.find(m => m.userId === selectedMemberId);

  return (
    <Card className="border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-black">
      {!showConfirmation ? (
        <>
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
              {t('community.settings.ownership.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('community.settings.ownership.description')}
            </p>
          </div>

          {/* Warning Banner */}
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-950/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="mb-1 font-semibold text-red-700 dark:text-red-400">
                  {t('community.settings.ownership.warning')}
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300/80">
                  {t('community.settings.ownership.warningDesc')}
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
            </div>
          ) : eligibleMembers.length === 0 ? (
            <div className="py-12 text-center">
              <Shield className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
              <p className="text-gray-600 dark:text-gray-400">
                {t('community.settings.ownership.noEligibleMembers')}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                {t('community.settings.ownership.needAnotherMember')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Member Selection */}
              <div className="space-y-2">
                <Label htmlFor="newOwner" className="font-medium text-black dark:text-white">
                  {t('community.settings.ownership.selectMember')}
                </Label>
                <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                  <SelectTrigger className="w-full border-gray-300 bg-white text-black dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                    <SelectValue
                      placeholder={t('community.settings.ownership.selectPlaceholder')}
                    />
                  </SelectTrigger>
                  <SelectContent className="border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    {eligibleMembers.map(member => (
                      <SelectItem
                        key={member.userId}
                        value={member.userId}
                        className="cursor-pointer text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-3 py-1">
                          {member.user.avatar ? (
                            <img
                              src={member.user.avatar}
                              alt={member.user.username}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-black to-gray-700 text-xs font-bold text-white dark:from-white dark:to-gray-300 dark:text-black">
                              {member.user.username[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.user.username}</span>
                            {member.role === 'ADMIN' && (
                              <span className="rounded-full bg-black px-2 py-0.5 text-xs font-medium text-white dark:bg-white dark:text-black">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transfer Button */}
              <div className="flex justify-end border-t border-gray-200 pt-4 dark:border-gray-800">
                <Button
                  onClick={handleTransfer}
                  disabled={!selectedMemberId}
                  className="bg-black px-8 font-medium text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-100"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  {t('community.settings.ownership.transfer')}
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Confirmation Screen */
        <div className="py-8 text-center">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20">
              <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
              {t('community.settings.ownership.confirmTransfer')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('community.settings.ownership.confirmMessage')}
            </p>
          </div>

          {/* Selected Member Card */}
          {selectedMember && (
            <div className="mx-auto mb-8 max-w-md rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center justify-center gap-4">
                {selectedMember.user.avatar ? (
                  <img
                    src={selectedMember.user.avatar}
                    alt={selectedMember.user.username}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-black to-gray-700 text-2xl font-bold text-white dark:from-white dark:to-gray-300 dark:text-black">
                    {selectedMember.user.username[0]?.toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xl font-bold text-black dark:text-white">
                    {selectedMember.user.username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMember.user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  • Will become the new owner of{' '}
                  <span className="font-semibold text-black dark:text-white">{community.name}</span>
                </p>
                <p>• {t('community.settings.ownership.fullControl')}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setShowConfirmation(false)}
              variant="outline"
              disabled={transferMutation.isPending}
              className="border-gray-300 px-8 text-black hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
            >
              {t('community.settings.members.cancel')}
            </Button>
            <Button
              onClick={confirmTransfer}
              disabled={transferMutation.isPending}
              className="bg-black px-8 font-medium text-white hover:bg-gray-900 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-100"
            >
              {transferMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('community.settings.ownership.transferring')}
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-4 w-4" />
                  {t('community.settings.ownership.confirmButton')}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
