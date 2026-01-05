'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  communityDetailById,
  getCommunityMembers,
  getMyCommunities,
} from '@/lib/services/communities';
import { getCommunityLeaderboard } from '@/lib/services/leaderboard';
import LanguageStore from '@/stores/useLanguage';
import authStore from '@/stores/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Users, Eye, EyeOff, Loader2, Trophy, Crown } from 'lucide-react';
import { BetterPagination } from '@/components/BetterPagination';

interface ApiMember {
  id: string;
  userId?: string;
  UserName?: string;
  username?: string;
  email?: string;
  profilePicture?: string | null;
  isAdmin?: boolean;
  role?: 'ADMIN' | 'MEMBER' | string;
  userRole?: 'ADMIN' | 'MEMBER' | string;
  user?: {
    id: string;
    UserName?: string;
    profilePicture?: string | null;
  };
}

interface ApiMembersResponse {
  data?: { members?: ApiMember[] } | ApiMember[];
  body?: {
    data?: { members?: ApiMember[] } | ApiMember[];
  };
}

function normalizeCommunityMembers(input: unknown): ApiMember[] {
  const apiResponse = input as ApiMembersResponse | undefined;

  let members: ApiMember[] = [];
  const bodyData = apiResponse?.body?.data;
  const rootData = apiResponse?.data;

  if (bodyData) {
    if (Array.isArray(bodyData)) members = bodyData;
    else if (bodyData.members && Array.isArray(bodyData.members)) members = bodyData.members;
  } else if (rootData) {
    if (Array.isArray(rootData)) members = rootData;
    else if (rootData.members && Array.isArray(rootData.members)) members = rootData.members;
  }

  return members;
}

function getApiMemberRole(m: ApiMember): 'ADMIN' | 'MEMBER' {
  const explicit = (m.role ?? m.userRole)?.toString?.().toUpperCase?.();
  if (explicit === 'ADMIN') return 'ADMIN';
  if (explicit === 'MEMBER') return 'MEMBER';
  return m.isAdmin ? 'ADMIN' : 'MEMBER';
}

