/**
 * useSocket Hook
 *
 * Purpose: Track socket connection state for components
 * Note: Actual connection is managed by SocketProvider at app level
 * This hook only monitors the connection status
 */

import { getSocket } from '@/lib/services/socket';
import { useEffect, useState } from 'react';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    // Listen to connection state changes
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set initial state
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return {
    isConnected,
    socket: getSocket(),
  };
};
