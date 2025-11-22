import React from 'react';
import { useTelegram } from '../../contexts/TelegramContext';

const Header: React.FC = () => {
  const { user } = useTelegram();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200/50 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">🛒</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Telegram Market
              </h1>
              <p className="text-xs text-gray-500">Powered by Mini App</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user.first_name || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user.username ? `@${user.username}` : 'Telegram User'}
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user.first_name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;