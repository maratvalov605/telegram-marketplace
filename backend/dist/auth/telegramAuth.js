"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTelegramData = exports.parseInitData = void 0;
const crypto_1 = __importDefault(require("crypto"));
const parseInitData = (initDataStr) => {
    const entries = initDataStr
        .split('&')
        .map(pair => pair.split('='))
        .map(([k, v]) => [k, decodeURIComponent(v)]);
    return Object.fromEntries(entries);
};
exports.parseInitData = parseInitData;
const validateTelegramData = (initData) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN; // ← задать в .env
    if (!botToken)
        throw new Error('TELEGRAM_BOT_TOKEN not set');
    const { hash, ...data } = initData;
    const checkString = Object.entries(data)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');
    const secretKey = crypto_1.default
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();
    const hmac = crypto_1.default
        .createHmac('sha256', secretKey)
        .update(checkString)
        .digest('hex');
    return hmac === hash && Date.now() / 1000 - initData.auth_date < 86400; // < 24h
};
exports.validateTelegramData = validateTelegramData;
