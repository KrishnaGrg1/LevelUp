# Real-Time Socket Communication System Documentation

> **Version:** 1.0  
> **Last Updated:** December 2, 2025  
> **Author:** LevelUp Development Team

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Socket Events Reference](#socket-events-reference)
4. [Message Lifecycle](#message-lifecycle)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Implementation](#frontend-implementation)
7. [Flow Diagrams](#flow-diagrams)
8. [API Integration](#api-integration)
9. [Error Handling](#error-handling)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Overview

### System Purpose

The LevelUp platform implements a real-time messaging system that enables users to:

- Send and receive messages instantly in **Communities** (public/semi-public groups)
- Communicate securely in **Clans** (private, membership-required groups)
- View message history through paginated API calls
- Experience seamless real-time updates via WebSocket connections

### Technology Stack

| Component          | Technology                                   |
| ------------------ | -------------------------------------------- |
| WebSocket Library  | Socket.IO v4.x                               |
| Frontend Framework | React 19 + Next.js 15                        |
| State Management   | React Query (TanStack Query v5)              |
| Backend Protocol   | WebSocket + HTTP Polling Fallback            |
| Transport          | WebSocket (primary), Long Polling (fallback) |

### Key Features

- ✅ Real-time bidirectional communication
- ✅ Room-based messaging (Communities & Clans)
- ✅ Automatic reconnection with exponential backoff
- ✅ Message deduplication
- ✅ Pagination support for message history
- ✅ Membership-based access control (Clans)
- ✅ Optimistic UI updates
- ✅ Cache invalidation on room switching

---

## Architecture

### Layer Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                     Component Layer                          │
│         (MessageArea, CommunityDetail, ClanChat)             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ uses
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   useMessages Hook                           │
│  • Manages message list state                                │
│  • Handles sending/receiving messages                        │
│  • Implements pagination (load more)                         │
│  • Deduplicates incoming messages                            │
│  • Invalidates React Query cache on room change              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ uses internally
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     useRoom Hook                             │
│  • Handles room join/leave lifecycle                         │
│  • Validates membership (for Clans)                          │
│  • Manages room connection state                             │
│  • Handles access denied scenarios                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ uses internally
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    useSocket Hook                            │
│  • Establishes WebSocket connection                          │
│  • Manages connection state (isConnected)                    │
│  • Handles reconnection logic                                │
│  • Authenticates socket with token                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ uses
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Socket.IO Service Layer                         │
│                  (socket.ts)                                 │
│  • Low-level socket operations                               │
│  • Event emitters (join/leave/send)                          │
│  • Event listeners (on/off)                                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ WebSocket Protocol
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend Server                             │
│            (Socket.IO Server + Express)                      │
│  • Validates authentication                                  │
│  • Manages rooms and connections                             │
│  • Persists messages to database                             │
│  • Broadcasts events to room members                         │
└─────────────────────────────────────────────────────────────┘
```

### Separation of Concerns

| Hook            | Responsibility                           | Dependencies |
| --------------- | ---------------------------------------- | ------------ |
| **useSocket**   | Global socket connection lifecycle       | None         |
| **useRoom**     | Room join/leave, membership validation   | useSocket    |
| **useMessages** | Message CRUD, pagination, real-time sync | useRoom      |

---

## Socket Events Reference

### Client → Server Events

| Event Name               | Payload                                    | Description                            |
| ------------------------ | ------------------------------------------ | -------------------------------------- |
| `join-community`         | `{ communityId: string }`                  | Join a community room                  |
| `leave-community`        | `{ communityId: string }`                  | Leave a community room                 |
| `join-clan`              | `{ clanId: string }`                       | Join a clan room (requires membership) |
| `leave-clan`             | `{ clanId: string }`                       | Leave a clan room                      |
| `community:send-message` | `{ communityId: string, content: string }` | Send message to community              |
| `clan:send-message`      | `{ clanId: string, content: string }`      | Send message to clan                   |

### Server → Client Events

| Event Name              | Payload                             | Description                        |
| ----------------------- | ----------------------------------- | ---------------------------------- |
| `connect`               | —                                   | Socket successfully connected      |
| `disconnect`            | `reason: string`                    | Socket disconnected                |
| `community:new-message` | `Message`                           | New message broadcast in community |
| `clan:new-message`      | `Message`                           | New message broadcast in clan      |
| `clan-access-denied`    | `{ code: string, message: string }` | Clan access denied (not a member)  |
| `connect_error`         | `Error`                             | Connection failed                  |
| `reconnect`             | `attemptNumber: number`             | Reconnection successful            |

### Message Object Structure

```typescript
interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  communityId?: string; // Present for community messages
  clanId?: string; // Present for clan messages
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string;
}
```

---

## Message Lifecycle

### Step-by-Step Flow

#### 1. User Joins Room

```
┌─────────────┐
│   User      │
│ navigates   │
│ to room     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Component mounts                         │
│ useMessages({ communityId, type })       │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ useRoom hook initializes                 │
│ - Checks if socket is connected          │
│ - For clans: validates membership via    │
│   API call (checkClanMembership)         │
└──────┬──────────────────────────────────┘
       │
       ├─── Clan & Not Member ───┐
       │                          │
       │                          ▼
       │                   ┌──────────────┐
       │                   │ Access       │
       │                   │ Denied       │
       │                   └──────────────┘
       │
       └─── Member / Community ───┐
                                   │
                                   ▼
                            ┌──────────────────────┐
                            │ socket.emit(         │
                            │  'join-community'    │
                            │ )                    │
                            └──────┬───────────────┘
                                   │
                                   ▼
                            ┌──────────────────────┐
                            │ Backend validates    │
                            │ & adds user to room  │
                            └──────┬───────────────┘
                                   │
                                   ▼
                            ┌──────────────────────┐
                            │ React Query fetches  │
                            │ messages via API     │
                            │ (getCommunityMessages│
                            │  page 1, limit 10)   │
                            └──────┬───────────────┘
                                   │
                                   ▼
                            ┌──────────────────────┐
                            │ Messages displayed   │
                            │ in UI                │
                            └──────────────────────┘
```

#### 2. User Sends Message

```
┌──────────────┐
│ User types   │
│ & clicks send│
└──────┬───────┘
       │
       ▼
┌────────────────────────────────────────┐
│ sendMessage(content)                   │
│ - Validates: content not empty         │
│ - Validates: isJoined = true           │
│ - Validates: isMember = true           │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ socket.emit(                           │
│   'community:send-message',            │
│   { communityId, content }             │
│ )                                      │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ Backend receives event                 │
│ - Validates user authentication        │
│ - Validates room membership            │
│ - Persists message to database         │
│ - Generates message ID                 │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ Backend broadcasts to room:            │
│ socket.to(communityId).emit(           │
│   'community:new-message',             │
│   messageObject                        │
│ )                                      │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ All clients in room receive event      │
│ (including sender)                     │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ useMessages socket listener:           │
│ - Checks if message belongs to room    │
│ - Checks for duplicate (by ID)         │
│ - Appends to messages array            │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ React re-renders with new message      │
│ - Message appears instantly            │
│ - Query cache invalidated              │
└────────────────────────────────────────┘
```

#### 3. Loading More Messages (Pagination)

```
┌──────────────┐
│ User scrolls │
│ to top       │
└──────┬───────┘
       │
       ▼
┌────────────────────────────────────────┐
│ MessengerChatContainer detects scroll  │
│ position < 200px from top              │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ loadMore() called                      │
│ - Checks hasMore = true                │
│ - Increments currentPage               │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ API call:                              │
│ getCommunityMessages(                  │
│   language,                            │
│   communityId,                         │
│   page: 2                              │
│ )                                      │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ Backend returns older messages         │
│ {                                      │
│   messages: Message[],                 │
│   pagination: {                        │
│     hasMore: boolean,                  │
│     total: number                      │
│   }                                    │
│ }                                      │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ Frontend merges messages:              │
│ - Filters out duplicates (by ID)       │
│ - Prepends to existing array           │
│   [...newOlderMessages, ...existing]   │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ UI updates with older messages         │
│ Scroll position preserved              │
└────────────────────────────────────────┘
```

#### 4. User Switches Rooms

```
┌──────────────┐
│ User clicks  │
│ different    │
│ community    │
└──────┬───────┘
       │
       ▼
┌────────────────────────────────────────┐
│ Component detects roomKey change       │
│ roomKey: "community-ABC" → "clan-XYZ"  │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ Cleanup previous room:                 │
│ - socket.emit('leave-community')       │
│ - socket.off('community:new-message')  │
│ - Clear messages array                 │
│ - Reset pagination (page = 1)          │
│ - hasInitialized = false               │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ React Query cache invalidated:         │
│ queryClient.invalidateQueries({        │
│   queryKey: ['community-messages',     │
│             language, oldId, page]     │
│ })                                     │
└──────┬─────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────┐
│ Join new room (repeat join flow)       │
│ - useRoom validates membership         │
│ - socket.emit('join-clan')             │
│ - Fetch messages from API              │
│ - Setup socket listeners               │
└────────────────────────────────────────┘
```

---

## Backend Implementation

### Socket.IO Server Setup

```javascript
// server.js (Backend)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    socket.userName = decoded.userName;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', socket => {
  console.log(`✅ User connected: ${socket.userId}`);

  // Community Events
  socket.on('join-community', async ({ communityId }) => {
    try {
      // Validate community exists
      const community = await db.community.findById(communityId);
      if (!community) {
        socket.emit('error', { message: 'Community not found' });
        return;
      }

      // Join the room
      socket.join(`community:${communityId}`);
      console.log(`User ${socket.userId} joined community ${communityId}`);

      // Notify room
      socket.to(`community:${communityId}`).emit('user-joined', {
        userId: socket.userId,
        userName: socket.userName,
      });
    } catch (error) {
      console.error('Join community error:', error);
      socket.emit('error', { message: 'Failed to join community' });
    }
  });

  socket.on('leave-community', ({ communityId }) => {
    socket.leave(`community:${communityId}`);
    console.log(`User ${socket.userId} left community ${communityId}`);
  });

  socket.on('community:send-message', async ({ communityId, content }) => {
    try {
      // Validate user is in room
      const rooms = Array.from(socket.rooms);
      if (!rooms.includes(`community:${communityId}`)) {
        socket.emit('error', { message: 'Not in community' });
        return;
      }

      // Persist to database
      const message = await db.message.create({
        content,
        userId: socket.userId,
        communityId,
        createdAt: new Date(),
      });

      // Populate user info
      const populatedMessage = await db.message
        .findById(message.id)
        .populate('user', 'name avatar');

      // Broadcast to room (including sender)
      io.to(`community:${communityId}`).emit('community:new-message', {
        id: populatedMessage.id,
        content: populatedMessage.content,
        userId: populatedMessage.userId,
        userName: populatedMessage.user.name,
        userAvatar: populatedMessage.user.avatar,
        communityId: populatedMessage.communityId,
        createdAt: populatedMessage.createdAt.toISOString(),
      });

      console.log(`✅ Message sent to community ${communityId}`);
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Clan Events
  socket.on('join-clan', async ({ clanId }) => {
    try {
      // Verify membership
      const membership = await db.clanMembership.findOne({
        userId: socket.userId,
        clanId: clanId,
      });

      if (!membership) {
        socket.emit('clan-access-denied', {
          code: 'NOT_MEMBER',
          message: 'You are not a member of this clan',
        });
        return;
      }

      // Join the room
      socket.join(`clan:${clanId}`);
      console.log(`User ${socket.userId} joined clan ${clanId}`);

      // Notify room
      socket.to(`clan:${clanId}`).emit('user-joined', {
        userId: socket.userId,
        userName: socket.userName,
      });
    } catch (error) {
      console.error('Join clan error:', error);
      socket.emit('clan-access-denied', {
        code: 'ERROR',
        message: 'Failed to join clan',
      });
    }
  });

  socket.on('leave-clan', ({ clanId }) => {
    socket.leave(`clan:${clanId}`);
    console.log(`User ${socket.userId} left clan ${clanId}`);
  });

  socket.on('clan:send-message', async ({ clanId, content }) => {
    try {
      // Validate user is in room
      const rooms = Array.from(socket.rooms);
      if (!rooms.includes(`clan:${clanId}`)) {
        socket.emit('error', { message: 'Not in clan' });
        return;
      }

      // Persist to database
      const message = await db.message.create({
        content,
        userId: socket.userId,
        clanId,
        createdAt: new Date(),
      });

      // Populate user info
      const populatedMessage = await db.message
        .findById(message.id)
        .populate('user', 'name avatar');

      // Broadcast to room
      io.to(`clan:${clanId}`).emit('clan:new-message', {
        id: populatedMessage.id,
        content: populatedMessage.content,
        userId: populatedMessage.userId,
        userName: populatedMessage.user.name,
        userAvatar: populatedMessage.user.avatar,
        clanId: populatedMessage.clanId,
        createdAt: populatedMessage.createdAt.toISOString(),
      });

      console.log(`✅ Message sent to clan ${clanId}`);
    } catch (error) {
      console.error('Send clan message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', reason => {
    console.log(`❌ User disconnected: ${socket.userId}, reason: ${reason}`);
  });
});

server.listen(8001, () => {
  console.log('Socket.IO server running on port 8001');
});
```

### Backend Security Validations

| Validation              | When              | Why                             |
| ----------------------- | ----------------- | ------------------------------- |
| JWT Token               | On connection     | Authenticate user               |
| Room Membership (Clans) | On `join-clan`    | Authorization                   |
| User in Room            | On `send-message` | Prevent unauthorized sends      |
| Content Validation      | On `send-message` | Prevent empty/malicious content |
| Rate Limiting           | Per connection    | Prevent spam                    |

---

## Frontend Implementation

### 1. Socket Service Layer (`socket.ts`)

```typescript
// src/lib/services/socket.ts
import { io, Socket } from 'socket.io-client';
import { Message } from '../generated';

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

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const getSocket = (): AuthSocket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
    }) as AuthSocket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Socket Connected:', socket?.id);
    });

    socket.on('disconnect', reason => {
      console.log('❌ Socket Disconnected:', reason);
    });

    socket.on('connect_error', error => {
      console.error('🔴 Connection Error:', error);
    });

    socket.on('reconnect', attemptNumber => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
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
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Community room management
export const joinCommunity = (communityId: string) => {
  const socket = getSocket();
  socket.emit('join-community', { communityId });
};

export const leaveCommunity = (communityId: string) => {
  const socket = getSocket();
  socket.emit('leave-community', { communityId });
};

export const sendCommunityMessage = (communityId: string, content: string) => {
  const socket = getSocket();
  socket.emit('community:send-message', { communityId, content });
};

// Clan room management
export const joinClan = (clanId: string) => {
  const socket = getSocket();
  socket.emit('join-clan', { clanId });
};

export const leaveClan = (clanId: string) => {
  const socket = getSocket();
  socket.emit('leave-clan', { clanId });
};

export const sendClanMessage = (clanId: string, content: string) => {
  const socket = getSocket();
  socket.emit('clan:send-message', { clanId, content });
};

// Message event listeners
export const onCommunityMessage = (callback: (message: Message) => void) => {
  const socket = getSocket();
  socket.on('community:new-message', callback);
};

export const onClanMessage = (callback: (message: Message) => void) => {
  const socket = getSocket();
  socket.on('clan:new-message', callback);
};
```

### 2. Socket Connection Hook (`useSocket.ts`)

```typescript
// src/hooks/useSocket.ts
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

      // Get auth token from local storage
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
```

### 3. Room Management Hook (`useRoom.ts`)

```typescript
// src/hooks/useRoom.ts
import { useEffect, useState, useRef } from 'react';
import {
  getSocket,
  joinClan,
  joinCommunity,
  leaveClan,
  leaveCommunity,
} from '@/lib/services/socket';
import { checkClanMembership } from '@/lib/services/clans';
import { useSocket } from './useSocket';
import authStore from '@/stores/useAuth';

interface UseRoomProps {
  roomId?: string;
  type: 'community' | 'clan';
}

interface RoomState {
  isJoined: boolean;
  isMember: boolean;
  accessDenied: boolean;
  accessDeniedCode?: string;
}

export const useRoom = ({ roomId, type }: UseRoomProps) => {
  const { isConnected } = useSocket();
  const [roomState, setRoomState] = useState<RoomState>({
    isJoined: false,
    isMember: true,
    accessDenied: false,
  });
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!roomId || !isConnected || hasJoinedRef.current) return;

    const socket = getSocket();
    hasJoinedRef.current = true;

    const handleAccessDenied = (data: { code: string; message: string }) => {
      console.error('❌ Room access denied:', data);
      setRoomState({
        isJoined: false,
        isMember: false,
        accessDenied: true,
        accessDeniedCode: data.code,
      });
    };

    // Subscribe to room events
    if (type === 'clan') {
      socket.on('clan-access-denied', handleAccessDenied);
    }

    // Join the room
    const joinRoom = async () => {
      if (type === 'community') {
        joinCommunity(roomId);
        setRoomState(prev => ({ ...prev, isJoined: true }));
      } else {
        // Check clan membership before joining
        const { user } = authStore.getState();
        if (!user?.id) {
          setRoomState({
            isJoined: false,
            isMember: false,
            accessDenied: true,
            accessDeniedCode: 'NOT_AUTHENTICATED',
          });
          return;
        }

        try {
          const membershipCheck = await checkClanMembership(user.id, roomId);
          if (membershipCheck.isMember === false) {
            setRoomState({
              isJoined: false,
              isMember: false,
              accessDenied: true,
              accessDeniedCode: 'NOT_MEMBER',
            });
            return;
          }

          // User is a member, join the clan room
          joinClan(roomId);
          setRoomState(prev => ({ ...prev, isJoined: true, isMember: true }));
        } catch (error) {
          console.error('Failed to check clan membership:', error);
          setRoomState({
            isJoined: false,
            isMember: false,
            accessDenied: true,
            accessDeniedCode: 'MEMBERSHIP_CHECK_FAILED',
          });
        }
      }
    };

    joinRoom();

    return () => {
      if (type === 'clan') {
        socket.off('clan-access-denied', handleAccessDenied);
        leaveClan(roomId);
      } else {
        leaveCommunity(roomId);
      }

      hasJoinedRef.current = false;
      setRoomState({
        isJoined: false,
        isMember: true,
        accessDenied: false,
      });
    };
  }, [roomId, type, isConnected]);

  return {
    ...roomState,
  };
};
```

### 4. Messaging Hook (`useMessages.ts`)

```typescript
// src/hooks/useMessages.ts
import { Message } from '@/lib/generated';
import { getClanMessages, getCommunityMessages } from '@/lib/services/message';
import {
  getSocket,
  onClanMessage,
  onCommunityMessage,
  sendClanMessage,
  sendCommunityMessage,
} from '@/lib/services/socket';
import LanguageStore from '@/stores/useLanguage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useRoom } from './useRoom';

interface UseMessagesProps {
  communityId?: string;
  clanId?: string;
  type: 'community' | 'clan';
}

export const useMessages = ({ communityId, clanId, type }: UseMessagesProps) => {
  const { language } = LanguageStore();
  const targetId = type === 'community' ? communityId : clanId;

  // Use room hook for room management
  const { isJoined, isMember, accessDenied, accessDeniedCode } = useRoom({
    roomId: targetId,
    type,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const hasInitializedRef = useRef(false);
  const queryClient = useQueryClient();

  // Create unique room key for tracking
  const roomKey = `${type}-${targetId}`;
  const previousRoomKeyRef = useRef<string | null>(null);

  const queryKey =
    type === 'community'
      ? ['community-messages', language, communityId, currentPage]
      : ['clan-messages', language, clanId, currentPage];

  // Fetch paginated messages from API
  const { data: initialMessages, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!targetId) return { messages: [], pagination: { hasMore: false } };

      let result;
      if (type === 'community') {
        result = await getCommunityMessages(language, targetId, currentPage);
      } else {
        result = await getClanMessages(language, targetId, currentPage);
      }

      console.log(
        `📡 API fetched ${result.messages?.length || 0} messages for ${roomKey} (page ${currentPage})`,
      );
      return result;
    },
    enabled: !!targetId,
    staleTime: 0, // Always refetch on room change
    gcTime: 0, // Don't cache between room switches
  });

  // Reset state when switching rooms (using unique room key)
  useEffect(() => {
    if (previousRoomKeyRef.current !== roomKey) {
      console.log(`🔄 Room changed: ${previousRoomKeyRef.current} → ${roomKey}`);
      hasInitializedRef.current = false;

      // Reset local state
      setMessages([]);
      setCurrentPage(1);

      // Invalidate query cache for this room to force fresh fetch
      queryClient.invalidateQueries({ queryKey });
      previousRoomKeyRef.current = roomKey;
    }
  }, [roomKey, queryClient, queryKey]);

  // Initialize messages from API (with room key tracking)
  useEffect(() => {
    if (!initialMessages?.messages) return;
    if (hasInitializedRef.current) return;

    if (initialMessages.messages.length > 0) {
      console.log(
        `📡 Initializing ${roomKey} with ${initialMessages.messages.length} messages from API`,
      );
      setMessages(initialMessages.messages);
      hasInitializedRef.current = true;
    } else {
      // Even if no messages, mark as initialized to prevent re-fetching
      console.log(`📡 No messages for ${roomKey}, marking as initialized`);
      hasInitializedRef.current = true;
    }
  }, [initialMessages, roomKey]);

  // Load more messages (pagination)
  const loadMore = useCallback(async () => {
    if (!targetId || !initialMessages?.pagination?.hasMore) return;

    const nextPage = currentPage + 1;

    try {
      console.log(`📡 Loading page ${nextPage} for ${roomKey}`);

      const more =
        type === 'community'
          ? await getCommunityMessages(language, targetId, nextPage)
          : await getClanMessages(language, targetId, nextPage);

      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const newMessages = more.messages.filter(m => !existingIds.has(m.id));
        console.log(
          `📡 Loaded ${newMessages.length} more messages for ${roomKey}. Total: ${prev.length + newMessages.length}`,
        );
        return [...newMessages, ...prev];
      });
      setCurrentPage(nextPage);
    } catch (error) {
      console.error(`Failed to load more messages for ${roomKey}:`, error);
      toast.error('Failed to load more messages');
    }
  }, [targetId, initialMessages?.pagination?.hasMore, currentPage, type, language, roomKey]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!targetId || !isJoined) {
      console.log(`⏸️ Socket listener paused for ${roomKey} (joined: ${isJoined})`);
      return;
    }

    console.log(`🔌 Setting up socket listener for ${roomKey}`);
    const socket = getSocket();

    const handleMessage = (message: Message) => {
      const belongs =
        type === 'community' ? message.communityId === targetId : message.clanId === targetId;

      if (!belongs) {
        console.log(`🔌 Message ignored: doesn't belong to ${roomKey}`);
        return;
      }

      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) {
          console.log(`🔌 Duplicate message for ${roomKey}, skipping`);
          return prev;
        }
        console.log(`🔌 New message received for ${roomKey}. Total: ${prev.length + 1}`);
        return [...prev, message];
      });
    };

    if (type === 'community') {
      onCommunityMessage(handleMessage);
    } else {
      onClanMessage(handleMessage);
    }

    return () => {
      console.log(`🔌 Cleaning up socket listener for ${roomKey}`);
      socket.off(type === 'community' ? 'community:new-message' : 'clan:new-message');
    };
  }, [targetId, type, isJoined, roomKey]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!targetId) throw new Error('No target ID');

      console.log(`📤 Sending message to ${roomKey}:`, content);

      if (type === 'community') {
        sendCommunityMessage(targetId, content);
      } else {
        sendClanMessage(targetId, content);
      }

      return Promise.resolve({ success: true });
    },

    onSuccess: () => {
      console.log(`✅ Message sent successfully to ${roomKey}`);
      queryClient.invalidateQueries({ queryKey });
    },

    onError: error => {
      console.error(`❌ Failed to send message to ${roomKey}:`, error);
      toast.error('Failed to send message');
    },
  });

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return toast.error('Message cannot be empty');
      if (!isJoined) return toast.error('Not connected to room');
      if (!isMember) return toast.error('You are not a member');

      sendMessageMutation.mutate(content);
    },
    [sendMessageMutation, isJoined, isMember],
  );

  return {
    messages,
    sendMessage,
    isLoading,
    isSending: sendMessageMutation.isPending,
    loadMore,
    hasMore: initialMessages?.pagination?.hasMore || false,
    isJoined,
    isMember,
    accessDenied,
    accessDeniedCode,
  };
};
```

### 5. Component Usage

```typescript
// src/components/communities/MessageArea.tsx
'use client';

