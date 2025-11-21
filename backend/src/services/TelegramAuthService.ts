import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class TelegramAuthService {
  static async authenticate(initData: string) {
    // Валидация Telegram WebApp данных
    const isValid = this.validateInitData(initData);
    if (!isValid) {
      throw new Error('Invalid Telegram init data');
    }

    // Парсим данные
    const params = new URLSearchParams(initData);
    const userData = params.get('user');
    const telegramId = userData ? JSON.parse(userData).id : 0;

    if (!telegramId) {
      throw new Error('User data not found');
    }

    // Создаем или находим пользователя
    const user = await prisma.user.upsert({
      where: { telegramId },
      update: {},
      create: {
        telegramId,
        tradeName: `User#${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      }
    });

    return user;
  }

  private static validateInitData(initData: string): boolean {
    // TODO: Реализовать валидацию подписи Telegram
    // Пока заглушка для разработки
    return initData.length > 0;
  }
}