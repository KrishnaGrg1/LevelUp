'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Send,
  Paperclip,
  MoreVertical,
  Users,
  Shield as ShieldIcon,
  Loader2,
  Settings,
  UserPlus,
  Bell,
  BellOff,
  LogOut,
  Info,
  Smile,
} from 'lucide-react';

import { MessengerChatContainer } from './MessengerChatContainer';
import { ClanAccessDenied } from './ClanAccessDenied';
import { toast } from 'sonner';
import authStore from '@/stores/useAuth';
import LanguageStore from '@/stores/useLanguage';
import { t } from '@/translations';
import { useMessages } from '@/hooks/useMessages';
import dynamic from 'next/dynamic';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

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
  const { language } = LanguageStore();
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      toast.error(t('community:messageArea.enterMessage', language));
      return;
    }

    if (!user) {
      toast.error(t('community:messageArea.mustBeLoggedIn', language));
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

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    const emoji = emojiObject.emoji;
    const input = inputRef.current;
    
    if (input) {
      const cursorPosition = input.selectionStart || messageInput.length;
      const textBefore = messageInput.substring(0, cursorPosition);
      const textAfter = messageInput.substring(cursorPosition);
      
      setMessageInput(textBefore + emoji + textAfter);
      
      // Set cursor position after emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
      }, 0);
    } else {
      setMessageInput(prev => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // If clan access is denied, show access denied screen
  if (viewType === 'clan' && accessDenied) {
    return <ClanAccessDenied clanName={viewName} accessDeniedCode={accessDeniedCode} />;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-black">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black dark:bg-white">
            <ShieldIcon className="h-6 w-6 text-white dark:text-black" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{viewName}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>
                {memberCount} {t('community:messageArea.members', language)}
              </span>
              {viewType === 'clan' && (
                <>
                  <span className="mx-1 text-gray-300 dark:text-gray-700">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isPrivate ? 'Private' : 'Public'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer">
              <Info className="mr-2 h-4 w-4" />
              {viewType === 'community'
                ? t('community:messageArea.communityInfo', language)
                : t('community:messageArea.clanInfo', language)}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              {t('community:messageArea.settings', language)}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <UserPlus className="mr-2 h-4 w-4" />
              {t('community:messageArea.inviteMembers', language)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              {t('community:messageArea.notifications', language)}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <BellOff className="mr-2 h-4 w-4" />
              {t('community:messageArea.mute', language)}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              {viewType === 'community'
                ? t('community:messageArea.leaveCommunity', language)
                : t('community:messageArea.leaveClan', language)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages - Messenger-style chat container */}
      <MessengerChatContainer
        messages={messages}
        hasMore={hasMore}
        loadMore={loadMore}
        isLoading={isLoading}
        currentUserId={user?.id}
      />

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-4 dark:border-gray-800 dark:from-black dark:to-gray-950">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-11 w-11 rounded-xl text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="relative flex-1">
            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
              <>
                {/* Backdrop for mobile */}
                <div 
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                  onClick={() => setShowEmojiPicker(false)}
                />
                
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-full left-0 mb-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950 overflow-hidden">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      searchDisabled={false}
                      skinTonesDisabled={false}
                      width={350}
                      height={400}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder={t('community:messageArea.typeMessage', language)}
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isSending || !isMember}
                className="h-11 rounded-xl border-gray-200 bg-white pr-12 text-sm shadow-sm transition-all focus:ring-2 focus:ring-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:focus:ring-gray-100"
              />
              
              {/* Emoji button inside input */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg transition-all ${
                  showEmojiPicker 
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                }`}
                disabled={!isMember}
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            size="sm"
            className="h-11 w-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none dark:from-gray-100 dark:to-gray-300 dark:text-gray-900 dark:disabled:from-gray-800 dark:disabled:to-gray-800"
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
