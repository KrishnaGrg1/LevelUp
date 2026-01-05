'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import LanguageStore from '@/stores/useLanguage';
import { getSocket } from '@/lib/services/socket';
import { t } from '@/translations';
import authStore from '@/stores/useAuth';
import { devError, devLog } from '@/lib/logger';
import { fetchAIConfig } from '@/lib/services/ai';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const { language } = LanguageStore();
  const { user, isAuthenticated } = useAuth(language);
  const { setTokens: setUserTokens } = authStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [tokens, setTokens] = useState(50);
  const [costPerMessage, setCostPerMessage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef(`session_${Date.now()}`);

  // Fetch configured token cost so we can show the current price per chat
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchAIConfig(language);
        const configuredCost = config.body.data.ai?.tokenCostPerChat;
        if (typeof configuredCost === 'number' && configuredCost > 0) {
          setCostPerMessage(configuredCost);
        }
      } catch (error) {
        devError('Failed to load AI config for token cost', error as Error);
      }
    };

    loadConfig();
  }, [language]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, streamingResponse]);

  // Use existing socket connection from SocketProvider
  useEffect(() => {
    if (!isAuthenticated || !user) {
      devLog('User not authenticated, skipping AI chat socket setup');
      return;
    }

    // Get the existing socket instance from SocketProvider
    const existingSocket = getSocket();

    // Check if socket exists and is valid
    if (!existingSocket) {
      devError('❌ Socket not initialized yet. Make sure SocketProvider is mounted.');
      toast.error('Connection Error', {
        description: 'Unable to initialize real-time connection. Please refresh the page.',
      });
      return;
    }

    // Connection events
    const handleConnect = () => {
      devLog('✅ AI Chat socket connected:', existingSocket.id);
      setSocket(existingSocket);
      setIsConnected(true);
      existingSocket.emit('ai-chat:check-tokens');
    };

    const handleDisconnect = (reason: string) => {
      devLog('❌ AI Chat socket disconnected:', reason);
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      devError('❌ AI Chat socket connection error:', error.message);
      setIsConnected(false);
      if (error.message === 'timeout') {
        toast.error('Connection Timeout', {
          description: 'Unable to connect to AI service. Please check if the backend is running.',
        });
      }
    };

    // Register event listeners
    existingSocket.on('connect', handleConnect);
    existingSocket.on('disconnect', handleDisconnect);
    existingSocket.on('connect_error', handleConnectError);

    // Check if already connected
    if (existingSocket.connected) {
      devLog('AI chat socket already connected:', existingSocket.id);
      handleConnect();
    } else {
      devLog('Waiting for AI chat socket to connect...');
    }

    // Token status
    existingSocket.on(
      'ai-chat:token-status',
      (data: { hasTokens: boolean; currentTokens: number; costPerMessage?: number }) => {
        setTokens(data.currentTokens);
        setUserTokens(data.currentTokens);
        if (typeof data.costPerMessage === 'number' && data.costPerMessage > 0) {
          setCostPerMessage(data.costPerMessage);
        }
      },
    );

    // Chat start
    existingSocket.on('ai-chat:start', () => {
      setIsLoading(true);
      setStreamingResponse('');
    });

    // Streaming chunks
    existingSocket.on('ai-chat:chunk', (data: { chunk: string; index: number }) => {
      setStreamingResponse(prev => prev + data.chunk);
    });

    // Chat complete
    existingSocket.on(
      'ai-chat:complete',
      (data: {
        sessionId: string;
        response: string;
        tokensUsed: number;
        remainingTokens: number;
        responseTime: number;
      }) => {
        setIsLoading(false);
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
        setTokens(data.remainingTokens);
        setUserTokens(data.remainingTokens);
        setStreamingResponse('');
        toast.success(t('aiChat.success.responseReceived'), {
          description: `${data.tokensUsed} ${t('aiChat.tokens.used')} • ${data.responseTime}ms`,
        });
      },
    );

    // Chat cancelled
    existingSocket.on('ai-chat:cancelled', () => {
      setIsLoading(false);
      setStreamingResponse('');
      toast.info(t('aiChat.success.chatCancelled'));
    });

    // Token balance update
    existingSocket.on('ai-chat:tokens', (data: { tokens: number }) => {
      setTokens(data.tokens);
      setUserTokens(data.tokens);
    });

    // Error handling
    existingSocket.on(
      'ai-chat:error',
      (error: { code: string; message: string; currentTokens?: number }) => {
        setIsLoading(false);
        setStreamingResponse('');

        switch (error.code) {
          case 'INSUFFICIENT_TOKENS':
            toast.error(t('aiChat.tokens.insufficient'), {
              description: t('aiChat.tokens.insufficientDescription'),
            });
            if (error.currentTokens !== undefined) {
              setTokens(error.currentTokens);
              setUserTokens(error.currentTokens);
            }
            break;
          case 'PROMPT_TOO_LONG':
            toast.error(t('aiChat.errors.promptTooLong'), {
              description: t('aiChat.errors.promptTooLongDescription'),
            });
            break;
          case 'AUTH_ERROR':
            toast.error(t('aiChat.errors.authError'), {
              description: t('aiChat.errors.authErrorDescription'),
            });
            break;
          default:
            toast.error(t('aiChat.errors.chatError'), {
              description: error.message || t('aiChat.errors.chatErrorDescription'),
            });
        }
      },
    );

    // Cleanup: remove only our listeners, don't close the shared socket
    return () => {
      existingSocket.off('connect', handleConnect);
      existingSocket.off('disconnect', handleDisconnect);
      existingSocket.off('connect_error', handleConnectError);
      existingSocket.off('ai-chat:token-status');
      existingSocket.off('ai-chat:start');
      existingSocket.off('ai-chat:chunk');
      existingSocket.off('ai-chat:complete');
      existingSocket.off('ai-chat:cancelled');
      existingSocket.off('ai-chat:tokens');
      existingSocket.off('ai-chat:error');
    };
  }, [user, isAuthenticated, setUserTokens]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    devLog('AIChat submit', {
      hasPrompt: !!prompt.trim(),
      tokens,
      hasSocket: !!socket,
      isConnected,
    });

    if (!prompt.trim()) {
      toast.error(t('aiChat.errors.chatError'));
      return;
    }

    const effectiveCost = costPerMessage && costPerMessage > 0 ? costPerMessage : 1;

    if (tokens < effectiveCost) {
      toast.error(t('aiChat.tokens.insufficient'), {
        description: t('aiChat.tokens.insufficientDescription'),
      });
      return;
    }

    if (!socket || !isConnected) {
      toast.error(t('aiChat.errors.connectionError'), {
        description: t('aiChat.errors.notConnected'),
      });
      return;
    }

    if (prompt.length > 4000) {
      toast.error(t('aiChat.errors.promptTooLong'), {
        description: t('aiChat.errors.promptTooLongDescription'),
      });
      return;
    }

    // Add user message to history
    const userMessage: ChatMessage = { role: 'user', content: prompt };
    setChatHistory(prev => [...prev, userMessage]);

    // Send to server
    socket.emit('ai-chat:send', {
      prompt: prompt,
      sessionId: sessionIdRef.current,
      conversationHistory: chatHistory,
    });

    setPrompt('');
  };

  const handleCancel = () => {
    if (socket && isLoading) {
      socket.emit('ai-chat:cancel', {
        sessionId: sessionIdRef.current,
      });
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setStreamingResponse('');
    sessionIdRef.current = `session_${Date.now()}`;
    toast.info(t('aiChat.success.chatCleared'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {t('aiChat.title')}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t('aiChat.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`}
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {isConnected
                ? t('aiChat.connectionStatus.connected')
                : t('aiChat.connectionStatus.disconnected')}
            </span>
          </div>
          {chatHistory.length > 0 && (
            <Button size="sm" variant="outline" onClick={clearChat} className="text-xs">
              {t('aiChat.buttons.clear')}
            </Button>
          )}
          <Badge className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
            {tokens} {t('aiChat.tokens.available')}
          </Badge>
          <Badge variant="outline" className="border-zinc-300 text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
            {t('aiChat.tokens.costPerMessage')}: {costPerMessage ?? '–'}
          </Badge>
        </div>
      </div>

      {/* Info Alert */}
      {!isConnected ? (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/10">
          <AlertDescription className="text-sm text-orange-900 dark:text-orange-100">
            ⚠️ {t('aiChat.connectionStatus.connecting')}
          </AlertDescription>
        </Alert>
      ) : tokens <= 0 ? (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
          <AlertDescription className="text-sm text-red-900 dark:text-red-100">
            ❌ {t('aiChat.tokens.insufficientDescription')}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10">
          <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
            💡 {t('aiChat.tokens.insufficientDescription')}
            {costPerMessage ? ` • ${t('aiChat.tokens.costPerMessage')}: ${costPerMessage}` : ''}
          </AlertDescription>
        </Alert>
      )}

      {/* Chat Area */}
      <Card className="border shadow-sm">
        <div className="p-6">
          <div className="mb-6 max-h-[600px] min-h-[400px] space-y-4 overflow-y-auto">
            {chatHistory.length === 0 && !streamingResponse ? (
              <div className="flex h-[400px] flex-col items-center justify-center text-center">
                <svg
                  className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {t('aiChat.empty.title')}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t('aiChat.empty.description')}
                </p>
              </div>
            ) : (
              <>
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.role === 'user'
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {/* Streaming Response */}
                {isLoading && streamingResponse && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg bg-zinc-100 p-4 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
                      <p className="text-sm whitespace-pre-wrap">{streamingResponse}</p>
                      <div className="mt-2 flex items-center gap-1">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400" />
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:200ms]" />
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:400ms]" />
                      </div>
                    </div>
                  </div>
                )}
                {/* Loading without streaming */}
                {isLoading && !streamingResponse && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex gap-3">
              <Input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={
                  !isConnected
                    ? t('aiChat.input.placeholderDisconnected')
                    : tokens <= 0
                      ? t('aiChat.tokens.insufficient')
                      : t('aiChat.input.placeholder')
                }
                disabled={isLoading}
                className="flex-1"
                maxLength={4000}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              {isLoading ? (
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/10"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {t('aiChat.buttons.cancel')}
                  </span>
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!prompt.trim() || tokens <= 0 || !isConnected}
                  className="bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    {t('aiChat.buttons.send')}
                  </span>
                </Button>
              )}
            </div>

            {/* Character count and info */}
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>{t('aiChat.input.maxLength')}</span>
              <span>
                {prompt.length} / 4000 {t('aiChat.input.characterCount')}
              </span>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
