export interface User {
  id: number;
  telegramId: number;
  tradeName: string;
  rating: number;
  trustLevel: string;
  successfulOrders: number;
  totalOrders: number;
  createdAt: Date;
  avatar?: string;
}

export interface CreateUserRequest {
  telegramId: number;
  tradeName: string;
}

export interface UpdateUserRequest {
  tradeName?: string;
  avatar?: string;
}