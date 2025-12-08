'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, MoreVertical, Users, Shield as ShieldIcon, Loader2 } from 'lucide-react';

import { MessengerChatContainer } from './MessengerChatContainer';
import { ClanAccessDenied } from './ClanAccessDenied';
import { toast } from 'sonner';
import authStore from '@/stores/useAuth';
import { useMessages } from '@/hooks/useMessages';

interface MessageAreaProps {
  communityId?: string;
  clanId?: string;
  viewType: 'community' | 'clan';
  viewName: string;
  memberCount: number;
  isPrivate?: boolean;
  onJoinClick?: () => void;
  onRequestJoinClick?: () => void;
}

export default function MessageArea({
  communityId,
  clanId,
  viewType,
  viewName,
  memberCount,
  isPrivate = false,
}: MessageAreaProps) {
  const { user } = authStore();
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

    if (!messageInput.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to send messages');
      return;
    }

    sendMessage(messageInput);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If clan access is denied, show access denied screen
  if (viewType === 'clan' && accessDenied) {
    return <ClanAccessDenied clanName={viewName} accessDeniedCode={accessDeniedCode} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              viewType === 'community'
                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                : isPrivate
                  ? 'bg-purple-500'
                  : 'bg-red-500'
            }`}
          >
            <ShieldIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{viewName}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{memberCount} members</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages - Messenger-style chat container */}
      <MessengerChatContainer
        messages={messages}
        hasMore={hasMore}
        loadMore={loadMore}
        isLoading={isLoading}
      />

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>

          <div className="flex-1">
            <Input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSending || !isMember}
              className="h-11 text-sm"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            className="h-11 w-11 rounded-full bg-blue-600 hover:bg-blue-700"
            disabled={!messageInput.trim() || isSending || !isMember}
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
