'use client';

import React from 'react';
import { RoleGuard } from '@/components/providers/RoleGuard';
import LanguageStore from '@/stores/useLanguage';
import LanguageSwitcherWrapper from '@/components/LanguageSwitcherWrapper';
import { ProfileDropdownMenu } from '@/components/ProfileDropdown';
// import ClientOnly from '@/components/ClientOnly';
// import ParticleBackground from '@/components/ParticleBackground';
import { ModeToggle } from '@/components/toggle';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { language } = LanguageStore();

  return (
    <RoleGuard allowedRole="user">
      <div className="min-h-screen  overflow-x-hidden relative">
        {/* Particle background - only render on client side */}
        {/* <ClientOnly>
          <ParticleBackground />
        </ClientOnly> */}

        {/* <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div> */}

        {/* Main content */}
        <div className="relative z-10">
          {/* User Header */}
          <div className="flex justify-between items-center p-4 border-b ">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3  rounded-full animate-pulse"></div>
              <h1 className="text-xl font-bold ">User Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <LanguageSwitcherWrapper currentLang={language} />
              <ProfileDropdownMenu isadmin={false} />
            </div>
          </div>

          {/* User Navigation */}
          <div className="flex justify-center p-4">
            <nav className="flex gap-6">
              <a
                href={`/${language}/user/dashboard`}
                className="px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-all"
              >
                Dashboard
              </a>
              <a
                href={`/${language}/user/profile`}
                className="px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-all"
              >
                Profile
              </a>
              <a
                href={`/${language}/user/change-password`}
                className="px-4 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-all"
              >
                Change Password
              </a>
            </nav>
          </div>

          <div className="min-h-screen p-4">{children}</div>
        </div>
      </div>
    </RoleGuard>
  );
}
