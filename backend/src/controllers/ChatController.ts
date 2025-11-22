import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Временное хранилище (в реальном приложении - БД)
const chats: Map<string, any> = new Map();
const messages: Map<string, any[]> = new Map();

export class ChatController {
  // Получить чаты пользователя
  async getUserChats(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const userChats = Array.from(chats.values())
        .filter(chat => chat.buyerId === Number(userId) || chat.sellerId === Number(userId))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      res.json(userChats);
    } catch (error) {
      console.error('Error getting user chats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Создать новый чат
  async createChat(req: Request, res: Response) {
    try {
      const { productId, buyerId, sellerId, initialMessage } = req.body;

      if (!productId || !buyerId || !sellerId) {
        return res.status(400).json({
          error: 'productId, buyerId, and sellerId are required'
        });
      }

      // Проверяем, существует ли уже чат
      const existingChat = Array.from(chats.values()).find(chat =>
        chat.productId === productId && chat.buyerId === buyerId
      );

      if (existingChat) {
        return res.json(existingChat);
      }

      // Создаем новый чат
      const chatId = uuidv4();
      const newChat = {
        id: chatId,
        productId,
        buyerId,
        sellerId,
        otherUser: { id: sellerId, tradeName: 'Продавец', rating: 5.0 }, // Заглушка
        unreadCount: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      chats.set(chatId, newChat);
      messages.set(chatId, []);

      // Добавляем начальное сообщение если есть
      if (initialMessage) {
        const message = {
          id: uuidv4(),
          chatId,
          senderId: buyerId,
          type: 'text',
          content: initialMessage,
          read: false,
          createdAt: new Date().toISOString(),
        };

        messages.get(chatId)?.push(message);
        newChat.lastMessage = message;
      }

      res.status(201).json(newChat);
    } catch (error) {
      console.error('Error creating chat:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Получить сообщения чата
  async getChatMessages(req: Request, res: Response) {
    try {
      const { chatId } = req.params;

      const chatMessages = messages.get(chatId) || [];
      res.json(chatMessages);
    } catch (error) {
      console.error('Error getting chat messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Отправить сообщение
  async sendMessage(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const { senderId, type, content, productId } = req.body;

      if (!senderId || !type || !content) {
        return res.status(400).json({
          error: 'senderId, type, and content are required'
        });
      }

      const chat = chats.get(chatId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      const message = {
        id: uuidv4(),
        chatId,
        senderId,
        type,
        content,
        productId,
        read: false,
        createdAt: new Date().toISOString(),
      };

      // Добавляем сообщение
      const chatMessages = messages.get(chatId) || [];
      chatMessages.push(message);
      messages.set(chatId, chatMessages);

      // Обновляем чат
      chat.lastMessage = message;
      chat.updatedAt = new Date().toISOString();

      // Увеличиваем счетчик непрочитанных для другого пользователя
      if (senderId === chat.buyerId) {
        chat.unreadCount += 1;
      }

      chats.set(chatId, chat);

      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Отметить сообщения как прочитанные
  async markAsRead(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const { userId } = req.body;

      const chat = chats.get(chatId);
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      // Сбрасываем счетчик непрочитанных
      chat.unreadCount = 0;
      chats.set(chatId, chat);

      res.json({ success: true });
    } catch (error) {
      console.error('Error marking as read:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}