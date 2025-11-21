import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserController {
  static async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { tradeName } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { tradeName }
      });

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}