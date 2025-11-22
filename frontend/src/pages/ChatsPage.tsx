import React from 'react';

interface Chat {
  id: number;
  user: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

const ChatsPage: React.FC = () => {
  const chats: Chat[] = [
    {
      id: 1,
      user: 'Alex Johnson',
      lastMessage: 'Hi! Is this still available?',
      time: '2 min ago',
      unread: 2,
      avatar: '👨‍💼'
    },
    {
      id: 2,
      user: 'Sarah Smith',
      lastMessage: 'Thanks for the quick delivery!',
      time: '1 hour ago',
      unread: 0,
      avatar: '👩‍🎓'
    },
    {
      id: 3,
      user: 'Mike Wilson',
      lastMessage: 'Can you do $800 for the laptop?',
      time: '3 hours ago',
      unread: 1,
      avatar: '👨‍🔧'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages 💬</h1>
        <p className="text-gray-600">Chat with buyers and sellers</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-xl text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search conversations..."
            className="flex-1 outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="space-y-3">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                {chat.avatar}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {chat.user}
                  </h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {chat.time}
                  </span>
                </div>
                <p className="text-gray-600 text-sm truncate">
                  {chat.lastMessage}
                </p>
              </div>

              {/* Unread Badge */}
              {chat.unread > 0 && (
                <div className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {chat.unread}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {chats.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Messages Yet</h3>
          <p className="text-gray-600">Your conversations will appear here</p>
        </div>
      )}
    </div>
  );
};

export default ChatsPage;