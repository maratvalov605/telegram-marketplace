import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';

const router = Router();

router.post('/auth/telegram', AuthController.telegramAuth);
router.get('/users/:userId', UserController.getProfile);
router.patch('/users/:userId', UserController.updateProfile);

export default router;