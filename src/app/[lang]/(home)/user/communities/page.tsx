'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';
import {
  Users,
  Search,
  Crown,
  Shield,
  Star,
  TrendingUp,
  Loader2,
  Plus,
  Settings,
} from 'lucide-react';
import { getMyCommunities } from '@/lib/services/communities';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CommunityDTO } from '@/lib/generated';

export default function UserCommunitiesPage() {
  const { language } = LanguageStore();
  const { user } = authStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: communitiesData, isLoading } = useQuery({
    queryKey: ['my-communities', language],
    queryFn: () => getMyCommunities(language),
    enabled: !!user?.id,
  });

  const communities = (communitiesData?.body?.data ?? []) as CommunityDTO[];
  const filteredCommunities = communities.filter(community =>
    (community.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const ownedCommunities = communities.filter(c => !!c.ownerId && c.ownerId === user?.id);
  const adminCommunities = communities.filter(c => c.userRole === 'ADMIN');
  const memberCommunities = communities.filter(c => c.userRole === 'MEMBER');

  const getRoleBadge = (role: 'ADMIN' | 'MEMBER' | 'OWNER') => {
    switch (role) {
      case 'OWNER':
        return (
          <Badge className="border border-black/10 bg-black text-white dark:border-white/10 dark:bg-white dark:text-black">
            <Crown className="mr-1 h-3 w-3" />
            {t('community.card.owner')}
          </Badge>
        );
      case 'ADMIN':
        return (
          <Badge className="border border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <Shield className="mr-1 h-3 w-3" />
            {t('community.settings.members.admin')}
          </Badge>
        );
      default:
        return (
          <Badge className="border border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <Users className="mr-1 h-3 w-3" />
            {t('community.settings.members.member')}
          </Badge>
        );
    }
  };

  const CommunityCard = ({ community }: { community: CommunityDTO }) => (
    <Card
      className="cursor-pointer border-gray-200 bg-white p-6 transition-all hover:border-gray-300 dark:border-gray-800 dark:bg-black dark:hover:border-gray-700"
      onClick={() => router.push(`/${language}/user/community/${community.id}`)}
    >
      <div className="flex items-start gap-4">
        {/* Community Photo */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black dark:bg-white">
          {community.photo ? (
            <img
              src={community.photo}
              alt={community.name}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <Users className="h-8 w-8 text-white dark:text-black" />
          )}
        </div>

        {/* Community Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="mb-1 truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
                {community.name}
              </h3>
              {community.description && (
                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {community.description}
                </p>
              )}
            </div>
            {community.isPinned && (
              <Star className="h-5 w-5 flex-shrink-0 fill-current text-gray-900 dark:text-gray-100" />
            )}
          </div>

          {/* Stats and Role */}
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {getRoleBadge(community.ownerId === user?.id ? 'OWNER' : community.userRole)}

            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              {community.currentMembers || 0} / {community.maxMembers || 100} members
            </div>

            {community.totalXP !== undefined && (
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="h-4 w-4" />
                {community.totalXP} XP
              </div>
            )}

            {community.level && (
              <Badge className="border border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                Level {community.level}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Button */}
        {(community.ownerId === user?.id || community.userRole === 'ADMIN') && (
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0 border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-900"
            onClick={e => {
              e.stopPropagation();
              router.push(`/${language}/user/community/${community.id}/settings`);
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-gray-100" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 dark:bg-black">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('community.myCommunities.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('community.myCommunities.subtitle')}
            </p>
          </div>
          <Link href={`/${language}/user/dashboard`}>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              <Plus className="mr-2 h-4 w-4" />
              {t('community.myCommunities.discover')}
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  {t('community.myCommunities.stats.owned')}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {ownedCommunities.length}
                </p>
              </div>
              <Crown className="h-10 w-10 text-gray-400" />
            </div>
          </Card>

          <Card className="border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  {t('community.myCommunities.stats.admin')}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {adminCommunities.length}
                </p>
              </div>
              <Shield className="h-10 w-10 text-gray-400" />
            </div>
          </Card>

          <Card className="border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  {t('community.myCommunities.stats.member')}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {memberCommunities.length}
                </p>
              </div>
              <Users className="h-10 w-10 text-gray-400" />
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('community.myCommunities.searchPlaceholder')}
            className="border-gray-300 bg-white pl-10 text-gray-900 dark:border-gray-800 dark:bg-black dark:text-gray-100"
          />
        </div>

        {/* Communities List */}
        <div className="space-y-4">
          {filteredCommunities.length === 0 ? (
            <Card className="border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-black">
              <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                {searchQuery
                  ? t('community.myCommunities.emptyFilteredTitle')
                  : t('community.myCommunities.emptyTitle')}
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? t('community.myCommunities.emptyFilteredDescription')
                  : t('community.myCommunities.emptyDescription')}
              </p>
              {!searchQuery && (
                <Link href={`/${language}/user/dashboard`}>
                  <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('community.myCommunities.discover')}
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            filteredCommunities.map(community => (
              <CommunityCard key={community.id} community={community} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
