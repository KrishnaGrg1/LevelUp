'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: 'admin' | 'user';
  fallbackPath?: string;
}

export function RoleGuard({ children, allowedRole, fallbackPath }: RoleGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = authStore();
  const { language } = LanguageStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand to hydrate
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Role-based access check
  useEffect(() => {
    if (!isHydrated) return;

    // Not authenticated
    if (!isAuthenticated) {
      console.log('Not authenticated in RoleGuard, redirecting to login');
      router.push(`/${language}/login`);
      return;
    }

    // Check role permission
    const hasPermission =
      (allowedRole === 'admin' && isAdmin) || (allowedRole === 'user' && !isAdmin);

    if (!hasPermission) {
      const defaultFallback =
        allowedRole === 'admin' ? `/${language}/user/dashboard` : `/${language}/admin/dashboard`;
      const redirectPath = fallbackPath || defaultFallback;

      console.log(`User doesn't have ${allowedRole} permission, redirecting to ${redirectPath}`);
      router.push(redirectPath);
      return;
    }
  }, [isHydrated, isAuthenticated, isAdmin, allowedRole, router, language, fallbackPath]);

  // Show loading state while checking
  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white overflow-x-hidden relative flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-indigo-500/15 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

        {/* Loading spinner */}
        <div className="text-center space-y-4 relative z-10">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if user has permission
  const hasPermission =
    (allowedRole === 'admin' && isAdmin) || (allowedRole === 'user' && !isAdmin);

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-black text-white overflow-x-hidden relative flex items-center justify-center">
        <div className="text-center space-y-4 relative z-10">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
