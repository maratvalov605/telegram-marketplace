import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserController {
  static async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      console.log('Getting profile for user:', userId);

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { tradeName } = req.body;

      console.log('Updating user:', userId, 'to tradeName:', tradeName);

      // ПРОСТАЯ ВАЛИДАЦИЯ
      if (!tradeName || tradeName.trim().length === 0) {
        return res.status(400).json({ error: 'Trade name is required' });
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { tradeName: tradeName.trim() }
      });

      console.log('User updated successfully:', user);
      res.json({ user });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
}