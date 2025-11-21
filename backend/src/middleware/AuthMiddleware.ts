import { Request, Response, NextFunction } from 'express';
import { parseInitData, validateTelegramData } from '../auth/TelegramAuth';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; telegramId: number };
    }
  }
}

export const telegramAuth = async (req: Request, res: Response, next: NextFunction) => {
  const initDataRaw = req.headers['x-telegram-init-data'] as string;
  if (!initDataRaw) return res.status(401).json({ error: 'Missing init data' });

  try {
    const initData = parseInitData(initDataRaw);
    if (!validateTelegramData(initData)) {
      return res.status(403).json({ error: 'Invalid init data signature' });
    }

    let user = await prisma.user.findUnique({ where: { telegramId: initData.id } });
    if (!user) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      user = await prisma.user.create({
        data: {
          telegramId: initData.id,
          tradeName: `User#${randomSuffix}`,
        },
      });
    }

    const token = jwt.sign(
      { userId: user.id, telegramId: user.telegramId },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    res.setHeader('Authorization', `Bearer ${token}`);
    req.user = { id: user.id, telegramId: user.telegramId };
    next();
  } catch (e) {
    console.error('Auth error:', e);
    res.status(400).json({ error: 'Auth failed' });
  }
};