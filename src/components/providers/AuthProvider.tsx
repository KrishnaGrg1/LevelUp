'use client';

import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - Wraps the application with authentication context
 *
 * Usage in layout:
 * ```tsx
 * import { AuthProvider } from '@/components/providers/AuthProvider';
 *
 * export default function ProtectedLayout({ children }) {
 *   return (
 *     <AuthProvider>
 *       {children}
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <AuthContext>{children}</AuthContext>;
}
