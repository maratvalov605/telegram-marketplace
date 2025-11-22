export const autoModeration = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' && (req.path.includes('/products') || req.path.includes('/chat'))) {
        const user = req.user; // Из auth middleware
        const trustLevel = TrustSystem.calculateTrustLevel(user);

        // Для новых пользователей - обязательная модерация
        if (!trustLevel.permissions.autoModeration) {
            const textContent = extractTextFromRequest(req);
            const moderationResult = await ModerationService.moderateContent(textContent);

            if (!moderationResult.is_approved) {
                return res.status(400).json({
                    error: 'Контент не прошел модерацию',
                    reasons: moderationResult.reasons
                });
            }
        }
    }

    next();
};