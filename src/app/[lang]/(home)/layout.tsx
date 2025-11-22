'use client';

import React from 'react';
import { AuthContext } from '@/components/providers/AuthContext';
import TopBar from '@/components/TopBar';
import useLanguage from '@/stores/useLanguage';
import { SocketProvider } from '@/components/providers/SocketProvider';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  return (
    <AuthContext>
      <SocketProvider>
        <div className="min-h-screen overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">
          {/* Top Navigation */}
          <TopBar language={language} isAuthenticated={true} />

          {/* Main Content Area */}
          <main className="pt-20">{children}</main>
        </div>
      </SocketProvider>
    </AuthContext>
  );
}
