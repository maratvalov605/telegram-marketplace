import React, { createContext, useContext, useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramContextType {
  user: TelegramUser | null;
  webApp: any;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  webApp: null,
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: React.ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);

      // Expand the Web App to full height
      tg.expand();
    } else {
      // Mock data for development
      setUser({
        id: 123456789,
        first_name: 'Telegram',
        username: 'telegram_user',
        language_code: 'en',
      });
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ user, webApp }}>
      {children}
    </TelegramContext.Provider>
  );
};