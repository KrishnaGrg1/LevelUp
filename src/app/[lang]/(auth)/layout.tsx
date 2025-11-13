'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import useLanguage from '@/stores/useLanguage';
import authStore from '@/stores/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/lib/services/user';
// import ClientOnly from '@/components/ClientOnly';
// import ParticleBackground from '@/components/ParticleBackground';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const router = useRouter();
  const { isAuthenticated, _hasHydrated, setUser, isAdmin } = authStore();

  // Fetch user data (only if authenticated and hydrated)
  const { data, isLoading } = useQuery({
    queryKey: ['me', language],
    queryFn: () => getMe(language),
    enabled: _hasHydrated && isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    // Don't run until Zustand has hydrated from localStorage
    if (!_hasHydrated) return;

    // If user is authenticated and data is loaded, redirect to dashboard
    if (!isLoading && isAuthenticated && data?.body?.data) {
      // Update user in store
      setUser(data.body.data);

      // Redirect based on admin status
      const redirectPath = isAdmin ? `/${language}/admin/dashboard` : `/${language}/user/dashboard`;

      router.push(redirectPath);
    }
  }, [_hasHydrated, isLoading, isAuthenticated, isAdmin, data, language, router, setUser]);

  // Show nothing while hydrating or while authenticated and loading to prevent flash
  if (!_hasHydrated || (isAuthenticated && isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-50" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render auth pages if user is authenticated (will redirect)
  if (isAuthenticated && !isLoading) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen overflow-x-hidden relative">
        {/* Particle background - only render on client side */}
        {/* <ClientOnly>
          <ParticleBackground />
        </ClientOnly> */}

        {/* Top bar and page content */}
        <div className="relative z-10">
          <TopBar language={language} />
          <div className="min-h-screen p-4">{children}</div>
        </div>
      </div>
    </>
  );
}
