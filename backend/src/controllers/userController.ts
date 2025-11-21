import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const tradeNameSchema = z.object({
  tradeName: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_#\-]+$/),
});

export const getProfile = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, telegramId: user.telegramId, tradeName: user.tradeName });
};

export const updateTradeName = async (req: Request, res: Response) => {
  const parsed = tradeNameSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid tradeName' });

  const updated = await prisma.user.update({
    where: { id: req.user!.id },
    data: { tradeName: parsed.data.tradeName },
  });

  res.json({ tradeName: updated.tradeName });
};