'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getUserById, updateUser } from '@/lib/services/user';
import LanguageStore from '@/stores/useLanguage';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Save,
  User as UserIcon,
  Mail,
  Shield,
  Star,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import {
  editUserFormData,
  editUserSchema,
} from '@/app/[lang]/(home)/admin/users/[userId]/edit/schema';
import { zodResolver } from '@hookform/resolvers/zod';

interface EditUserFormProps {
  userId: string;
}

export default function EditUserForm({ userId }: EditUserFormProps) {
  const { language } = LanguageStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['user', userId, language],
    queryFn: () => getUserById(language, userId),
    staleTime: 30000,
  });

  const user = data?.body?.data;

  //React Hook Form
  const form = useForm<editUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      UserName: '',
      email: '',
      xp: 0,
      level: 1,
      isVerified: false,
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        UserName: user.UserName,
        email: user.email,
        xp: user.xp,
        level: user.level,
        isVerified: user.isVerified,
      });
    }
  }, [form, user]);

  // Watch all form fields in real-time, so UI (footer cards) updates instantly when user edits the form
  const formData = form.watch();

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: editUserFormData) => updateUser(language, userId, data),
    onSuccess: () => {
      toast.success('User updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update user');
    },
  });

  const handleSubmitForm = (data: editUserFormData) => {
    updateMutation.mutate(data);
  };

  // Loading state
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading user details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-600 dark:text-red-400 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error Loading User
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-gray-400 dark:text-gray-600 text-5xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            User Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The user you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Edit User</h1>
        <p className="text-gray-600 dark:text-gray-400">Update user information and permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="lg:col-span-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4 ring-2 ring-gray-200 dark:ring-gray-700">
                <AvatarImage src={user.profilePicture || undefined} alt={user.UserName} />
                <AvatarFallback className="bg-blue-600 dark:bg-blue-500 text-white text-2xl">
                  {user.UserName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {user.UserName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Joined</span>
                </div>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  {user.isVerified ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                  )}
                  <span className="text-sm">Status</span>
                </div>
                <span
                  className={`text-sm font-medium ${user.isVerified ? 'text-green-600 dark:text-green-500' : 'text-amber-600 dark:text-amber-500'}`}
                >
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-sm">User ID</span>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  {user.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <UserIcon className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  {...form.register('UserName')}
                  className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  placeholder="Enter username"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  placeholder="Enter email"
                />
              </div>

              {/* XP and Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="xp"
                    className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Star className="h-4 w-4" />
                    Experience Points
                  </Label>
                  <Input
                    id="xp"
                    type="number"
                    {...form.register('xp', { valueAsNumber: true })}
                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="level"
                    className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Level
                  </Label>
                  <Input
                    id="level"
                    type="number"
                    {...form.register('level', { valueAsNumber: true })}
                    className="bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    min="1"
                  />
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  <div>
                    <Label
                      htmlFor="verified"
                      className="text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Verification Status
                    </Label>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {form.getValues('isVerified')
                        ? 'User is verified and can access all features'
                        : 'User needs verification to access full features'}
                    </p>
                  </div>
                </div>
                <Switch
                  id="verified"
                  checked={form.getValues('isVerified')}
                  onCheckedChange={checked => form.setValue('isVerified', checked)}
                  className="data-[state=checked]:bg-green-600 dark:data-[state=checked]:bg-green-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                >
                  {updateMutation.isPending ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current XP</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formData.xp ?? user.xp}
                </p>
              </div>
              <Star className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Level</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Level {user.level ?? user.level}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${user.isVerified ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50' : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Account Status</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </p>
              </div>
              {user.isVerified ? (
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
              ) : (
                <XCircle className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
