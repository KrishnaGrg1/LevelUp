'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Paperclip, MoreVertical, Users, Shield as ShieldIcon, Loader2 } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';
import { toast } from 'sonner';
import authStore from '@/stores/useAuth';

interface MessageAreaProps {
  communityId?: string;
  clanId?: string;
  viewType: 'community' | 'clan';
  viewName: string;
  memberCount: number;
  isPrivate?: boolean;
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

  const { messages, sendMessage, isLoading, isSending, loadMore, hasMore } = useMessages({
    communityId,
    clanId,
    type: viewType,
  });

  const messageBoxRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = messageBoxRef.current;
    if (!div) return;

    const handleScroll = () => {
      if (div.scrollTop <= 0 && hasMore) {
        loadMore();
      }
    };

    div.addEventListener('scroll', handleScroll);
    return () => div.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadMore]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

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
      handleSendMessage(e as any);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-6" ref={messageBoxRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <ShieldIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No messages yet
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Be the first to start the conversation!
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map(message => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gray-500 text-white font-semibold">
                    {message.UserName?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {message.UserName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 dark:text-gray-200">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
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
              disabled={isSending}
              className="h-11 text-sm"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            className="h-11 w-11 rounded-full bg-blue-600 hover:bg-blue-700"
            disabled={!messageInput.trim() || isSending}
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
