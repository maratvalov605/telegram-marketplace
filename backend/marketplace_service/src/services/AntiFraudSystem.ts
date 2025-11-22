export class AntiFraudSystem {
    private dailyDisputeLimits = new Map<number, { count: number; lastReset: Date }>();

    async checkForAutoBan(userId: number): Promise<{ shouldBan: boolean; reason?: string }> {
        const userStats = await this.getUserDailyStats(userId);

        // Автобан при 2+ спорах в день
        if (userStats.disputes >= 10) {
            return {
                shouldBan: true,
                reason: `Автоматический бан за ${userStats.disputes} спора в течение 24 часов`
            };
        }

        // Проверка других подозрительных активностей
        const suspiciousActivities = await this.detectSuspiciousActivities(userId);
        if (suspiciousActivities.length > 0) {
            return {
                shouldBan: true,
                reason: `Подозрительная активность: ${suspiciousActivities.join(', ')}`
            };
        }

        return { shouldBan: false };
    }

    private async getUserDailyStats(userId: number): Promise<{ disputes: number }> {
        // Получаем количество споров за последние 24 часа
        const disputeCount = await DisputeService.getDisputeCountLast24h(userId);
        return { disputes: disputeCount };
    }

    private async detectSuspiciousActivities(userId: number): Promise<string[]> {
        const activities: string[] = [];

        // Проверка быстрого создания/удаления товаров
        const rapidProductChanges = await this.checkRapidProductChanges(userId);
        if (rapidProductChanges) activities.push('быстрое изменение товаров');

        // Проверка попыток обмена контактами
        const contactAttempts = await this.checkContactSharingAttempts(userId);
        if (contactAttempts) activities.push('попытки обмена контактами');

        return activities;
    }
}