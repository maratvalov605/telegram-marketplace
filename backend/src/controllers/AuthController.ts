import { Request, Response } from 'express';
import { TelegramAuthService } from '../services/TelegramAuthService';

export class AuthController {
  static async telegramAuth(req: Request, res: Response) {
    try {
      const { initData } = req.body;
      const user = await TelegramAuthService.authenticate(initData);
      res.json({ success: true, user });
    } catch (error) {
      res.status(401).json({ success: false, error: 'Authentication failed' });
    }
  }
}