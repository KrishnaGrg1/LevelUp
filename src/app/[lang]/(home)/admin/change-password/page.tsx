'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import { Eye, EyeOff, Lock, Loader2, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { changePassword } from '@/lib/services/user';

// Schema for change password form
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const { language } = LanguageStore();
  const { user } = authStore();
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await changePassword(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword,
        },
        language,
      );

      toast.success(response.body?.message || 'Password changed successfully!');
      form.reset();

      // Redirect to profile or dashboard after success
      setTimeout(() => {
        router.push(`/${language}/admin/profile`);
      }, 2000);
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <Sparkles className="h-8 w-8 text-zinc-900 dark:text-zinc-50" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Change Password
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Update your password to keep your account secure
          </p>
        </div>

        {/* Security Info Banner */}
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/10">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Password Security Tips
                </p>
                <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                  <li>• Use at least 8 characters with a mix of letters, numbers, and symbols</li>
                  <li>• Avoid using common words or personal information</li>
                  <li>• Don&apos;t reuse passwords from other accounts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Form Card */}
        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lock className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              Password Settings
            </CardTitle>
            <CardDescription>
              Logged in as{' '}
              <span className="font-medium text-zinc-900 dark:text-zinc-50">{user?.email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Current Password */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Enter your current password"
                            autoComplete="current-password"
                            className="h-11 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-zinc-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-zinc-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                      New Password
                    </span>
                  </div>
                </div>

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
                            autoComplete="new-password"
                            className="h-11 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-zinc-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-zinc-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            className="h-11 pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-zinc-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-zinc-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Warning Message */}
                {form.watch('newPassword') && form.watch('newPassword').length < 8 && (
                  <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/10">
                    <CardContent className="p-3">
                      <div className="flex gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs text-amber-800 dark:text-amber-200">
                          For better security, use at least 8 characters
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 flex-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Additional Help Text */}
        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Having trouble changing your password?{' '}
          <button
            onClick={() => router.push(`/${language}/support`)}
            className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            Contact support
          </button>
        </p>
      </div>
    </div>
  );
}
