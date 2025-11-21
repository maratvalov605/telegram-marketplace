import crypto from 'crypto';
import { Request } from 'express';
import { TelegramInitData } from '../types';

export const parseInitData = (initDataStr: string): TelegramInitData => {
  const entries = initDataStr
    .split('&')
    .map(pair => pair.split('='))
    .map(([k, v]) => [k, decodeURIComponent(v)]);

  return Object.fromEntries(entries) as TelegramInitData;
};

export const validateTelegramData = (initData: TelegramInitData): boolean => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN; // ← задать в .env
  if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN not set');

  const { hash, ...data } = initData;
  const checkString = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');

  return hmac === hash && Date.now() / 1000 - initData.auth_date < 86400; // < 24h
};