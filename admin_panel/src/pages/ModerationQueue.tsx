// admin_panel/src/pages/ModerationQueue.tsx
import React, { useState, useEffect } from 'react';
import { Product, ModerationResult } from '../../../shared/types/marketplace';

const ModerationQueue: React.FC = () => {
    const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const fetchPendingProducts = async () => {
        try {
            const response = await fetch('/api/admin/products/pending');
            const products = await response.json();
            setPendingProducts(products);
        } catch (error) {
            console.error('Error fetching pending products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModeration = async (productId: number, action: 'approve' | 'reject', reason?: string) => {
        try {
            await fetch(`/api/admin/products/${productId}/moderate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, reason })
            });

            setPendingProducts(prev => prev.filter(p => p.product_id !== productId));
        } catch (error) {
            console.error('Error moderating product:', error);
        }
    };

    if (loading) return <div>Loading moderation queue...</div>;

    return (
        <div className="moderation-queue">
            <h2>Очередь модерации ({pendingProducts.length})</h2>

            {pendingProducts.map(product => (
                <div key={product.product_id} className="product-card pending">
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <div className="product-meta">
                        <span>Цена: {product.price} ₽</span>
                        <span>Категория: {product.category}</span>
                    </div>

                    <div className="moderation-actions">
                        <button
                            onClick={() => handleModeration(product.product_id, 'approve')}
                            className="btn-success"
                        >
                            Одобрить
                        </button>
                        <button
                            onClick={() => handleModeration(product.product_id, 'reject', 'Нарушение правил')}
                            className="btn-danger"
                        >
                            Отклонить
                        </button>
                    </div>
                </div>
            ))}

            {pendingProducts.length === 0 && (
                <div className="empty-state">Нет товаров для модерации</div>
            )}
        </div>
    );
};

export default ModerationQueue;