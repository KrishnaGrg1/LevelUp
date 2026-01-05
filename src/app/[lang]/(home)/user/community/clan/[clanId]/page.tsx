'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getClanInfo, getClanMembers, leaveClan, deleteClan } from '@/lib/services/clans';
import LanguageStore from '@/stores/useLanguage';
import { useAuth } from '@/hooks/use-auth';
import { t } from '@/translations/index';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Users,
  Trophy,
  Crown,
  LogOut,
  Trash2,
  Lock,
  Globe,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ClanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clanId = params.clanId as string;
  const { language } = LanguageStore();
  const { user } = useAuth(language);

  const { data: clanData, isPending: isLoadingInfo } = useQuery({
    queryKey: ['clan-info', clanId, language],
    queryFn: () => getClanInfo(clanId, language),
    retry: 1,
  });

  const { data: membersData, isPending: isLoadingMembers } = useQuery({
    queryKey: ['clan-members', clanId, language],
    queryFn: () => getClanMembers(clanId, language),
    retry: 1,
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveClan(clanId, language),
    onSuccess: () => {
      toast.success(t('clans.toast.leftSuccess', language));
      router.back();
    },
    onError: (error: Error) => {
      toast.error(error.message || t('clans.toast.leaveFailed', language));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteClan(clanId, language),
    onSuccess: () => {
      toast.success(t('clans.toast.deletedSuccess', language));
      router.back();
    },
    onError: (error: Error) => {
      toast.error(error.message || t('clans.toast.deleteFailed', language));
    },
  });

  const clan = clanData?.body?.data;
  const members = membersData?.body?.data || [];
  const isOwner = user?.id === clan?.ownerId;

  if (isLoadingInfo) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-gray-900 dark:text-gray-100 mx-auto" />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading clan details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!clan) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <Shield className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              {t('clans.clanNotFound', language)}
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">This clan doesn&apos;t exist or has been removed.</p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('clans.goBack', language)}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const memberCount = clan.stats?.memberCount ?? members.length;
  const battlesWon = clan.stats?.battlesWon ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="mb-6 text-sm text-gray-600 dark:text-gray-400"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('clans.back', language)}
      </Button>

      {/* Clan Header */}
      <Card className="mb-4 border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
                {clan.isPrivate ? (
                  <Lock className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                ) : (
                  <Globe className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {clan.name}
                </h1>
                {clan.slug && (
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">@{clan.slug}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-black">
              <Trophy className="h-4 w-4 text-gray-900 dark:text-gray-100" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total XP</p>
                <p className="text-base font-bold text-gray-900 dark:text-white">{clan.xp.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {clan.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{clan.description}</p>
            </div>
          )}

          {clan.welcomeMessage && (
            <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-black">
              <p className="text-xs italic text-gray-600 dark:text-gray-400">
                💬 &quot;{clan.welcomeMessage}&quot;
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-black">
              <div className="mb-1 flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{t('clans.members', language)}</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {memberCount}<span className="text-xs font-normal text-gray-500">/{clan.limit}</span>
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-black">
              <div className="mb-1 flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Trophy className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{t('clans.victories', language)}</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{battlesWon.toLocaleString()}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-black">
              <div className="mb-1 flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Crown className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{t('clans.owner', language)}</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {clan.owner.UserName}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-black">
              <div className="mb-1 flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Shield className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{t('clans.privacy', language)}</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {clan.isPrivate ? t('clans.private', language) : t('clans.public', language)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {!isOwner && (
              <Button
                onClick={() => leaveMutation.mutate()}
                disabled={leaveMutation.isPending}
                variant="outline"
                className="flex-1 text-sm"
              >
                {leaveMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                {t('clans.leaveClan', language)}
              </Button>
            )}
            {isOwner && (
              <Button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                variant="destructive"
                className="flex-1 text-sm"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {t('clans.deleteClan', language)}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Members Section */}
      <Card className="border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-4 w-4 text-gray-900 dark:text-gray-100" />
            {t('clans.members', language)}
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400">({members.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoadingMembers ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-gray-100" />
              <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-3 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('clans.noMembers', language)}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {members.map(member => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-black"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.user.profilePicture || undefined} />
                      <AvatarFallback className="bg-gray-100 text-gray-900 text-sm dark:bg-gray-800 dark:text-gray-100">
                        {member.user.UserName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {member.userId === clan.ownerId && (
                      <div className="absolute -right-1 -top-1 rounded-full bg-amber-400 p-0.5">
                        <Crown className="h-2.5 w-2.5 text-white" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-1">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {member.user.UserName}
                      </p>
                      {member.user.isVerified && (
                        <Shield className="h-3 w-3 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="currentColor" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {member.role}
                      </Badge>
                      <div className="flex items-center gap-0.5 text-xs text-gray-600 dark:text-gray-400">
                        <Trophy className="h-3 w-3" />
                        <span>Lvl {member.user.level}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