import React, { useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { MessengerChatContainer } from './MessengerChatContainer';
import { ClanAccessDenied } from './ClanAccessDenied';

interface MessageAreaProps {
  communityId?: string;
  clanId?: string;
  viewType: 'community' | 'clan';
  viewName: string;
}

export default function MessageArea({
  communityId,
  clanId,
  viewType,
  viewName,
}: MessageAreaProps) {
  const [messageInput, setMessageInput] = useState('');

  const {
    messages,
    sendMessage,
    isLoading,
    isSending,
    loadMore,
    hasMore,
    accessDenied,
    accessDeniedCode,
    isMember,
  } = useMessages({
    communityId,
    clanId,
    type: viewType,
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageInput.trim()) return;

    sendMessage(messageInput);
    setMessageInput('');
  };

  // If clan access is denied, show access denied screen
  if (viewType === 'clan' && accessDenied) {
    return <ClanAccessDenied clanName={viewName} accessDeniedCode={accessDeniedCode} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <MessengerChatContainer
        messages={messages}
        hasMore={hasMore}
        loadMore={loadMore}
        isLoading={isLoading}
      />

      {/* Input */}
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          disabled={isSending || !isMember}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={!messageInput.trim() || isSending}>
          Send
        </button>
      </form>
    </div>
  );
}
```

---

## Flow Diagrams

### Complete Message Send Flow Sequence

```
┌────────┐         ┌──────────┐         ┌─────────┐         ┌──────────┐
│ User   │         │ Frontend │         │ Socket  │         │ Backend  │
│        │         │ Component│         │ Service │         │ Server   │
└───┬────┘         └────┬─────┘         └────┬────┘         └────┬─────┘
    │                   │                    │                    │
    │  Types & Clicks   │                    │                    │
    │  "Send"           │                    │                    │
    ├──────────────────>│                    │                    │
    │                   │                    │                    │
    │                   │ sendMessage()      │                    │
    │                   │ validates          │                    │
    │                   ├─┐                  │                    │
    │                   │ │ isJoined?        │                    │
    │                   │ │ isMember?        │                    │
    │                   │ │ content.trim()?  │                    │
    │                   │<┘                  │                    │
    │                   │                    │                    │
    │                   │ emit('community:   │                    │
    │                   │  send-message')    │                    │
    │                   ├───────────────────>│                    │
    │                   │                    │                    │
    │                   │                    │ WebSocket frame    │
    │                   │                    ├───────────────────>│
    │                   │                    │                    │
    │                   │                    │                    │ Validate auth
    │                   │                    │                    │ Check membership
    │                   │                    │                    │ Persist to DB
    │                   │                    │                    ├─┐
    │                   │                    │                    │ │ INSERT INTO
    │                   │                    │                    │ │ messages...
    │                   │                    │                    │<┘
    │                   │                    │                    │
    │                   │                    │ Broadcast to room  │
    │                   │                    │ ('community:new-   │
    │                   │                    │  message')         │
    │                   │                    │<───────────────────┤
    │                   │                    │                    │
    │                   │ Socket event       │                    │
    │                   │ listener fires     │                    │
    │                   │<───────────────────┤                    │
    │                   │                    │                    │
    │                   │ handleMessage()    │                    │
    │                   ├─┐                  │                    │
    │                   │ │ Check belongs?   │                    │
    │                   │ │ Check duplicate? │                    │
    │                   │ │ Add to array     │                    │
    │                   │<┘                  │                    │
    │                   │                    │                    │
    │                   │ React re-render    │                    │
    │  Message appears  │<───────────────────┤                    │
    │<──────────────────┤                    │                    │
    │                   │                    │                    │
```

### Room Switching Flow

```
┌──────────────────┐
│ User clicks new  │
│ community/clan   │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────┐
│ roomKey changes detected   │
│ "community-A" → "clan-B"   │
└────────┬───────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────────┐
│ Cleanup │ │ Query Cache      │
│ Socket  │ │ Invalidation     │
│ Events  │ │                  │
│         │ │ queryClient      │
│ off()   │ │ .invalidate()    │
└────┬────┘ └────┬─────────────┘
     │           │
     └─────┬─────┘
           │
           ▼
┌────────────────────────────┐
│ Reset State                │
│ - messages = []            │
│ - currentPage = 1          │
│ - hasInitialized = false   │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Leave Previous Room        │
│ socket.emit('leave-...')   │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Join New Room              │
│ - Check membership (clan)  │
│ - socket.emit('join-...')  │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Fetch Messages via API     │
│ (React Query)              │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Setup Socket Listeners     │
│ on('new-message')          │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│ Display New Room Messages  │
└────────────────────────────┘
```

---

## API Integration

### API Endpoints

| Endpoint                            | Method | Purpose                              | Returns                            |
| ----------------------------------- | ------ | ------------------------------------ | ---------------------------------- |
| `/api/communities/:id/messages`     | GET    | Fetch community messages (paginated) | `{ messages: [], pagination: {} }` |
| `/api/clans/:id/messages`           | GET    | Fetch clan messages (paginated)      | `{ messages: [], pagination: {} }` |
| `/api/clans/:id/membership/:userId` | GET    | Check clan membership                | `{ isMember: boolean }`            |

### API + Socket Interaction

```
Timeline: Initial Room Load

T=0ms    │ Component mounts
         │ useMessages() called
         │
T=10ms   │ useRoom() runs
         │ - Checks membership (API call for clans)
         │ - Joins room via socket.emit()
         │
T=50ms   │ React Query triggered
         │ - enabled: !!targetId (true after room joined)
         │ - Fetches messages from API
         │
T=150ms  │ API responds with messages
         │ - 10 messages returned (page 1)
         │ - Messages displayed in UI
         │
T=160ms  │ Socket listener active
         │ - Listening for 'community:new-message'
         │ - Ready to receive real-time messages
         │
─────────┴─────────────────────────────────────────────

Timeline: User Sends Message

T=0ms    │ User clicks "Send"
         │
T=1ms    │ socket.emit('community:send-message')
         │
T=2ms    │ Optimistic UI update (optional)
         │
T=50ms   │ Backend receives event
         │ - Validates
         │ - Persists to DB
         │ - Broadcasts to room
         │
T=52ms   │ Socket listener receives event
         │ - 'community:new-message'
         │ - Adds message to state
         │ - React re-renders
         │
T=53ms   │ Message appears in UI
         │
─────────┴─────────────────────────────────────────────
```

### Why Both API and Socket?

| Feature                | API                | Socket            |
| ---------------------- | ------------------ | ----------------- |
| Initial message load   | ✅ Yes             | ❌ No             |
| Pagination (load more) | ✅ Yes             | ❌ No             |
| Real-time new messages | ❌ No              | ✅ Yes            |
| Offline capability     | ✅ Yes (cached)    | ❌ No             |
| Historical data        | ✅ Yes             | ❌ No             |
| Low latency            | ❌ No (~100-300ms) | ✅ Yes (~10-50ms) |

**Strategy:**

- Use **API** for historical data and pagination
- Use **Socket** for real-time new messages
- Merge both sources in frontend state

---

## Error Handling

### Connection Errors

```typescript
// Automatic reconnection
socket.on('connect_error', error => {
  console.error('Connection failed:', error.message);

  // Socket.IO will automatically retry
  // with exponential backoff (1s, 2s, 4s, 8s, 16s)
});

socket.on('reconnect_failed', () => {
  // All reconnection attempts failed
  toast.error('Unable to connect to chat. Please refresh.');
});

socket.on('reconnect', attemptNumber => {
  console.log(`Reconnected after ${attemptNumber} attempts`);
  toast.success('Connection restored');

  // Re-join rooms if needed
  // This is handled automatically by useRoom cleanup/setup
});
```

### Message Send Failures

```typescript
// Frontend: Send with timeout
const sendMessageMutation = useMutation({
  mutationFn: async (content: string) => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Message send timeout'));
      }, 5000);

      socket.emit('community:send-message', { communityId, content });

      // Assume success if no error event within timeout
      clearTimeout(timeout);
      resolve({ success: true });
    });
  },

  onError: error => {
    toast.error('Failed to send message. Please try again.');
    console.error('Send failed:', error);
  },
});
```

### Backend Error Responses

```javascript
// Backend: Emit error events
socket.on('community:send-message', async ({ communityId, content }) => {
  try {
    // Validation
    if (!content || content.trim().length === 0) {
      socket.emit('error', {
        code: 'EMPTY_MESSAGE',
        message: 'Message cannot be empty',
      });
      return;
    }

    if (content.length > 1000) {
      socket.emit('error', {
        code: 'MESSAGE_TOO_LONG',
        message: 'Message exceeds 1000 characters',
      });
      return;
    }

    // ... persist and broadcast
  } catch (error) {
    socket.emit('error', {
      code: 'SERVER_ERROR',
      message: 'Failed to send message',
    });
  }
});

