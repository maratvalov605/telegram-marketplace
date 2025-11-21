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
      console.log('Starting Telegram auth...');

      // Проверяем что мы в Telegram WebApp
      if (!window.Telegram?.WebApp) {
        throw new Error('Not in Telegram WebApp environment');
      }

      const tg = window.Telegram.WebApp;

      // Инициализируем Telegram WebApp
      tg.expand();
      tg.ready();

      console.log('Telegram WebApp initialized:', tg.initDataUnsafe);

      // Получаем данные пользователя из Telegram
      const telegramUser = tg.initDataUnsafe.user;
      if (!telegramUser) {
        throw new Error('No user data from Telegram');
      }

      // Аутентифицируем пользователя через бэкенд
      const initData = tg.initData;
      const authResult = await authApi.telegramAuth(initData);

      if (authResult.success && authResult.user) {
        setUser(authResult.user);
        console.log('User authenticated:', authResult.user);
      } else {
        throw new Error('Authentication failed');
      }

    } catch (error) {
      console.error('Telegram auth failed:', error);

      // Фолбэк для разработки
      const testUser = {
        id: "fallback-user-123",
        telegramId: 123456,
        tradeName: "FallbackUser#TEST",
        createdAt: new Date().toISOString()
      };
      setUser(testUser);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
  };

  return { user, isLoading, currentPage, navigateTo };
};