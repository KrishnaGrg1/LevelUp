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

import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { t } from '@/translations/index';
import LanguageStore from '@/stores/useLanguage';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
      toast.success(res?.message || t('resetPassword.success', 'Password reset successful'));
      // Redirect after a short delay to let user see the success message
      setTimeout(() => {
        router.push(`/${lang}/login`);
      }, 2000);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || t('resetPassword.error', 'Password reset failed'));
    },
  });

  const onSubmit = async (data: ResetFormData) => {
    // Remove confirmPassword before sending to backend
    const { confirmPassword: _confirmPassword, ...apiData } = data;

    console.log('Data being sent to API (without confirmPassword):', apiData);

    await mutateAsync(apiData);
  };

  return (
    <div className="w-full max-w-md">
      <Card className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
        <CardHeader className="relative space-y-2 text-center pb-4 pt-8">
          <CardTitle className="text-2xl font-black">
            {t('auth.resetPassword.title', 'Reset Password')}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {t('auth.resetPassword.subtitle', 'Enter the code and your new password')}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6 px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* New Password */}
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
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">
                      {t('auth.resetPassword.newPassword', 'New Password')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder={t('auth.resetPassword.newPasswordPlaceholder', '••••••••')}
                          autoComplete="new-password"
                          className="h-12 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 rounded-xl"
                          {...field}
                        />
                        <Button
                          type="button"
                          onClick={() => setShowNewPassword(s => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                          aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-400 mt-1" />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">
                      {t('auth.resetPassword.confirmPassword', 'Confirm Password')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder={t(
                            'auth.resetPassword.confirmPasswordPlaceholder',
                            '••••••••',
                          )}
                          autoComplete="new-password"
                          className="h-12 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 rounded-xl"
                          {...field}
                        />
                        <Button
                          type="button"
                          onClick={() => setShowConfirmPassword(s => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-400 mt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('resetPassword.loading', 'Resetting...')}
                  </>
                ) : (
                  t('resetPassword.submit', 'Reset Password')
                )}
              </Button>
            </form>

            {form.formState.isSubmitSuccessful && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center justify-center py-8 space-y-4"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20 border border-green-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>

                {/* Message */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-semibold text-green-400"
                >
                  {t('auth.resetPassword.successTitle', 'Password Reset Successful')}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-slate-400 text-center max-w-xs"
                >
                  {t(
                    'auth.resetPassword.redirectMessage',
                    'You can now log in with your new password. Redirecting to login page...',
                  )}
                </motion.p>
              </motion.div>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
