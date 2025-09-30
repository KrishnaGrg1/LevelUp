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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { t } from '@/translations';

export default function Profile() {
  const { language } = LanguageStore();
  const { user } = authStore();

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="flex flex-col items-center text-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src="https://api.dicebear.com/8.x/thumbs/svg"
              alt={user?.UserName || t('profile.userFallback')}
            />
            <AvatarFallback>{user?.UserName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl font-bold">
              {user?.UserName || t('profile.unnamedUser')}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('profile.welcomeBack')}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <ProfileField
            icon={<MailIcon size={18} />}
            label={t('profile.email')}
            value={user?.email || t('profile.notAvailable')}
          />
          <ProfileField
            icon={<GlobeIcon size={18} />}
            label={t('profile.language')}
            value={language}
          />
          <ProfileField
            icon={<StarIcon size={18} />}
            label={t('profile.level')}
            value={user?.level?.toString() || '1'}
          />
          <ProfileField
            icon={<TrendingUpIcon size={18} />}
            label={t('profile.xp')}
            value={user?.xp?.toString() || '0'}
          />
          <ProfileField
            icon={<UserRoundSearch size={18} />}
            label={t('profile.username')}
            value={user?.UserName || t('profile.unknown')}
          />
          <ProfileField
            icon={<CalendarIcon size={18} />}
            label={t('profile.memberSince')}
            value={
              user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('profile.na')
            }
          />
        </CardContent>
      </Card>
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
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
