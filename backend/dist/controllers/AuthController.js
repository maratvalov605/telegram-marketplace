"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const TelegramAuthService_1 = require("../services/TelegramAuthService");
class AuthController {
    static async telegramAuth(req, res) {
        try {
            const { initData } = req.body;
            const user = await TelegramAuthService_1.TelegramAuthService.authenticate(initData);
            res.json({ success: true, user });
        }
        catch (error) {
            res.status(401).json({ success: false, error: 'Authentication failed' });
        }
    }
}
exports.AuthController = AuthController;
