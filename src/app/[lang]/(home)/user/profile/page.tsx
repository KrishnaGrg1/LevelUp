'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import {
  MailIcon,
  GlobeIcon,
  StarIcon,
  TrendingUpIcon,
  CalendarIcon,
  UserRoundSearch,
  Sparkles,
  Trophy,
  Target,
  Edit,
  Crown,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { t } from '@/translations';
import { useState } from 'react';
import UpgradeModal from '@/components/UpgradeModal';

export default function Profile() {
  const { language } = LanguageStore();
  const { user } = authStore();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Calculate XP progress to next level (example: 100 XP per level)
  const currentXP = user?.xp || 0;
  const currentLevel = user?.level || 1;
  const xpProgress = ((currentXP % 100) / 100) * 100;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
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
                    {user?.UserName?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-yellow-400 to-orange-500 dark:border-zinc-900">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
                  <h1 className="font-heading text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    {user?.UserName || t('profile.unnamedUser')}
                  </h1>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  >
                    Level {currentLevel}
                  </Badge>
                </div>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t('profile.welcomeBack')}</p>

                {/* XP Progress Bar */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300">
                      <TrendingUpIcon className="h-4 w-4" />
                      {currentXP % 100} / 100 XP
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {100 - (currentXP % 100)} XP to Level {currentLevel + 1}
                    </span>
                  </div>
                  <Progress value={xpProgress} className="h-2" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" size="sm" className="cursor-pointer gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  size="sm"
                  className="cursor-pointer gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => setIsUpgradeModalOpen(true)}
                >
                  <Crown className="h-4 w-4" />
                  Upgrade Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Modal */}
        <UpgradeModal isOpen={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen} />

        {/* Stats Cards Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Trophy className="h-5 w-5 text-yellow-500" />}
            label="Total XP"
            value={currentXP.toString()}
            bgColor="bg-yellow-50 dark:bg-yellow-900/10"
          />
          <StatCard
            icon={<Target className="h-5 w-5 text-blue-500" />}
            label="Current Level"
            value={currentLevel.toString()}
            bgColor="bg-blue-50 dark:bg-blue-900/10"
          />
          <StatCard
            icon={<StarIcon className="h-5 w-5 text-purple-500" />}
            label="Achievements"
            value="12"
            bgColor="bg-purple-50 dark:bg-purple-900/10"
          />
        </div>

        {/* Profile Details Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Account Information */}
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-xl">
                <UserRoundSearch className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                Account Information
              </CardTitle>
              <CardDescription>Your personal account details</CardDescription>
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
              <CardTitle className="flex items-center gap-2 font-heading text-xl">
                <GlobeIcon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                Preferences
              </CardTitle>
              <CardDescription>Your app settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileField
                icon={<GlobeIcon className="h-4 w-4" />}
                label={t('profile.language')}
                value={language.toUpperCase()}
              />
              <ProfileField
                icon={<StarIcon className="h-4 w-4" />}
                label="Theme"
                value="Auto (System)"
              />
              <ProfileField
                icon={<Target className="h-4 w-4" />}
                label="Notifications"
                value="Enabled"
              />
            </CardContent>
          </Card>
        </div>

        {/* Activity Overview */}
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-xl">
              <TrendingUpIcon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest achievements and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                title="Quest Completed"
                description="Completed 'Getting Started' quest"
                time="2 hours ago"
                icon="✅"
              />
              <ActivityItem
                title="Level Up!"
                description={`Reached Level ${currentLevel}`}
                time="1 day ago"
                icon="🎉"
              />
              <ActivityItem
                title="New Achievement"
                description="Earned 'First Steps' badge"
                time="2 days ago"
                icon="🏆"
              />
              <ActivityItem
                title="Community Joined"
                description="Joined 'Web Developers' community"
                time="3 days ago"
                icon="👥"
              />
            </div>
          </CardContent>
        </Card>
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
            <p className="mt-1 font-heading text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {value}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({
  title,
  description,
  time,
  icon,
}: {
  title: string;
  description: string;
  time: string;
  icon: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xl dark:bg-zinc-800">
        {icon}
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">{time}</p>
      </div>
    </div>
  );
}
