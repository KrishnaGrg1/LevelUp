/**
 * SocketProvider Component
 *
 * Purpose: Global socket connection manager
 * Responsibility: Connect/disconnect socket based on authentication state
 *
 * Flow:
 * 1. User logs in → isAuthenticated becomes true
 * 2. Provider connects socket with auth token
 * 3. Socket remains connected during session
 * 4. User logs out → disconnects socket
 */

'use client';

import { connectSocket, disconnectSocket } from '@/lib/services/socket';
import authStore from '@/stores/useAuth';
import { useEffect } from 'react';

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { isAuthenticated, user } = authStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');

      // Connect socket with authentication
      connectSocket(token || undefined, user.id);
      console.log('✅ Socket connected for user:', user.id);
    } else {
      // Disconnect when user logs out
      disconnectSocket();
    }

    // Only disconnect on unmount when user is not authenticated
    return () => {
      if (!isAuthenticated) {
        disconnectSocket();
      }
    };
  }, [isAuthenticated, user]);

  return <>{children}</>;
}
