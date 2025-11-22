import { User, CreateUserRequest, UpdateUserRequest } from '../types/types';
import { useApi } from '../hooks/useApi';

export const userService = {
  async findOrCreate(userData: CreateUserRequest): Promise<User> {
    const response = await fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to create/find user');
    }

    return response.json();
  },

  async getProfile(telegramId: number): Promise<User> {
    const response = await fetch(`http://localhost:3001/api/users/${telegramId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  },

  async updateProfile(telegramId: number, updates: UpdateUserRequest): Promise<User> {
    const response = await fetch(`http://localhost:3001/api/users/${telegramId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },
};