import React from 'react';
import { useTelegram } from '../contexts/TelegramContext';

const ProfilePage: React.FC = () => {
  const { user } = useTelegram();

  const stats = [
    { label: 'Products Listed', value: '12', icon: '🛒' },
    { label: 'Items Sold', value: '8', icon: '💰' },
    { label: 'Rating', value: '4.9★', icon: '⭐' },
    { label: 'Member Since', value: '2024', icon: '📅' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-3xl">
              {user?.first_name?.[0]?.toUpperCase() || '👤'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {user?.first_name || 'Telegram User'}
            </h1>
            <p className="text-purple-100">
              {user?.username ? `@${user.username}` : 'Telegram Member'}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                ✅ Verified
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                🛡️ Trusted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-xl">📦</span>
              <span className="font-semibold">My Products</span>
            </div>
            <span className="text-blue-600">→</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-xl">💬</span>
              <span className="font-semibold">My Chats</span>
            </div>
            <span className="text-green-600">→</span>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-xl">⚙️</span>
              <span className="font-semibold">Settings</span>
            </div>
            <span className="text-purple-600">→</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold">Product Sold</p>
              <p className="text-sm text-gray-600">Wireless Headphones - $250</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl">🛒</span>
            <div>
              <p className="font-semibold">New Listing</p>
              <p className="text-sm text-gray-600">Smartphone XYZ - $1000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;