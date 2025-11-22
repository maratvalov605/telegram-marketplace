import { useState, useEffect, useCallback } from 'react';
import { Chat, Message, CreateChatRequest, SendMessageRequest, ChatsState } from '../types/types';
import { chatService } from '../services/chatService';

export const useChats = (userId: number) => {
  const [state, setState] = useState<ChatsState>({
    chats: [],
    currentChat: null,
    messages: [],
    loading: false,
    error: null,
  });

  // Загрузка списка чатов
  const loadChats = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const chats = await chatService.getUserChats(userId);
      setState(prev => ({ ...prev, chats, loading: false }));
    } catch (error) {
      console.error('Error loading chats:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Не удалось загрузить чаты'
      }));
    }
  }, [userId]);

  // Создание нового чата
  const createChat = useCallback(async (chatData: CreateChatRequest): Promise<Chat> => {
    try {
      const newChat = await chatService.createChat(chatData);

      // Добавляем в список чатов
      setState(prev => ({
        ...prev,
        chats: [newChat, ...prev.chats],
      }));

      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }, []);

  // Открытие чата
  const openChat = useCallback(async (chat: Chat) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Загружаем сообщения
      const messages = await chatService.getChatMessages(chat.id);

      // Отмечаем как прочитанные
      await chatService.markAsRead(chat.id, userId);

      // Обновляем чат в списке (сбрасываем непрочитанные)
      const updatedChats = state.chats.map(c =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      );

      setState(prev => ({
        ...prev,
        currentChat: chat,
        messages,
        chats: updatedChats,
        loading: false,
      }));

      // Запускаем polling для новых сообщений
      return chatService.startPolling(chat.id, (newMessages) => {
        setState(prev => ({
          ...prev,
          messages: newMessages,
        }));
      });

    } catch (error) {
      console.error('Error opening chat:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Не удалось загрузить сообщения'
      }));
    }
  }, [userId, state.chats]);

  // Закрытие чата
  const closeChat = useCallback(() => {
    setState(prev => ({ ...prev, currentChat: null, messages: [] }));
  }, []);

  // Отправка сообщения
  const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'product_suggestion' = 'text', productId?: number) => {
    if (!state.currentChat) return;

    try {
      const messageData: SendMessageRequest = {
        chatId: state.currentChat.id,
        senderId: userId,
        type,
        content,
        productId,
      };

      await chatService.sendMessage(messageData);

      // Сообщение автоматически добавится через polling

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [state.currentChat, userId]);

  // Подписка на новые сообщения (для уведомлений)
  useEffect(() => {
    const unsubscribe = chatService.onMessage((message) => {
      // Если сообщение для текущего открытого чата - обновляем сообщения
      if (state.currentChat && message.chatId === state.currentChat.id) {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      }

      // Обновляем список чатов (последнее сообщение и счетчик непрочитанных)
      setState(prev => ({
        ...prev,
        chats: prev.chats.map(chat => {
          if (chat.id === message.chatId) {
            const unreadCount = message.senderId !== userId ? chat.unreadCount + 1 : 0;
            return {
              ...chat,
              lastMessage: message,
              unreadCount,
              updatedAt: message.createdAt,
            };
          }
          return chat;
        }),
      }));
    });

    return unsubscribe;
  }, [state.currentChat, userId]);

  // Загрузка чатов при монтировании
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return {
    ...state,
    loadChats,
    createChat,
    openChat,
    closeChat,
    sendMessage,
  };
};