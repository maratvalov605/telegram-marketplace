"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegramAuth = void 0;
const TelegramAuth_1 = require("../auth/TelegramAuth");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const telegramAuth = async (req, res, next) => {
    const initDataRaw = req.headers['x-telegram-init-data'];
    if (!initDataRaw)
        return res.status(401).json({ error: 'Missing init data' });
    try {
        const initData = (0, TelegramAuth_1.parseInitData)(initDataRaw);
        if (!(0, TelegramAuth_1.validateTelegramData)(initData)) {
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id, telegramId: user.telegramId }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.setHeader('Authorization', `Bearer ${token}`);
        req.user = { id: user.id, telegramId: user.telegramId };
        next();
    }
    catch (e) {
        console.error('Auth error:', e);
        res.status(400).json({ error: 'Auth failed' });
    }
};
exports.telegramAuth = telegramAuth;
