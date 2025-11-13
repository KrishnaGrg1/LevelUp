// src/app/[lang]/(home)/layout.tsx
'use client';

import React from 'react';
import { AuthContext } from '@/components/providers/AuthContext';
// import ClientOnly from '@/components/ClientOnly';
// import ParticleBackground from '@/components/ParticleBackground';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext>
      <div className="min-h-screen  overflow-x-hidden relative">
        {/* Particle background - only render on client side */}
        {/* <ClientOnly>
          <ParticleBackground />
        </ClientOnly> */}

        {/* Background Effects */}
        {/* <div className="absolute inset-0 bg-gradient-radial from-indigo-500/15 via-transparent to-transparent"></div> */}
        {/* <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div> */}
        {/* <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div> */}

        {/* Main content */}
        <div className="relative z-10">{children}</div>
      </div>
    </AuthContext>
  );
}