// Frontend: Listen for errors
socket.on('error', data => {
  console.error('Socket error:', data);
  toast.error(data.message);
});
```

### Access Denied Handling

```typescript
// Frontend: Handle clan access denied
socket.on('clan-access-denied', (data) => {
  console.error('Access denied:', data);

  setRoomState({
    isJoined: false,
    isMember: false,
    accessDenied: true,
    accessDeniedCode: data.code,
  });
});

// Component renders access denied UI
if (accessDenied) {
  return (
    <ClanAccessDenied
      clanName={viewName}
      accessDeniedCode={accessDeniedCode}
    />
  );
}
```

---

## Best Practices

### 1. **Deduplication**

Always check for duplicate messages before adding to state:

```typescript
setMessages(prev => {
  if (prev.some(m => m.id === message.id)) {
    return prev; // Skip duplicate
  }
  return [...prev, message];
});
```

**Why:** The sender also receives the broadcasted message. Without deduplication, the message would appear twice.

### 2. **Room Cleanup**

Always clean up socket listeners on unmount:

```typescript
useEffect(() => {
  const socket = getSocket();

  socket.on('community:new-message', handleMessage);

  return () => {
    socket.off('community:new-message'); // ✅ Clean up
  };
}, [dependencies]);
```

**Why:** Prevents memory leaks and duplicate listeners.

### 3. **Cache Invalidation**

Invalidate React Query cache when switching rooms:

```typescript
useEffect(() => {
  if (previousRoomKeyRef.current !== roomKey) {
    queryClient.invalidateQueries({ queryKey });
    previousRoomKeyRef.current = roomKey;
  }
}, [roomKey]);
```

**Why:** Ensures fresh data when returning to a room.

### 4. **Membership Pre-Check**

Check membership on the client before joining clan rooms:

```typescript
const membershipCheck = await checkClanMembership(userId, clanId);
if (!membershipCheck.isMember) {
  // Show access denied UI
  return;
}
```

**Why:** Better UX (immediate feedback) and reduced unnecessary socket connections.

### 5. **Optimistic Updates (Optional)**

For better perceived performance, you can add the message to the UI immediately:

```typescript
const sendMessage = (content: string) => {
  // Optimistic update
  const optimisticMessage = {
    id: `temp-${Date.now()}`,
    content,
    userId: user.id,
    userName: user.name,
    createdAt: new Date().toISOString(),
    isPending: true,
  };

  setMessages(prev => [...prev, optimisticMessage]);

  // Emit to socket
  sendCommunityMessage(communityId, content);
};

