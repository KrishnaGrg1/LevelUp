// components/auth/Register.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import loginSchema from '@/app/[lang]/(auth)/login/schema';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { TranslatedFormMessage } from '@/components/ui/TranslatedFormMessage';

import { useMutation } from '@tanstack/react-query';
import { login } from '@/lib/services/auth';
import authStore from '@/stores/useAuth';
import { toast } from 'sonner';
import { Language } from '@/stores/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, User, Mail, Lock, Github, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { t } from '@/translations/index';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import ErrorMessages from '../ErrorDispaly';
type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  lang: Language;
}

export function LoginForm({ lang }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | null>(null);
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setAuthenticated } = authStore();

  // Add hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationKey: ['login'],
    mutationFn: (data: LoginFormData) => login(data, lang),
    onSuccess: data => {
      setAuthenticated(true);
      toast.success(t('success:login', data?.body.message));
      router.push(`/${lang}/dashboard`);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error('Registration failed:', error);
      const errorMessage = err.message || t('error:unknown', 'Registration failed');
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
      sessionStorage.setItem('redirectAfterAuth', `/${lang}/dashboard`);

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
  const onSubmit = async (data: LoginFormData) => {
    await mutateAsync(data);
  };

  // Prevent hydration mismatch by not rendering form until client-side
  if (!isClient) {
    return (
      <div className="w-full max-w-md">
        <Card className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
          <CardHeader className="relative space-y-4 text-center pb-6 pt-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-black">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Loading...
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-6 px-8 pb-8">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-slate-700/30 rounded-xl"></div>
              <div className="h-12 bg-slate-700/30 rounded-xl"></div>
              <div className="h-12 bg-slate-700/30 rounded-xl"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Card className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl border border-slate-700/30 rounded-3xl shadow-2xl overflow-hidden">
        {/* Card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl"></div>

        <CardHeader className="relative space-y-4 text-center pb-6 pt-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-black">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('auth.login.title')}
            </span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-lg">
            {t('auth.login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6 px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">
                      {t('auth.login.email', 'Email')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          type="email"
                          placeholder={t('auth.login.emailPlaceholder', 'Enter your email')}
                          className="pl-10 h-12 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 rounded-xl"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <TranslatedFormMessage className="text-xs text-red-400 mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">
                      {t('auth.login.password', 'Password')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('auth.login.passwordPlaceholder', 'Enter your password')}
                          className="pl-10 pr-10 h-12 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 rounded-xl"
                          {...field}
                        />
                        <Button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <TranslatedFormMessage className="text-xs text-red-400 mt-1" />
                  </FormItem>
                )}
              />
              <p className="text-sm text-slate-400">
                <Link
                  href={`/${lang}/forget-password`}
                  className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {t('auth.login.forgotPasswordLink', 'Forgot your password?')}
                </Link>
              </p>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 rounded-xl"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('auth.login.submit', 'Logging in...')}
                  </div>
                ) : (
                  t('auth.login.submit', 'Log in')
                )}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOAuthRegister('google')}
                  disabled={isLoading}
                  className="h-12 border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-200 group"
                >
                  {loadingProvider === 'google' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FcGoogle className="mr-2 h-5 w-5" />
                  )}
                  <span className="ml-2 text-sm font-medium">Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  // onClick={() => handleOAuthRegister('github')}
                  disabled={isLoading}
                  className="h-12 border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-200 group"
                >
                  {loadingProvider === 'github' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Github className="mr-2 h-5 w-5" />
                  )}
                  <span className="ml-2 text-sm font-medium">GitHub</span>
                </Button>
              </div>
            </form>
            <ErrorMessages
              errors={
                form.formState.errors.root?.message ? [form.formState.errors.root.message] : []
              }
            />
          </Form>

          <div className="text-center pt-6 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">
              {t('auth.login.noAccount', 'Create an Account?')}{' '}
              <Link
                href={`/${lang}/signup`}
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {t('auth.login.registerLink', 'Register here')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
