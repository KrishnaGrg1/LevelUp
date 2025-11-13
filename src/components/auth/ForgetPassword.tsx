'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ForgetPasswordSchema from '@/app/[lang]/(auth)/forget-password/schema';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { requestPasswordReset } from '@/lib/services/auth';
import { toast } from 'sonner';
import { Language } from '@/stores/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { t } from '@/translations/index';
import { TranslatedFormMessage } from '@/components/ui/TranslatedFormMessage';
import Link from 'next/link';

type ForgetFormData = z.infer<typeof ForgetPasswordSchema>;

interface ForgetPasswordProps {
  lang: Language;
  onSent?: (email: string) => void;
}

export default function ForgetPassword({ lang, onSent }: ForgetPasswordProps) {
  const form = useForm<ForgetFormData>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: { email: '' },
  });

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationKey: ['auth', 'forgot'],
    mutationFn: (data: ForgetFormData) => requestPasswordReset(data.email, lang),
    onSuccess: res => {
      toast.success(t('success:forgotPassword', res?.message || 'Reset link sent'));
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || t('error:forgotPassword', 'Failed to send reset email'));
    },
  });

  const onSubmit = async (data: ForgetFormData) => {
    const result = await mutateAsync(data);
    if (result && onSent) {
      onSent(data.email);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto relative z-10 border-0  shadow-none">
      <CardHeader className="space-y-3 pb-4 pt-8">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-12 h-12 border-2 border-gray-900 dark:border-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
        </div>

        {/* Title */}
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
          {t('auth.forgetPassword.title', 'Forgot Password?')}
        </CardTitle>

        {/* Subtitle */}
        <CardDescription className="text-center text-gray-500 dark:text-gray-400">
          {t('auth.forgetPassword.subtitle', 'Enter your email to receive a reset link')}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.forgetPassword.email', 'Email')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('auth.forgetPassword.emailPlaceholder', 'you@example.com')}
                      className="h-11 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all duration-200"
                      {...field}
                    />
                  </FormControl>
                  <TranslatedFormMessage className="text-xs text-red-600 dark:text-red-400 mt-1" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting || !form.formState.isValid}
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 active:bg-gray-950 dark:bg-white dark:hover:bg-gray-100 dark:active:bg-gray-200 text-white dark:text-gray-900 disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-800 dark:disabled:text-gray-500 font-medium rounded-lg transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 dark:border-gray-900/20 border-t-white dark:border-t-gray-900 rounded-full animate-spin" />
                  {t('auth.forgetPassword.sending', 'Sending...')}
                </div>
              ) : (
                t('auth.forgetPassword.submit', 'Send reset link')
              )}
            </Button>

            {/* Back to login link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('auth.forgetPassword.rememberPassword', 'Remember your password?')}{' '}
                <Link
                  href={`/${lang}/login`}
                  className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 font-medium underline underline-offset-2"
                >
                  {t('auth.forgetPassword.backToLogin', 'Back to login')}
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
