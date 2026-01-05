// components/auth/Verify.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import VerifySchema from '@/app/[lang]/(auth)/verify-email/schema';
import { z } from 'zod';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VerifyUser } from '@/lib/services/auth';
import authStore from '@/stores/useAuth';
import { toast } from 'sonner';
import { Language } from '@/stores/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';
import { t } from '@/translations/index';
import LanguageStore from '@/stores/useLanguage';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';

type VerifyFormData = z.infer<typeof VerifySchema>;

interface VerifyFormProps {
  lang: Language;
  otp?: string | null;
  userId?: string | null;
}

export function VerifyForm({ lang, otp, userId }: VerifyFormProps) {
  const { setAuthenticated, setAdminStatus } = authStore();
  const { language } = LanguageStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      otp: otp || '',
      userId: userId || '',
    },
  });

  useEffect(() => {
    if (userId && otp) {
      form.reset({
        userId,
        otp: otp ? otp : undefined,
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
    mutationKey: ['verify'],
    mutationFn: (data: VerifyFormData) => VerifyUser(data, lang),
    onSuccess: data => {
      // Clear any stale cache from previous sessions
      queryClient.clear();
      
      setAuthenticated(true);
      toast.success(data?.body.message || 'Verification Successful');
      setAdminStatus(data?.body.data?.isadmin || false);
      // Redirect based on admin status
      if (data?.body.data?.isadmin) {
        router.push(`/${lang}/admin/dashboard`);
      } else {
        router.push(`/${lang}/user/dashboard`);
      }
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error('Verification failed:', error);
      toast.error(err.message || 'Verification failed');
    },
  });

  const onSubmit = async (data: VerifyFormData) => {
    await mutateAsync(data);
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
          {t('auth.verify.title', 'Verify Your Email')}
        </CardTitle>

        {/* Subtitle */}
        <CardDescription className="text-center text-gray-500 dark:text-gray-400">
          {t('auth.verify.subtitle', 'Enter the 6-digit code we sent to your email')}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden userId field */}
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => <Input type="hidden" {...field} />}
            />

            {/* OTP Input */}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.verify.otp', 'Verification Code')}
                  </FormLabel> */}
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        className="gap-2"
                      >
                        <InputOTPGroup className="gap-2">
                          {Array.from({ length: 6 }).map((_, idx) => (
                            <InputOTPSlot
                              key={idx}
                              index={idx}
                              className="h-12 w-12 border-gray-300 bg-gray-50 text-lg text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage className="mt-2 text-center text-xs text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
              className="h-11 w-full cursor-pointer rounded-lg bg-gray-900 font-medium text-white transition-colors duration-200 hover:bg-gray-800 active:bg-gray-950 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:active:bg-gray-200 dark:disabled:bg-gray-800 dark:disabled:text-gray-500"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white dark:border-gray-900/20 dark:border-t-gray-900" />
                  {t('auth.verify.verifying', 'Verifying...')}
                </div>
              ) : (
                t('auth.verify.submit', 'Verify Email')
              )}
            </Button>

            {/* Back to signup link */}
            <div className="pt-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('auth.verify.didntReceive', "Didn't receive the code?")}{' '}
                <Link
                  href={`/${lang}/signup`}
                  className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
                >
                  {t('auth.verify.resend', 'Resend')}
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
