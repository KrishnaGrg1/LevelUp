'use client';

import React from 'react';
import TopBar from '@/components/TopBar';
import useLanguage from '@/stores/useLanguage';
// import ClientOnly from '@/components/ClientOnly';
// import ParticleBackground from '@/components/ParticleBackground';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  return (
    <>
      <div className="min-h-screen   overflow-x-hidden relative">
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