// When real message arrives, replace temporary one
socket.on('community:new-message', message => {
  setMessages(prev => prev.map(m => (m.isPending && m.content === message.content ? message : m)));
});
```

### 6. **Rate Limiting**

Implement client-side rate limiting for message sends:

```typescript
const lastSendTime = useRef(0);

const sendMessage = (content: string) => {
  const now = Date.now();
  if (now - lastSendTime.current < 1000) {
    toast.error('Please wait before sending another message');
    return;
  }

  lastSendTime.current = now;
  sendMessageMutation.mutate(content);
};
```

### 7. **Authentication Token Refresh**

Handle token expiration:

```typescript
useEffect(() => {
  const refreshToken = async () => {
    const newToken = await refreshAuthToken();

    if (socket) {
      socket.auth.token = newToken;
      socket.disconnect();
      socket.connect(); // Reconnect with new token
    }
  };

  // Refresh every 15 minutes
  const interval = setInterval(refreshToken, 15 * 60 * 1000);

  return () => clearInterval(interval);
}, []);
```

### 8. **Scroll Position Management**

Preserve scroll position when loading more messages:

```typescript
const loadMore = async () => {
  const scrollContainer = messageBoxRef.current;
  const oldScrollHeight = scrollContainer.scrollHeight;

  // Fetch older messages
  const more = await getCommunityMessages(language, targetId, nextPage);

  setMessages(prev => [...more.messages, ...prev]);

  // Restore scroll position
  requestAnimationFrame(() => {
    const newScrollHeight = scrollContainer.scrollHeight;
    scrollContainer.scrollTop = newScrollHeight - oldScrollHeight;
  });
};
```

---

## Troubleshooting

### Common Issues

#### Issue 1: Messages Not Appearing

**Symptoms:** Messages sent but not displayed

**Debugging Steps:**

1. Check browser console for socket connection status
2. Verify `isJoined` and `isMember` are `true`
3. Check if socket listener is set up: look for log "🔌 Setting up socket listener"
4. Verify backend is broadcasting the event
5. Check if message belongs to current room (communityId/clanId match)

**Solution:**

```typescript
// Add debugging logs
console.log('Room state:', { isJoined, isMember, targetId });
console.log('Received message:', message);
console.log('Current messages:', messages);
```

#### Issue 2: Duplicate Messages

**Symptoms:** Same message appears multiple times

**Cause:** Missing deduplication or multiple listeners

**Solution:**

```typescript
// Ensure deduplication
setMessages(prev => {
  if (prev.some(m => m.id === message.id)) {
    return prev;
  }
  return [...prev, message];
});

