'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import LanguageSwitcherWrapper from '@/components/LanguageSwitcherWrapper';
import { ProfileDropdownMenu } from '@/components/ProfileDropdown';
import { t } from '@/translations';
import ClientOnly from '@/components/ClientOnly';
import ParticleBackground from '@/components/ParticleBackground';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = authStore();
  const { language } = LanguageStore();

  // Admin access check
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      console.log('Not admin, redirecting to dashboard');
      router.push(`/${language}/dashboard`);
    }
  }, [isAuthenticated, isAdmin, router, language]);

  // Show loading or redirect if not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white overflow-x-hidden relative flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/15 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-sky-500/20 rounded-full blur-3xl animate-pulse"></div>

        {/* Loading spinner */}
        <div className="text-center space-y-4 relative z-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">
            {!isAuthenticated ? 'Checking authentication...' : 'Checking admin access...'}
          </p>
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

      {/* Background Effects - Blue theme for admin */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/15 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-sky-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-sky-500/15 to-cyan-500/15 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: '1s' }}
      ></div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Admin Header */}
        <div className="flex justify-between items-center p-4 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <h1 className="text-xl font-bold text-blue-400">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcherWrapper currentLang={language} />
            <ProfileDropdownMenu />
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="flex justify-center p-4">
          <nav className="flex gap-6">
            <a
              href={`/${language}/admin/dashboard`}
              className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 transition-all"
            >
              Dashboard
            </a>
            <a
              href={`/${language}/admin/users`}
              className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 transition-all"
            >
              Users
            </a>
          </nav>
        </div>

        <div className="min-h-screen p-4">{children}</div>
      </div>
    </div>
  );
}
