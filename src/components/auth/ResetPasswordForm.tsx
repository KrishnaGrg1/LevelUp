'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ResetPasswordSchema from '@/app/[lang]/(auth)/reset-password/schema';
import { z } from 'zod';
import { useState, useEffect } from 'react';
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

import { useMutation } from '@tanstack/react-query';
import { resetPasswordWithOtp } from '@/lib/services/auth';
import { toast } from 'sonner';
import { Language } from '@/stores/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { t } from '@/translations/index';
import LanguageStore from '@/stores/useLanguage';
import { useRouter } from 'next/navigation';

type ResetFormData = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordFormProps {
  lang: Language;
  otp?: string | null;
  userId?: string | null;
}

export default function ResetPasswordForm({ lang, otp, userId }: ResetPasswordFormProps) {
  const { language } = LanguageStore();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const form = useForm<ResetFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      userId: userId || '',
      otp: otp ? otp : undefined,
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (userId && otp) {
      form.reset({
        userId,
        otp: otp ? otp : undefined,
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [userId, otp, form]);

  // Re-validate form when language changes to update error messages
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      form.trigger();
    }
  }, [language, form]);

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: (data: { userId: string; otp: string; newPassword: string }) =>
      resetPasswordWithOtp(data, lang),
    onSuccess: res => {
      toast.success(res?.message || t('auth.resetPassword.success', 'Password reset successful'));
      // Redirect after a short delay to let user see the success message
      setTimeout(() => {
        router.push(`/${lang}/login`);
      }, 2000);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || t('auth.resetPassword.error', 'Password reset failed'));
    },
  });

  const onSubmit = async (data: ResetFormData) => {
    // Remove confirmPassword before sending to backend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _confirmPassword, ...apiData } = data;
    await mutateAsync(apiData);
  };

  return (
    <Card className="relative z-10 mx-auto w-full max-w-2xl border-0 shadow-none">
      <CardHeader className="space-y-3 pt-8 pb-4">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-gray-900 dark:border-white">
            <Sparkles className="h-6 w-6 text-gray-900 dark:text-white" />
          </div>
        </div>

        {/* Title */}
        <CardTitle className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
          {t('auth.resetPassword.title', 'Reset Password')}
        </CardTitle>

        {/* Subtitle */}
        <CardDescription className="text-center text-gray-500 dark:text-gray-400">
          {t('auth.resetPassword.subtitle', 'Enter your new password')}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Hidden Fields */}
            <FormField
              control={form.control}
              name="userId"
              defaultValue={form.formState.defaultValues?.userId}
              render={({ field }) => <Input type="hidden" {...field} />}
            />

            <FormField
              control={form.control}
              name="otp"
              defaultValue={form.formState.defaultValues?.otp}
              render={({ field }) => <Input type="hidden" {...field} value={field.value || ''} />}
            />

            {/* New Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.resetPassword.newPassword', 'New Password')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        className="h-11 rounded-lg border border-gray-300 bg-gray-50 pr-10 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-white"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="mt-1 text-xs text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.resetPassword.confirmPassword', 'Confirm Password')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        className="h-11 rounded-lg border border-gray-300 bg-gray-50 pr-10 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-white"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="mt-1 text-xs text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting || !form.formState.isValid}
              className="h-11 w-full cursor-pointer rounded-lg bg-gray-900 font-medium text-white transition-colors duration-200 hover:bg-gray-800 active:bg-gray-950 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:active:bg-gray-200 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-gray-900/20 dark:border-t-gray-900" />
                  {t('auth.resetPassword.loading', 'Resetting...')}
                </div>
              ) : (
                t('auth.resetPassword.submit', 'Reset Password')
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
