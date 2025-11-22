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
      //get auth token
      const token = localStorage.getItem('authToken');

      //connect socket with auth token
      connectSocket(token || undefined);
      console.log('✅ Socket connected for user:', user.UserName);
    } else {
      //diconnect when user logs out
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  return <>{children}</>;
}
