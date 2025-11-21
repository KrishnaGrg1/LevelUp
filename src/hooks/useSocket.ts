//socket connection

import { connectSocket, disconnectSocket, getSocket } from '@/lib/services/socket';
import authStore from '@/stores/useAuth';
import { useEffect, useState } from 'react';

export const useSocket = () => {
  const { isAuthenticated, user } = authStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsConnecting(true);

      //get auth token from local storage
      const token = localStorage.getItem('authToken');

      const socket = connectSocket(token || '');

      socket.on('connect', () => {
        setIsConnected(true);
        setIsConnecting(false);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      return () => {
        disconnectSocket();
        setIsConnected(false);
        setIsConnecting(false);
      };
    }
  }, [isAuthenticated, user]);

  return {
    isConnected,
    isConnecting,
    socket: getSocket(),
  };
};

/*
This hook handles Socket.IO connection inside React.
Its job is to:

Connect socket only when the user is logged in

Update UI state when socket connects/disconnects

Clean up properly when user logs out or component unmounts

*/
