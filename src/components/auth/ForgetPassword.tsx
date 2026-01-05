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
                      className="h-11 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-white"
                      {...field}
                    />
                  </FormControl>
                  <TranslatedFormMessage className="mt-1 text-xs text-red-600 dark:text-red-400" />
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
                  {t('auth.forgetPassword.sending', 'Sending...')}
                </div>
              ) : (
                t('auth.forgetPassword.submit', 'Send reset link')
              )}
            </Button>

            {/* Back to login link */}
            <div className="pt-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('auth.forgetPassword.rememberPassword', 'Remember your password?')}{' '}
                <Link
                  href={`/${lang}/login`}
                  className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
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
