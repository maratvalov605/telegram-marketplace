export class LoggingService {
    private static instance: LoggingService;

    static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    async logSecurityEvent(event: {
        userId: number;
        action: string;
        resource: string;
        status: 'success' | 'failure' | 'suspicious';
        details?: any;
        ipAddress?: string;
    }) {
        // Логируем в базу данных
        await this.saveToDatabase(event);

        // Логируем в консоль для разработки
        console.log(`[SECURITY] ${event.action} - ${event.status}`, {
            userId: event.userId,
            resource: event.resource,
            details: event.details
        });

        // Если событие подозрительное - отправляем уведомление админам
        if (event.status === 'suspicious') {
            await this.notifyAdmins(event);
        }
    }

    async logModerationAction(moderatorId: number, action: string, target: any, reason?: string) {
        await this.logSecurityEvent({
            userId: moderatorId,
            action: `moderation_${action}`,
            resource: 'product',
            status: 'success',
            details: { target, reason }
        });
    }

    private async saveToDatabase(event: any) {
        // Сохраняем событие в таблицу security_logs
        // CREATE TABLE security_logs (...)
    }

    private async notifyAdmins(event: any) {
        // Отправляем уведомление админам через notification_service
    }
}