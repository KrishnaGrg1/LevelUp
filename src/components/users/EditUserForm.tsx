'use client';

import React, { useState } from 'react';
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

  // Form state
  const [formData, setFormData] = useState({
    UserName: user?.UserName || '',
    email: user?.email || '',
    xp: user?.xp || 0,
    level: user?.level || 1,
    isVerified: user?.isVerified || false,
  });

  // Update form data when user data loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        UserName: user.UserName || '',
        email: user.email || '',
        xp: user.xp || 0,
        level: user.level || 1,
        isVerified: user.isVerified || false,
      });
    }
  }, [user]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => updateUser(language, userId, data),
    onSuccess: () => {
      toast.success('User updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update user');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Loading state
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading user details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">Error Loading User</h3>
          <p className="text-slate-400 mb-4">
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
          <div className="text-slate-500 text-5xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-white mb-2">User Not Found</h3>
          <p className="text-slate-400 mb-4">The user you're looking for doesn't exist.</p>
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
          className="mb-4 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Edit User
        </h1>
        <p className="text-slate-400">Update user information and permissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="lg:col-span-1 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4 ring-4 ring-indigo-500/20">
                <AvatarImage src={user.profilePhoto || undefined} alt={user.UserName} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl">
                  {user.UserName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-white">{user.UserName}</h3>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Joined</span>
                </div>
                <span className="text-sm text-white">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  {user.isVerified ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-yellow-400" />
                  )}
                  <span className="text-sm">Status</span>
                </div>
                <span
                  className={`text-sm font-medium ${user.isVerified ? 'text-green-400' : 'text-yellow-400'}`}
                >
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-sm">User ID</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{user.id.slice(0, 8)}...</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  value={formData.UserName}
                  onChange={e => handleInputChange('UserName', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white focus:border-indigo-500"
                  placeholder="Enter username"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white focus:border-indigo-500"
                  placeholder="Enter email"
                />
              </div>

              {/* XP and Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="xp" className="text-slate-300 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Experience Points
                  </Label>
                  <Input
                    id="xp"
                    type="number"
                    value={formData.xp}
                    onChange={e => handleInputChange('xp', parseInt(e.target.value) || 0)}
                    className="bg-slate-900/50 border-slate-700 text-white focus:border-indigo-500"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level" className="text-slate-300 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Level
                  </Label>
                  <Input
                    id="level"
                    type="number"
                    value={formData.level}
                    onChange={e => handleInputChange('level', parseInt(e.target.value) || 1)}
                    className="bg-slate-900/50 border-slate-700 text-white focus:border-indigo-500"
                    min="1"
                  />
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-indigo-400" />
                  <div>
                    <Label htmlFor="verified" className="text-slate-300 cursor-pointer">
                      Verification Status
                    </Label>
                    <p className="text-xs text-slate-400">
                      {formData.isVerified
                        ? 'User is verified and can access all features'
                        : 'User needs verification to access full features'}
                    </p>
                  </div>
                </div>
                <Switch
                  id="verified"
                  checked={formData.isVerified}
                  onCheckedChange={checked => handleInputChange('isVerified', checked)}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
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
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
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
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Current XP</p>
                <p className="text-2xl font-bold text-white">{formData.xp.toLocaleString()}</p>
              </div>
              <Star className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Current Level</p>
                <p className="text-2xl font-bold text-white">Level {formData.level}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`bg-gradient-to-br ${formData.isVerified ? 'from-green-500/10 to-green-600/10 border-green-500/20' : 'from-yellow-500/10 to-yellow-600/10 border-yellow-500/20'}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Account Status</p>
                <p className="text-2xl font-bold text-white">
                  {formData.isVerified ? 'Verified' : 'Unverified'}
                </p>
              </div>
              {formData.isVerified ? (
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              ) : (
                <XCircle className="h-8 w-8 text-yellow-400" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
