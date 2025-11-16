'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClanInfo,
  getClanMembers,
  leaveClan,
  deleteClan,
  updateClan,
  type UpdateClanPayload,
} from '@/lib/services/clans';
import LanguageStore from '@/stores/useLanguage';
import { useAuth } from '@/hooks/use-auth';
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
  Edit,
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
  const queryClient = useQueryClient();

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
      toast.success('Successfully left clan');
      router.back();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to leave clan');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteClan(clanId, language),
    onSuccess: () => {
      toast.success('Clan deleted successfully');
      router.back();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete clan');
    },
  });

  const clan = clanData?.body?.data;
  const members = membersData?.body?.data || [];
  const isOwner = user?.id === clan?.ownerId;

  if (isLoadingInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-100 dark:from-gray-900 dark:via-blue-900/30 dark:to-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-600 dark:text-cyan-400" />
        </div>
      </div>
    );
  }

  if (!clan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-100 dark:from-gray-900 dark:via-blue-900/30 dark:to-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-500/20 bg-red-50 dark:bg-red-900/10">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Clan Not Found
              </h3>
              <Button onClick={() => router.back()} variant="outline" className="mt-4">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const memberCount = clan.stats?.memberCount ?? members.length;
  const battlesWon = clan.stats?.battlesWon ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-100 dark:from-gray-900 dark:via-blue-900/30 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Clan Header */}
        <Card
          className={`mb-6 border ${
            clan.isPrivate
              ? 'border-purple-500/30 bg-gradient-to-br from-purple-100/50 to-pink-100/50 dark:from-purple-950/30 dark:to-pink-950/30'
              : 'border-cyan-500/30 bg-gradient-to-br from-cyan-100/50 to-blue-100/50 dark:from-cyan-950/30 dark:to-blue-950/30'
          }`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    clan.isPrivate
                      ? 'bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-600/30 dark:to-pink-600/30 text-purple-700 dark:text-purple-300'
                      : 'bg-gradient-to-br from-cyan-200 to-blue-200 dark:from-cyan-600/30 dark:to-blue-600/30 text-cyan-700 dark:text-cyan-300'
                  }`}
                >
                  {clan.isPrivate ? <Lock className="h-8 w-8" /> : <Globe className="h-8 w-8" />}
                </div>
                <div>
                  <CardTitle className="text-3xl text-gray-900 dark:text-white mb-1">
                    {clan.name}
                  </CardTitle>
                  {clan.slug && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">@{clan.slug}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
                <Trophy className="h-5 w-5" />
                <span className="font-semibold">{clan.xp} XP</span>
              </div>
            </div>

            {clan.description && (
              <p className="text-gray-700 dark:text-gray-300 mt-4">{clan.description}</p>
            )}

            {clan.welcomeMessage && (
              <div className="mt-4 p-3 rounded-lg bg-blue-100/50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-500/20">
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  "{clan.welcomeMessage}"
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Members</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {memberCount}/{clan.limit}
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Victories</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{battlesWon}</p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Owner</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {clan.owner.UserName}
                </p>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Privacy</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {clan.isPrivate ? 'Private' : 'Public'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {!isOwner && (
                <Button
                  onClick={() => leaveMutation.mutate()}
                  disabled={leaveMutation.isPending}
                  variant="outline"
                  className="flex-1 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                >
                  {leaveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4 mr-2" />
                  )}
                  Leave Clan
                </Button>
              )}
              {isOwner && (
                <Button
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  variant="destructive"
                  className="flex-1"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Clan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Members Section */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Users className="h-5 w-5" />
              Members ({members.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingMembers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-600 dark:text-cyan-400" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">No members yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <Card
                    key={member.id}
                    className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.user.profilePicture || undefined} />
                          <AvatarFallback>
                            {member.user.UserName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {member.user.UserName}
                            </p>
                            {member.user.isVerified && (
                              <Shield className="h-4 w-4 text-blue-500 dark:text-blue-400" fill="currentColor" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {member.role}
                            </Badge>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Lvl {member.user.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
