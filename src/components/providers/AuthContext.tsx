'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/lib/services/user';
import { toast } from 'sonner';

interface AuthContextProps {
  children: React.ReactNode;
}

export function AuthContext({ children }: AuthContextProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setUser, isAdmin, logout, _hasHydrated } = authStore();
  const { language } = LanguageStore();
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Fetch user data (only if authenticated and hydrated)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['me', language],
    queryFn: () => getMe(language),
    enabled: _hasHydrated && isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    // Don't run until Zustand has hydrated from localStorage
    if (!_hasHydrated) return;

    const isAuthRoute =
      pathname?.includes('/login') ||
      pathname?.includes('/register') ||
      pathname?.includes('/verify') ||
      pathname?.includes('/forgot-password') ||
      pathname?.includes('/reset-password') ||
      pathname?.includes('/auth/callback');

    const isAdminRoute = pathname?.includes('/admin/') || pathname?.endsWith('/admin');
    const isUserRoute = pathname?.includes('/user/') || pathname?.endsWith('/user');

    // Authenticated users
    if (!isLoading && isAuthenticated) {
      // Invalid user data
      if (isError || !data?.body?.data) {
        toast.error('UH! OH, You do not have permissions to see this page.');
        logout();
        router.push(`/${language}/login`);
        return;
      }

      // Update user in store
      setUser(data.body.data);

      // Regular user trying to access admin routes
      if (isAdminRoute && !isAdmin) {
        setIsAuthorized(false);
        toast.error('UH! OH, You do not have permissions to see this page.');
        router.push(`/${language}/user/dashboard`);
        return;
      }

      // Admin trying to access user routes
      if (isUserRoute && isAdmin) {
        setIsAuthorized(false);
        toast.error('Admin users should use the admin panel.');
        router.push(`/${language}/admin/dashboard`);
        return;
      }

      // Redirect from auth pages to dashboard
      if (isAuthRoute) {
        const redirectPath = isAdmin
          ? `/${language}/admin/dashboard`
          : `/${language}/user/dashboard`;
        router.push(redirectPath);
        return;
      }

      setIsAuthorized(true);
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated && !isAuthRoute) {
      setIsAuthorized(false);
      router.push(`/${language}/login`);
      return;
    }

    // Allow auth pages when not authenticated
    if (!isAuthenticated && isAuthRoute) {
      setIsAuthorized(true);
    }
  }, [
    _hasHydrated,
    isLoading,
    isError,
    data,
    isAuthenticated,
    isAdmin,
    pathname,
    router,
    language,
    setUser,
    logout,
  ]);

  // Show nothing while hydrating to prevent flash
  if (!_hasHydrated) {
    return null;
  }

  // Don't render if not authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
