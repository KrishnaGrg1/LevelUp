import { io, Socket } from 'socket.io-client';
import { Message } from '../generated';
import { devLog } from '@/lib/logger';

interface AuthSocket extends Socket {
  auth: {
    token?: string;
    userId?: string;
  };
  data: {
    userId?: string;
  };
}

let socket: AuthSocket | null = null;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080';

export const getSocket = (): AuthSocket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
    }) as AuthSocket;

    socket.on('connect', () => {
      devLog('✅ Socket Connected:', socket?.id);
    });

    socket.on('disconnect', reason => {
      devLog('❌ Socket Disconnected:', reason);
    });

    socket.on('connect_error', error => {
      console.error('❌ Socket Connection error:', error.message);
    });

    socket.on('reconnect', attemptNumber => {
      devLog('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_error', error => {
      console.error('❌ Socket reconnection error:', error.message);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
    });
  }

  return socket;
};

export const connectSocket = (authToken?: string, userId?: string) => {
  const socket = getSocket();

  if (authToken) {
    socket.auth = { token: authToken };
  }

  if (userId) {
    socket.data = { userId: userId };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    // Don't set socket to null to maintain reference for reconnection
  }
};

export const joinCommunity = (communityId: string) => {
  const socket = getSocket();
  socket.emit('join-community', { communityId });
  devLog('📥 Joined community');
};

export const leaveCommunity = (communityId: string) => {
  const socket = getSocket();
  socket.emit('leave-community', { communityId });
};

export const sendCommunityMessage = (communityId: string, content: string) => {
  const socket = getSocket();
  socket.emit('community:send-message', { communityId, content });
};

export const joinClan = (clanId: string) => {
  const socket = getSocket();
  socket.emit('join-clan', { clanId });
  devLog('📥 Joined clan');
};

export const leaveClan = (clanId: string) => {
  const socket = getSocket();
  socket.emit('leave-clan', { clanId });
};

export const sendClanMessage = (clanId: string, content: string) => {
  const socket = getSocket();
  socket.emit('clan:send-message', { clanId, content });
};

export const onNewMessage = (callback: (message: Message) => void) => {
  const socket = getSocket();
  socket.on('new-message', callback);
};

export const offNewMessage = () => {
  const socket = getSocket();
  socket.off('new-message');
};

export const onCommunityMessage = (callback: (message: Message) => void) => {
  const socket = getSocket();
  socket.on('community:new-message', callback);
};

export const offCommunityMessage = () => {
  const socket = getSocket();
  socket.off('community:new-message');
};

export const onClanMessage = (callback: (message: Message) => void) => {
  const socket = getSocket();
  socket.on('clan:new-message', callback);
};

export const offClanMessage = () => {
  const socket = getSocket();
  socket.off('clan:new-message');
};

export const sendTyping = (roomId: string, isTyping: boolean) => {
  const socket = getSocket();
  socket.emit('typing', { roomId, isTyping });
};

export const onTyping = (
  callback: (data: { userId: string; userName: string; isTyping: boolean }) => void,
) => {
  const socket = getSocket();
  socket.on('user-typing', callback);
};

export const offTyping = () => {
  const socket = getSocket();
  socket.off('user-typing');
};

export const onUserJoined = (callback: (data: { userId: string; userName: string }) => void) => {
  const socket = getSocket();
  socket.on('user-joined', callback);
};

export const onUserLeft = (callback: (data: { userId: string; userName: string }) => void) => {
  const socket = getSocket();
  socket.on('user-left', callback);
};
