import { Chat, Message, CreateChatRequest, SendMessageRequest } from '../types/types';

const API_BASE_URL = 'http://localhost:3002/api';

// Временное хранилище (в реальном приложении - WebSocket)
let messageListeners: ((message: Message) => void)[] = [];

export const chatService = {
  // Получить список чатов пользователя
  async getUserChats(userId: number): Promise<Chat[]> {
    const response = await fetch(`${API_BASE_URL}/chats?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }

    return response.json();
  },

  // Создать новый чат
  async createChat(chatData: CreateChatRequest): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatData),
    });

    if (!response.ok) {
      throw new Error('Failed to create chat');
    }

    return response.json();
  },

  // Получить историю сообщений чата
  async getChatMessages(chatId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`);

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  },

  // Отправить сообщение
  async sendMessage(messageData: SendMessageRequest): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/chats/${messageData.chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const message = await response.json();

    // Оповещаем слушателей о новом сообщении
    messageListeners.forEach(listener => listener(message));

    return message;
  },

  // Отметить сообщения как прочитанные
  async markAsRead(chatId: string, userId: number): Promise<void> {
    await fetch(`${API_BASE_URL}/chats/${chatId}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
  },

  // Подписка на новые сообщения
  onMessage(callback: (message: Message) => void) {
    messageListeners.push(callback);

    // Возвращаем функцию отписки
    return () => {
      messageListeners = messageListeners.filter(listener => listener !== callback);
    };
  },

  // Имитация real-time (для демо)
  startPolling(chatId: string, callback: (messages: Message[]) => void) {
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;

      try {
        const messages = await this.getChatMessages(chatId);
        callback(messages);
      } catch (error) {
        console.error('Polling error:', error);
      }

      // Повторяем каждые 3 секунды
      setTimeout(poll, 3000);
    };

    poll();

    // Функция остановки
    return () => {
      isActive = false;
    };
  },
};