export default function CommunityDetailsPage() {
  const params = useParams();
  const communityId = params.id as string;
  const { language } = LanguageStore();
  const { user } = authStore();
  const [membersPage, setMembersPage] = React.useState(1);
  const membersLimit = 20;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['community-details', communityId, language],
    queryFn: () => communityDetailById(language, communityId),
    enabled: !!communityId,
    staleTime: 30000,
  });

  const community = data?.body?.data;

  // Community detail now includes ownerId (source of truth).
  // We still optionally fetch my-communities to resolve *viewer role* reliably.
  const { data: myCommunitiesData } = useQuery({
    queryKey: ['my-communities', language],
    queryFn: () => getMyCommunities(language),
    enabled: !!user?.id && !community?.userRole,
    staleTime: 30000,
  });

  const myCommunity = myCommunitiesData?.body?.data?.find(c => c.id === communityId);
  const ownerId: string | undefined = community?.ownerId ?? undefined;

  const viewerRole: 'OWNER' | 'ADMIN' | 'MEMBER' | undefined =
    ownerId && user?.id && ownerId === user.id
      ? 'OWNER'
      : (myCommunity?.userRole ?? community?.userRole ?? undefined);

  // Best-effort role lookup:
  // - OWNER inferred from `ownerId`
  // - ADMIN inferred from admin-only members endpoint (will fail for normal members; we fallback)
  const { data: membersRolesRaw } = useQuery({
    queryKey: ['community-members-roles', communityId, language],
    queryFn: () => getCommunityMembers(language, communityId),
    enabled: !!communityId && !!community,
    staleTime: 30000,
    retry: false,
  });

  const membersRoles = normalizeCommunityMembers(membersRolesRaw);
  const roleByUserId = React.useMemo(() => {
    const map = new Map<string, 'ADMIN' | 'MEMBER'>();
    for (const m of membersRoles) {
      const role = getApiMemberRole(m);
      const keys = [m.user?.id, m.userId, m.id].filter(Boolean) as string[];
      for (const k of keys) map.set(k, role);
    }
    return map;
  }, [membersRoles]);

  const {
    data: membersData,
    isPending: isMembersPending,
    isError: isMembersError,
  } = useQuery({
    queryKey: ['community-members', communityId, membersPage, membersLimit],
    queryFn: () => getCommunityLeaderboard(communityId, { page: membersPage, limit: membersLimit }),
    enabled: !!communityId,
    staleTime: 30000,
  });

  const ownerName: string | undefined = React.useMemo(() => {
    if (!ownerId) return undefined;
    const results = membersData?.results ?? [];
    return results.find(m => m.user?.id === ownerId)?.user?.UserName;
  }, [membersData?.results, ownerId]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button
            asChild
            variant="outline"
            className="border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900"
          >
            <Link
              href={`/${language}/user/community/${communityId}`}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>

          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Community</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Details</p>
          </div>
        </div>

        <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
          <div className="p-5 sm:p-6">
            {isPending ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-700 dark:text-gray-300" />
              </div>
            ) : isError ? (
              <div className="py-10 text-center">
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Failed to load community details
                </p>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {(error as Error)?.message || 'Please try again.'}
                </p>
              </div>
            ) : !community ? (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Community not found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
                    <Shield className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {community.name}
                    </h1>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {(community?._count?.members ?? 0).toLocaleString()} members
                      </span>
                      <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                      <span className="inline-flex items-center gap-1">
                        {community?.isPrivate ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                        {community?.isPrivate ? 'Private' : 'Public'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/30">
                    <p className="text-[10px] tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Description
                    </p>
                    <p className="mt-2 text-sm whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                      {community?.description?.trim?.()
                        ? community.description
                        : 'No description provided.'}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/30">
                    <p className="text-[10px] tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Overview
                    </p>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Members</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {(community?._count?.members ?? 0).toLocaleString()} /{' '}
                          {community?.memberLimit ?? '—'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Clans</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {(community?._count?.clans ?? 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Your role</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {viewerRole ?? '—'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Owner</span>
                        <span className="max-w-[12rem] truncate font-semibold text-gray-900 dark:text-gray-100">
                          {ownerName ?? ownerId ?? '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Members
                        </p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                          {(
                            membersData?.pagination?.total ??
                            community?._count?.members ??
                            0
                          ).toLocaleString()}{' '}
                          total
                        </p>
                      </div>

                      {isMembersPending ? (
                        <span className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Loading
                        </span>
                      ) : isMembersError ? (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Unable to load list
                        </span>
                      ) : null}
                    </div>

                    {isMembersPending ? (
                      <div className="mt-4 flex items-center justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-700 dark:text-gray-300" />
                      </div>
                    ) : isMembersError ? (
                      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Could not load members right now.
                      </p>
                    ) : !membersData?.results?.length ? (
                      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        No members found.
                      </p>
                    ) : (
                      <div className="mt-4 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
                        {membersData.results.map((member, index) => {
                          const rank = (membersPage - 1) * membersLimit + index + 1;
                          const role =
                            ownerId && member.user.id === ownerId
                              ? 'OWNER'
                              : (roleByUserId.get(member.user.id) ?? 'MEMBER');

                          return (
                            <div
                              key={member.id}
                              className="flex items-center justify-between gap-3 bg-white px-3 py-2.5 transition-colors hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900/40"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="w-10 shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400">
                                  #{rank}
                                </div>

                                {member.user.profilePicture ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={member.user.profilePicture}
                                    alt={member.user.UserName ?? 'User'}
                                    className="h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-gray-800"
                                  />
                                ) : (
                                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-900 dark:border-gray-800 dark:bg-black dark:text-gray-100">
                                    {member.user.UserName?.charAt(0)?.toUpperCase?.() || '?'}
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                                      {member.user.UserName ?? 'Unknown'}
                                    </p>

                                    {role === 'OWNER' ? (
                                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[10px] font-semibold text-gray-900 dark:border-gray-700 dark:bg-black dark:text-gray-100">
                                        <Crown className="h-3 w-3" />
                                        Owner
                                      </span>
                                    ) : role === 'ADMIN' ? (
                                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100">
                                        <Shield className="h-3 w-3" />
                                        Admin
                                      </span>
                                    ) : null}
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Level {member.level}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 text-right">
                                <p className="text-[10px] tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                  XP
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  {member.totalXP.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {!!membersData?.pagination && membersData.pagination.totalPages > 1 ? (
                      <div className="mt-4">
                        <BetterPagination
                          paginationMetadata={{
                            total: membersData.pagination.total,
                            page: membersPage,
                            pageSize: membersLimit,
                            totalPages: membersData.pagination.totalPages,
                          }}
                          onPageChange={setMembersPage}
                        />
                      </div>
                    ) : null}

                    {!!membersData?.pagination ? (
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <Trophy className="h-3.5 w-3.5" />
                          Sorted by community XP
                        </span>
                        <span>
                          Showing {((membersPage - 1) * membersLimit + 1).toLocaleString()}–
                          {Math.min(
                            membersPage * membersLimit,
                            membersData.pagination.total,
                          ).toLocaleString()}{' '}
                          of {membersData.pagination.total.toLocaleString()}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    asChild
                    className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    <Link href={`/${language}/user/community/${communityId}`}>Open Hub</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900"
                  >
                    <Link href={`/${language}/user/community/${communityId}/settings`}>
                      Settings
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
