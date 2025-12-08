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

/**
 * Room management hook
 * Responsibility: Handle room join/leave, membership, and recent messages
 */
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
