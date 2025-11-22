import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home', active: location.pathname === '/' },
    { path: '/products', icon: '🛍️', label: 'Products', active: location.pathname === '/products' },
    { path: '/create', icon: '➕', label: 'Sell', active: location.pathname === '/create' },
    { path: '/chats', icon: '💬', label: 'Chats', active: location.pathname === '/chats' },
    { path: '/profile', icon: '👤', label: 'Profile', active: location.pathname === '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                item.active
                  ? 'text-blue-600 scale-110'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {item.active && (
                <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;