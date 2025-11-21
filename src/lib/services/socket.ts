import { io, Socket } from 'socket.io-client';
import { Message } from '../generated';

let socket: Socket | null = null;

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
    });

    // Socket connection event handlers
    socket.on('connect', () => {
      console.log('✅ Socket Connected:', socket?.id);
    });

    socket.on('disconnect', reason => {
      console.log('Socket Disconnected:', reason);
    });

    socket.on('connect_error', error => {
      console.log('Socket Connection error', error);
    });
    socket.on('reconnect', attemptNumber => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
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

export const connectSocket = (authToken?: string) => {
  const socket = getSocket();

  if (authToken) {
    socket.auth = { token: authToken };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Community room management
export const joinCommunity = (communityId: string) => {
  const socket = getSocket();

  socket.emit('join-community', { communityId });
  console.log(`📥 Joined community room: ${communityId}`);
};

export const leaveCommunity = (communityId: string) => {
  const socket = getSocket();

  socket.emit('leave-community', { communityId });
  console.log(`Left community room: ${communityId}`);
};

export const sendCommunityMessage = (communityId: string, content: string) => {
  const socket = getSocket();
  socket.emit('community:send-message', { communityId, content });
  console.log('Send Community Message:', { communityId, content });
};

// Clan room management
export const joinClan = (clanId: string) => {
  const socket = getSocket();
  socket.emit('join-clan', { clanId });
  console.log('📥 Joined clan:', clanId);
};

export const leaveClan = (clanId: string) => {
  const socket = getSocket();
  socket.emit('leave-clan', { clanId });
  console.log('📤 Left clan:', clanId);
};

export const sendClanMessage = (clanId: string, content: string) => {
  const socket = getSocket();
  socket.emit('clan:send-message', { clanId, content });
  console.log('📨 Sent clan message:', { clanId, content });
};

// Message event listeners
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

// Typing indicator events
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

// User Presence
export const onUserJoined = (callback: (data: { userId: string; userName: string }) => void) => {
  const socket = getSocket();
  socket.on('user-joined', callback);
};

export const onUserLeft = (callback: (data: { userId: string; userName: string }) => void) => {
  const socket = getSocket();
  socket.on('user-left', callback);
};
