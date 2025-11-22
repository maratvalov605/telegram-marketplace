import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserRequest, UpdateUserRequest } from '../models/User';

const userService = new UserService();

export class UserController {
  async findOrCreate(req: Request, res: Response) {
    try {
      const userData: CreateUserRequest = req.body;

      if (!userData.telegramId || !userData.tradeName) {
        return res.status(400).json({
          error: 'telegramId and tradeName are required'
        });
      }

      const user = await userService.findOrCreate(userData);
      res.json(user);
    } catch (error) {
      console.error('Error in findOrCreate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const { telegramId } = req.params;

      if (!telegramId) {
        return res.status(400).json({ error: 'telegramId is required' });
      }

      const user = await userService.findByTelegramId(Number(telegramId));

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const { telegramId } = req.params;
      const updates: UpdateUserRequest = req.body;

      if (!telegramId) {
        return res.status(400).json({ error: 'telegramId is required' });
      }

      const updatedUser = await userService.updateUser(Number(telegramId), updates);

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}