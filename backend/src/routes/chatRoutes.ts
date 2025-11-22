import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';

const router = Router();
const chatController = new ChatController();

router.get('/chats', chatController.getUserChats);
router.post('/chats', chatController.createChat);
router.get('/chats/:chatId/messages', chatController.getChatMessages);
router.post('/chats/:chatId/messages', chatController.sendMessage);
router.put('/chats/:chatId/read', chatController.markAsRead);

export default router;