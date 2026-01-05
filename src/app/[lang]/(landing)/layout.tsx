'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LanguageStore from '@/stores/useLanguage';
import { validateLanguage } from '@/lib/language';

interface LandingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}
export default function LandingLayout({ children, params }: LandingLayoutProps) {
  const { language, setLanguage } = LanguageStore();

  useEffect(() => {
    // Get language from params and validate it
    params.then(resolvedParams => {
      const validatedLang = validateLanguage(resolvedParams.lang);
      setLanguage(validatedLang);
    });
  }, [params, setLanguage]);

  return (
    <>
      <div className="min-h-screen overflow-x-hidden bg-black text-white">
        {/* Common Navbar for all landing pages */}
        <Navbar language={language} />

        {/* Page content */}
        <main className="relative">{children}</main>

        {/* Common Footer for all landing pages */}
        <Footer />
      </div>
    </>
  );
}
