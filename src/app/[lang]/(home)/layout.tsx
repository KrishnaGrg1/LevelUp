// src/app/[lang]/(home)/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import LanguageSwitcherWrapper from '@/components/LanguageSwitcherWrapper';
import { ProfileDropdownMenu } from '@/components/ProfileDropdown';
import { useMutation } from '@tanstack/react-query';
import { getMe } from '@/lib/services/user';
import { toast } from 'sonner';
import { t } from '@/translations';
import ClientOnly from '@/components/ClientOnly';
import ParticleBackground from '@/components/ParticleBackground';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, setUser } = authStore();
  const { language } = LanguageStore();
  const [isClient, setIsClient] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // ← Add hydration state

  // Wait for Zustand hydration to complete
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100); // Short delay to ensure hydration
    return () => clearTimeout(timer);
  }, []);

  // Authentication check - only after hydration
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      router.push(`/${language}/login`);
    }
  }, [isAuthenticated, router, language, isHydrated]); // ← Add isHydrated dependency
  // Set client state
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { mutateAsync: handleGetMe, isPending } = useMutation({
    mutationKey: ['getMe'],
    mutationFn: async () => {
      return await getMe(language); // <- correct signature
    },
    onSuccess: data => {
      setUser(data.body.data);
    },
    onError: (error: unknown) => {
      router.push(`/${language}/login`);
      const err = error as { message?: string };
      toast.error(err.message || t('error:unknown', 'Get details failed'));
    },
  });
  useEffect(() => {
    const fetchUser = async () => {
      await handleGetMe();
    };
    fetchUser();
  }, [handleGetMe]);

  // Show loading state while hydrating or not authenticated
  if (!isHydrated || (isHydrated && !isAuthenticated) || isPending) {
    return (
      <div className="min-h-screen bg-black text-white overflow-x-hidden relative flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-indigo-500/15 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>

        {/* Loading spinner */}
        <div className="text-center space-y-4 relative z-10">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">{!isHydrated ? 'Loading...' : 'Redirecting to login...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Particle background - only render on client side */}
      <ClientOnly>
        <ParticleBackground />
      </ClientOnly>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-indigo-500/15 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: '1s' }}
      ></div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="flex justify-end p-4">
          <LanguageSwitcherWrapper currentLang={language} />
          <ProfileDropdownMenu />
        </div>
        <div className="min-h-screen p-4">{children}</div>
      </div>
    </div>
  );
}
