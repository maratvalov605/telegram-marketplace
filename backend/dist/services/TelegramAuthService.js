"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramAuthService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TelegramAuthService {
    static async authenticate(initData) {
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
    static validateInitData(initData) {
        // TODO: Реализовать валидацию подписи Telegram
        // Пока заглушка для разработки
        return initData.length > 0;
    }
}
exports.TelegramAuthService = TelegramAuthService;
