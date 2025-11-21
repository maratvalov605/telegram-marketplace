"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserController {
    static async getProfile(req, res) {
        try {
            const { userId } = req.params;
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ user });
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async updateProfile(req, res) {
        try {
            const { userId } = req.params;
            const { tradeName } = req.body;
            const user = await prisma.user.update({
                where: { id: userId },
                data: { tradeName }
            });
            res.json({ user });
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.UserController = UserController;
