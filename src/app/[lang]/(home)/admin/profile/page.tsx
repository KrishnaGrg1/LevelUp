'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import {
  MailIcon,
  GlobeIcon,
  StarIcon,
  CalendarIcon,
  UserRoundSearch,
  Trophy,
  Target,
  Edit,
  Shield,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { t } from '@/translations';

export default function Profile() {
  const { language } = LanguageStore();
  const { user } = authStore();

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="container mx-auto max-w-5xl space-y-6">
        {/* Header Card - Profile Overview */}
        <Card className="border-0 shadow-none">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-zinc-200 dark:border-zinc-800">
                  <AvatarImage
                    src="https://api.dicebear.com/8.x/thumbs/svg"
                    alt={user?.UserName || t('profile.userFallback')}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-2xl font-bold text-white">
                    {user?.UserName?.[0]?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-yellow-400 to-orange-500 dark:border-zinc-900">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
                  <h1 className="font-heading text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {user?.UserName || t('profile.unnamedUser')}
                  </h1>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    {t('profile:admin.badge', language)}
                  </Badge>
                </div>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t('profile.welcomeBack')}</p>
              </div>

              {/* Edit Button */}
              <Button variant="outline" size="sm" className="cursor-pointer gap-2">
                <Edit className="h-4 w-4" />
                {t('profile:admin.editProfile', language)}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Trophy className="h-5 w-5 text-yellow-500" />}
            label={t('profile:admin.totalXP', language)}
            value={(user?.xp || 0).toString()}
            bgColor="bg-yellow-50 dark:bg-yellow-900/10"
          />
          <StatCard
            icon={<Target className="h-5 w-5 text-blue-500" />}
            label={t('profile:admin.currentLevel', language)}
            value={(user?.level || 1).toString()}
            bgColor="bg-blue-50 dark:bg-blue-900/10"
          />
          <StatCard
            icon={<Shield className="h-5 w-5 text-purple-500" />}
            label={t('profile:admin.role', language)}
            value={t('profile:admin.administrator', language)}
            bgColor="bg-purple-50 dark:bg-purple-900/10"
          />
        </div>

        {/* Profile Details Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Account Information */}
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2 text-xl">
                <UserRoundSearch className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                {t('profile:admin.accountInfo', language)}
              </CardTitle>
              <CardDescription>{t('profile:admin.accountInfoDesc', language)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileField
                icon={<UserRoundSearch className="h-4 w-4" />}
                label={t('profile.username')}
                value={user?.UserName || t('profile.unknown')}
              />
              <ProfileField
                icon={<MailIcon className="h-4 w-4" />}
                label={t('profile.email')}
                value={user?.email || t('profile.notAvailable')}
              />
              <ProfileField
                icon={<CalendarIcon className="h-4 w-4" />}
                label={t('profile.memberSince')}
                value={
                  user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : t('profile.na')
                }
              />
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2 text-xl">
                <GlobeIcon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                {t('profile:admin.preferences', language)}
              </CardTitle>
              <CardDescription>{t('profile:admin.preferencesDesc', language)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileField
                icon={<GlobeIcon className="h-4 w-4" />}
                label={t('profile.language')}
                value={language.toUpperCase()}
              />
              <ProfileField
                icon={<StarIcon className="h-4 w-4" />}
                label={t('profile:admin.theme', language)}
                value={t('profile:admin.themeAuto', language)}
              />
              <ProfileField
                icon={<Shield className="h-4 w-4" />}
                label={t('profile:admin.accessLevel', language)}
                value={t('profile:admin.fullAdminAccess', language)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-zinc-600 dark:text-zinc-400">{icon}</div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
          <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}) {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bgColor}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</p>
            <p className="font-heading mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
