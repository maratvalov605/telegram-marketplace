export interface TrustLevel {
    level: string;
    minRating: number;
    minSuccessfulOrders: number;
    permissions: {
        autoModeration: boolean;
        maxActiveProducts: number;
        canUseBuyRequests: boolean;
        payoutDelayHours: number;
    };
}

export class TrustSystem {
    private trustLevels: TrustLevel[] = [
        {
            level: 'new',
            minRating: 0,
            minSuccessfulOrders: 0,
            permissions: {
                autoModeration: false,
                maxActiveProducts: 3,
                canUseBuyRequests: false,
                payoutDelayHours: 72
            }
        },
        {
            level: 'verified',
            minRating: 4.0,
            minSuccessfulOrders: 5,
            permissions: {
                autoModeration: true,
                maxActiveProducts: 20,
                canUseBuyRequests: true,
                payoutDelayHours: 24
            }
        },
        {
            level: 'trusted',
            minRating: 4.7,
            minSuccessfulOrders: 20,
            permissions: {
                autoModeration: true,
                maxActiveProducts: 100,
                canUseBuyRequests: true,
                payoutDelayHours: 0
            }
        }
    ];

    calculateTrustLevel(user: { rating: number; successful_orders: number }): TrustLevel {
        // Сортируем уровни по строгости и находим подходящий
        const sortedLevels = [...this.trustLevels].sort((a, b) =>
            b.minSuccessfulOrders - a.minSuccessfulOrders
        );

        for (const level of sortedLevels) {
            if (user.rating >= level.minRating &&
                user.successful_orders >= level.minSuccessfulOrders) {
                return level;
            }
        }

        // Возвращаем базовый уровень, если ни один не подошел
        return this.trustLevels[0];
    }

    canUserCreateProduct(user: any): { allowed: boolean; reason?: string } {
        const trustLevel = this.calculateTrustLevel(user);
        const activeProductsCount = await this.getUserActiveProductsCount(user.user_id);

        if (activeProductsCount >= trustLevel.permissions.maxActiveProducts) {
            return {
                allowed: false,
                reason: `Достигнут лимит активных товаров для вашего уровня (${trustLevel.permissions.maxActiveProducts})`
            };
        }

        return { allowed: true };
    }
}