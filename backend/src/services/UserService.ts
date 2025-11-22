import { User, CreateUserRequest, UpdateUserRequest } from '../models/User';

// Временное хранилище (потом заменим на БД)
const users: Map<number, User> = new Map();

export class UserService {
  async findOrCreate(userData: CreateUserRequest): Promise<User> {
    const existingUser = users.get(userData.telegramId);

    if (existingUser) {
      return existingUser;
    }

    const newUser: User = {
      id: users.size + 1,
      telegramId: userData.telegramId,
      tradeName: userData.tradeName,
      rating: 5.0,
      trustLevel: 'new',
      successfulOrders: 0,
      totalOrders: 0,
      createdAt: new Date(),
    };

    users.set(userData.telegramId, newUser);
    return newUser;
  }

  async findById(id: number): Promise<User | null> {
    return Array.from(users.values()).find(user => user.id === id) || null;
  }

  async findByTelegramId(telegramId: number): Promise<User | null> {
    return users.get(telegramId) || null;
  }

  async updateUser(telegramId: number, updates: UpdateUserRequest): Promise<User | null> {
    const user = users.get(telegramId);

    if (!user) {
      return null;
    }

    const updatedUser = { ...user, ...updates };
    users.set(telegramId, updatedUser);

    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(users.values());
  }
}