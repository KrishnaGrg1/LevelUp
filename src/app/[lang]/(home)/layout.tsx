// src/app/[lang]/(home)/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ProfileDropdownMenu } from '@/components/ProfileDropdown';

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = authStore();
  const { language } = LanguageStore();
  const [particles, setParticles] = useState<Particle[]>([]);
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

  // Particle effects
  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined') {
      const arr: Particle[] = [];
      for (let i = 0; i < 30; i++) {
        arr.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
      setParticles(arr);
    }

    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          y: p.y - p.speed,
          opacity: p.y > 0 ? p.opacity : 0,
        })),
      );
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // Show loading state while hydrating or not authenticated
  if (!isHydrated || (isHydrated && !isAuthenticated)) {
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
      {isClient && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {particles.map((particle, index) => (
            <div
              key={index}
              className="absolute w-1 h-1 bg-indigo-400 rounded-full animate-pulse"
              style={{
                left: particle.x,
                top: particle.y,
                opacity: particle.opacity,
                transform: `scale(${particle.size})`,
              }}
            />
          ))}
        </div>
      )}

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
          <LanguageSwitcher currentLang={language} />
          <ProfileDropdownMenu />
        </div>
        <div className="min-h-screen p-4">{children}</div>
      </div>
    </div>
  );
}
