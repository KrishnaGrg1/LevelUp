// components/auth/Register.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../../app/[lang]/(auth)/signup/schema';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { TranslatedFormMessage } from '@/components/ui/TranslatedFormMessage';

import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/lib/services/auth';
import { toast } from 'sonner';
import { Language } from '@/stores/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Github, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/translations/index';
import Link from 'next/link';
import ErrorMessages from '../ErrorDispaly';

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  lang: Language;
}

export function RegisterForm({ lang }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationKey: ['register'],
    mutationFn: (data: RegisterFormData) => registerUser(data, lang),
    onSuccess: data => {
      toast.success(data?.body.message);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string; error?: string };
      const errorMessage = err.message || t('error:register', 'Registration failed');
      toast.error(errorMessage);
      form.setError('root', {
        type: 'server',
        message: errorMessage,
      });
    },
  });

  const handleOAuthRegister = async (provider: 'google' | 'github') => {
    try {
      setLoadingProvider(provider);

      // Store intent for post-auth redirect
      sessionStorage.setItem('authIntent', 'register');
      sessionStorage.setItem('redirectAfterAuth', `/${lang}/user/dashboard`);

      // Build dynamic redirect URI based on current language
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

      // Google supports multiple redirect URIs, GitHub doesn't
      const googleRedirectUri = `${baseUrl}/${lang}/auth/callback`;
      const githubRedirectUri = `${baseUrl}/auth/callback`; // Universal for GitHub

      // Generate OAuth URLs with appropriate redirect URI
      const oauthUrls = {
        google:
          `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(googleRedirectUri)}&` +
          `response_type=code&` +
          `scope=${encodeURIComponent('openid email profile')}&` +
          `state=${encodeURIComponent(JSON.stringify({ provider: 'google', lang, intent: 'register' }))}`,

        github:
          `https://github.com/login/oauth/authorize?` +
          `client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&` +
          `redirect_uri=${encodeURIComponent(githubRedirectUri)}&` +
          `scope=${encodeURIComponent('user:email')}&` +
          `state=${encodeURIComponent(JSON.stringify({ provider: 'github', lang, intent: 'register' }))}`,
      };

      // Redirect to OAuth provider
      window.location.href = oauthUrls[provider];
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      toast.error(t(`error.auth.${provider}_oauth_failed`, `${provider} registration failed`));
      setLoadingProvider(null);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
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
          {t('auth.register.title', 'Create your account')}
        </CardTitle>

        {/* Subtitle */}
        <CardDescription className="text-center text-gray-500 dark:text-gray-400">
          {t('auth.register.hasAccount', 'Already have an account?')}{' '}
          <Link
            href={`/${lang}/login`}
            className="font-medium text-gray-900 underline underline-offset-2 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
          >
            {t('auth.register.loginLink', 'Sign in')}
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Social Register Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => handleOAuthRegister('google')}
                disabled={isLoading || loadingProvider !== null}
                className="dark:hover:bg-gray-850 h-11 rounded-lg border border-gray-300 bg-white text-gray-900 transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:active:bg-gray-800 dark:disabled:hover:bg-gray-900"
              >
                {loadingProvider === 'google' ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
                ) : (
                  <>
                    <FcGoogle className="h-5 w-5" />
                    <span className="ml-2 text-sm font-medium">
                      {t('auth.login.loginWithGoogle')}
                    </span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => handleOAuthRegister('github')}
                disabled={isLoading || loadingProvider !== null}
                className="dark:hover:bg-gray-850 h-11 rounded-lg border border-gray-300 bg-white text-gray-900 transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:active:bg-gray-800 dark:disabled:hover:bg-gray-900"
              >
                {loadingProvider === 'github' ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
                ) : (
                  <>
                    <Github className="h-5 w-5" />
                    <span className="ml-2 text-sm font-medium">
                      {t('auth.login.loginWithGitHub')}
                    </span>
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 dark:bg-gray-950 dark:text-gray-400">
                  or
                </span>
              </div>
            </div>

            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.username', 'Username')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('auth.register.usernamePlaceholder', 'johndoe')}
                      className="h-11 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-white"
                      {...field}
                    />
                  </FormControl>
                  <TranslatedFormMessage className="mt-1 text-xs text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.email', 'Email')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('auth.register.emailPlaceholder', 'john.doe@example.com')}
                      className="h-11 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-white"
                      {...field}
                    />
                  </FormControl>
                  <TranslatedFormMessage className="mt-1 text-xs text-red-600 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('auth.register.password', 'Password')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        className="h-11 rounded-lg border border-gray-300 bg-gray-50 pr-10 text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-white"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
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
                  {t('auth.register.loading', 'Creating Account...')}
                </div>
              ) : (
                t('auth.register.submit', 'Create Account')
              )}
            </Button>

            {/* Error Messages */}
            <ErrorMessages
              errors={
                form.formState.errors.root?.message ? [form.formState.errors.root.message] : []
              }
            />

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
              {t('auth.agreeToSignup')}{' '}
              <a
                href="#"
                className="text-gray-900 underline transition-colors duration-200 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
              >
                {t('auth.terms')}
              </a>{' '}
              {t('auth.and')}{' '}
              <a
                href="#"
                className="text-gray-900 underline transition-colors duration-200 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
              >
                {t('auth.privacyPolicy')}
              </a>
              .
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
