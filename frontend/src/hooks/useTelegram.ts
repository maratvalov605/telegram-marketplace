import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: any;
        ready: () => void;
        expand: () => void;
        // etc.
      };
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

export const useTelegram = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready(); // Signal readiness
      webApp.expand(); // Expand fullscreen

      const initDataUnsafe = webApp.initDataUnsafe;
      if (initDataUnsafe?.user) {
        setUser(initDataUnsafe.user as TelegramUser);
      }
      setReady(true);
    }
  }, []);

  return { user, ready, initData: window.Telegram?.WebApp?.initData || '' };
};