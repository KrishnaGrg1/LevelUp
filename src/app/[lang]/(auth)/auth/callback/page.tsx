// app/[lang]/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import LanguageStore from '@/stores/useLanguage';
import authStore from '@/stores/useAuth';
import { oauthRegisterUser } from '@/lib/services/auth';
import { t } from '@/translations/index';
import { useMutation } from '@tanstack/react-query';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthenticated, setAdminStatus } = authStore();
  const { language } = LanguageStore();

  const {
    mutate: handleOAuth,
    isPending,
    isError,
  } = useMutation({
    mutationKey: ['oauth-callback'],
    mutationFn: async () => {
      const code = searchParams.get('code');
      const stateParam = searchParams.get('state');
      const error = searchParams.get('error');

      // Handle OAuth errors from provider
      if (error) {
        const errorMessages: { [key: string]: string } = {
          access_denied: t('error.auth.oauth_access_denied', 'Access denied by user'),
          invalid_request: t('error.auth.oauth_invalid_request', 'Invalid OAuth request'),
          invalid_grant: t(
            'error.auth.oauth_invalid_grant',
            'Authorization expired. Please try again.',
          ),
          server_error: t('error.auth.oauth_server_error', 'OAuth server error'),
        };

        throw new Error(errorMessages[error] || `OAuth error: ${error}`);
      }

      if (!code || !stateParam) {
        throw new Error(
          t('error.auth.oauth_missing_params', 'Missing authorization code or state'),
        );
      }

      // Parse state to get provider, language, and intent
      const parsedState = JSON.parse(decodeURIComponent(stateParam));
      const { provider, lang, intent } = parsedState;

      if (!provider) {
        throw new Error(t('error.auth.oauth_missing_provider', 'Missing provider in state'));
      }

      // Build dynamic redirect URI
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const dynamicRedirectUri = `${baseUrl}/${lang}/auth/callback`;

      // Exchange code for tokens and login/register
      const response = await oauthRegisterUser(
        {
          provider,
          code,
          redirectUri: dynamicRedirectUri,
        },
        lang,
      );

      if (!response?.body?.data) {
        throw new Error(t('error.auth.oauth_no_response', 'No response from server'));
      }

      return { response, provider, intent, lang };
    },
    onSuccess: ({ response, provider, intent, lang }) => {
      // Set user in store and mark as authenticated
      setAuthenticated(true);

      // Set admin status from OAuth response
      const isAdmin = response?.body?.data?.isadmin || false;
      setAdminStatus(isAdmin);

      // Show appropriate success message based on intent
      if (intent === 'register') {
        toast.success(
          t('success.auth.oauth_login_existing', `Welcome back! Logged in with ${provider}.`),
        );
      } else {
        toast.success(t('success.auth.oauth_login', 'Successfully logged in!'));
      }

      // Get redirect destination
      const redirectAfterAuth = sessionStorage.getItem('redirectAfterAuth');
      const authIntent = sessionStorage.getItem('authIntent');

      // Clean up session storage
      sessionStorage.removeItem('redirectAfterAuth');
      sessionStorage.removeItem('authIntent');

      // Determine redirect destination based on admin status
      let redirectTo = `/${lang}/user/dashboard`;

      if (redirectAfterAuth) {
        redirectTo = redirectAfterAuth;
      } else if (authIntent === 'register') {
        redirectTo = `/${lang}/onboarding`;
      } else if (isAdmin) {
        redirectTo = `/${lang}/admin/dashboard`;
      }

      // Redirect immediately
      router.push(redirectTo);
    },
    onError: (error: Error) => {
      console.error('OAuth callback error:', error);
      const errorMessage = error.message || 'OAuth authentication failed';

      toast.error(t('error.auth.oauth_failed', errorMessage));

      // Redirect to appropriate page after error
      setTimeout(() => {
        const authIntent = sessionStorage.getItem('authIntent');
        const redirectTo = authIntent === 'register' ? `/${language}/signup` : `/${language}/login`;
        router.push(redirectTo);
      }, 1000);
    },
  });

  useEffect(() => {
    handleOAuth();
  }, [handleOAuth]);

  // Only show loading state or error state
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-sm">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              {t('auth.oauth.processing', 'Completing authentication...')}
            </h2>
            <p className="text-slate-400">
              {t('auth.oauth.wait', 'Please wait while we sign you in.')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State - only show briefly before redirect
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-sm">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="relative">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-red-500">
              <div className="w-10 h-10 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">
              {t('auth.oauth.error_title', 'Authentication Failed')}
            </h2>
            <p className="text-slate-400 text-sm">
              {t('auth.oauth.redirecting_error', 'Redirecting to login...')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
