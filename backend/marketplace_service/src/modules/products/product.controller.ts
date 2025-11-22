// Получение товаров, ожидающих модерации
const getPendingProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductService.getProductsByModerationStatus('pending');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Модерация товара
const moderateProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { action, reason } = req.body; // 'approve' or 'reject'

        await ProductService.moderateProduct(parseInt(productId), action, reason);

        // Отправляем уведомление продавцу
        await NotificationService.sendModerationResult(parseInt(productId), action, reason);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};