// Ensure cleanup
useEffect(() => {
  socket.on('community:new-message', handleMessage);

  return () => {
    socket.off('community:new-message'); // Must clean up
  };
}, [dependencies]);
```

#### Issue 3: Old Messages Appearing When Switching Rooms

**Symptoms:** Messages from previous room shown briefly

**Cause:** State not reset or cache not invalidated

**Solution:**

```typescript
useEffect(() => {
  if (previousRoomKeyRef.current !== roomKey) {
    // Reset state immediately
    setMessages([]);
    hasInitializedRef.current = false;

    // Invalidate cache
    queryClient.invalidateQueries({ queryKey });
  }
}, [roomKey]);
```

#### Issue 4: Socket Disconnects Frequently

**Symptoms:** Frequent disconnect/reconnect cycles

**Possible Causes:**

- Network issues
- Token expiration
- Server load balancer timeout
- Backend crashes

**Solution:**

```typescript
// Increase timeout and reconnection attempts
const socket = io(SOCKET_URL, {
  timeout: 30000, // 30 seconds
  reconnectionAttempts: 10, // More attempts
  reconnectionDelay: 2000, // 2 seconds between attempts
});

// Add comprehensive logging
socket.on('disconnect', reason => {
  console.log('Disconnect reason:', reason);

  if (reason === 'io server disconnect') {
    // Server forcibly disconnected
    // Likely token issue - refresh and reconnect
    refreshTokenAndReconnect();
  }
});
```

#### Issue 5: Clan Access Denied but User is Member

**Symptoms:** User is a clan member but gets access denied

**Debugging:**

1. Check API response from `checkClanMembership`
2. Verify userId matches
3. Check backend membership validation

**Solution:**

```typescript
// Add detailed logging
const membershipCheck = await checkClanMembership(user.id, roomId);
console.log('Membership check:', {
  userId: user.id,
  clanId: roomId,
  result: membershipCheck,
});

if (membershipCheck.isMember === false) {
  console.error('Not a member according to API');
  // Show access denied
}
```

### Performance Monitoring

```typescript
// Track message latency
const sendMessage = (content: string) => {
  const startTime = performance.now();

  sendMessageMutation.mutate(content, {
    onSuccess: () => {
      const latency = performance.now() - startTime;
      console.log(`Message sent in ${latency}ms`);

      // Track metrics
      analytics.track('message_sent', { latency });
    },
  });
};
```

---

## Conclusion

This real-time socket communication system provides:

✅ **Scalability** - Room-based messaging isolates traffic  
✅ **Security** - Token-based auth + membership validation  
✅ **Reliability** - Auto-reconnection + fallback to polling  
✅ **Performance** - Real-time updates with minimal latency  
✅ **Maintainability** - Clear separation of concerns  
✅ **User Experience** - Instant message delivery with pagination

The architecture balances **REST API** for historical data with **WebSocket** for real-time updates, providing the best of both worlds.

---

**Document Version:** 1.0  
**Last Review:** December 2, 2025  
**Next Review:** Before deadline(Jan,2026)
