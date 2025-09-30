// components/auth/Register.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../../app/[lang]/(auth)/signup/schema';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/lib/services/auth';
import { toast } from 'sonner';
import { Language } from '@/stores/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, User, Mail, Lock, Github, Check } from 'lucide-react';
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
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
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
      console.log(data);
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

  const onSubmit = async (data: RegisterFormData) => {
    await mutateAsync(data);
  };

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
              {t('auth.register.title', 'Welcome to Level Up')}
            </span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-lg">
            {t('auth.register.subtitle', 'Register to continue your journey')}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">
                      {t('auth.register.username', 'Username')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          placeholder={t(
                            'auth.register.usernamePlaceholder',
                            'Enter your username',
                          )}
                          className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-600 mt-1 font-semibold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">
                      {t('auth.register.email', 'Email')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          type="email"
                          placeholder={t('auth.register.emailPlaceholder', 'you@example.com')}
                          className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-600 mt-1 font-semibold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-300">
                      {t('auth.register.password', 'Password')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t(
                            'auth.register.passwordPlaceholder',
                            'Enter your password',
                          )}
                          className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-600 mt-1 font-semibold" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('auth.register.loading', 'Creating Account...')}
                  </div>
                ) : (
                  t('auth.register.submit', 'Create Account')
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
                  onClick={() => handleOAuthRegister('github')}
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
              <ErrorMessages
                errors={
                  form.formState.errors.root?.message ? [form.formState.errors.root.message] : []
                }
              />
              {form.formState.isSubmitSuccessful && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-xl bg-green-600/20 border border-green-500/30 p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/30">
                      <Check className="h-5 w-5 text-green-300" />
                    </div>
                    <div>
                      <p className="text-green-300 font-semibold">{t('auth.login.success')}</p>
                      <p className="text-green-200 text-sm">
                        {t('auth.login.success-description')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </Form>

          <div className="text-center pt-6 border-t border-slate-700/50 relative z-10">
            <p className="text-sm text-slate-400">
              {t('auth.register.hasAccount', 'Already have an account?')}{' '}
              <Link href={`/${lang}/login`}>{t('auth.register.loginLink', 'Sign in here')}</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
