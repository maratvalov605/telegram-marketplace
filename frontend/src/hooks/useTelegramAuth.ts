import { useState, useEffect } from 'react';
import { authApi } from '../services/api';

export const useTelegramAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      console.log('Starting auth...');

      // ПРОСТАЯ ЗАГЛУШКА ДЛЯ PRODUCTION
      const testUser = {
        id: "prod-user-123",
        telegramId: 987654,
        tradeName: "TelegramUser#PROD",
        createdAt: new Date().toISOString()
      };

      console.log('Using production user:', testUser);
      setUser(testUser);
      setIsLoading(false);

    } catch (error) {
      console.error('Auth failed:', error);

      // Фолбэк
      const fallbackUser = {
        id: "fallback-user-456",
        telegramId: 111222,
        tradeName: "User#FALLBACK",
        createdAt: new Date().toISOString()
      };
      setUser(fallbackUser);
      setIsLoading(false);
    }
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  return { user, isLoading, currentPage, navigateTo };
};