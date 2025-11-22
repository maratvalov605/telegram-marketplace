import axios from 'axios';

export interface ModerationResult {
    is_approved: boolean;
    reasons: string[];
    score: number;
}

export class ModerationService {
    private moderationServiceUrl: string;

    constructor() {
        this.moderationServiceUrl = process.env.MODERATION_SERVICE_URL || 'http://moderation-service:5000';
    }

    async moderateContent(text: string): Promise<ModerationResult> {
        try {
            const response = await axios.post(`${this.moderationServiceUrl}/api/moderate/text`, {
                text: text
            });
            return response.data;
        } catch (error) {
            console.error('Moderation service error:', error);
            // В случае ошибки сервиса модерации - отклоняем контент для безопасности
            return {
                is_approved: false,
                reasons: ['Moderation service unavailable'],
                score: 100
            };
        }
    }

    async moderateProduct(productData: { title: string; description: string }): Promise<ModerationResult> {
        const fullText = `${productData.title} ${productData.description}`;
        return this.moderateContent(fullText);
    }
}