'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import { MailIcon, GlobeIcon, StarIcon, TrendingUpIcon, CalendarIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Profile() {
  const { language } = LanguageStore();
  const { user } = authStore();
  console.log('user', user?.createdAt);
  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="flex flex-col items-center text-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src="https://api.dicebear.com/8.x/thumbs/svg"
              alt={user?.UserName || 'User'}
            />
            <AvatarFallback>{user?.UserName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl font-bold">{user?.UserName || 'Unnamed User'}</CardTitle>
            <CardDescription className="text-muted-foreground">
              Welcome back! Here’s your profile info.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <ProfileField
            icon={<MailIcon size={18} />}
            label="Email"
            value={user?.email || 'Not available'}
          />
          <ProfileField icon={<GlobeIcon size={18} />} label="Language" value={language} />
          <ProfileField
            icon={<StarIcon size={18} />}
            label="Level"
            value={user?.level?.toString() || '1'}
          />
          <ProfileField
            icon={<TrendingUpIcon size={18} />}
            label="XP"
            value={user?.xp?.toString() || '0'}
          />
          <ProfileField
            icon={<CalendarIcon size={18} />}
            label="Member Since"
            value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
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
