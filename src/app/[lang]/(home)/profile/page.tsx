// src/app/[lang]/(home)/profile/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';

// Change from named export to default export
export default function Profile() {
  const { language } = LanguageStore();
  const { user } = authStore();

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Details</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Username</h3>
            <p className="text-lg">{user?.UserName || 'Not available'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Email</h3>
            <p className="text-lg">{user?.email || 'Not available'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Language</h3>
            <p className="text-lg">{language}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Level</h3>
            <p className="text-lg">{user?.level || 1}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">XP</h3>
            <p className="text-lg">{user?.xp || 0}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Member Since</h3>
            <p className="text-lg">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
