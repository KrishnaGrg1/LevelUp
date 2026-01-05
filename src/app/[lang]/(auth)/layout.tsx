'use client';

import React from 'react';
import TopBar from '@/components/TopBar';
import useLanguage from '@/stores/useLanguage';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  return (
    <>
      <div className="relative min-h-screen overflow-x-hidden">
        {/* Top bar and page content */}
        <div className="relative z-10">
          <TopBar language={language} />
          <div className="min-h-screen p-4">{children}</div>
        </div>
      </div>
    </>
  );
}
