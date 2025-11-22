import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.post('/users', userController.findOrCreate);
router.get('/users/:telegramId', userController.getProfile);
router.put('/users/:telegramId', userController.updateProfile);
router.get('/users', userController.getAllUsers);

export default router;