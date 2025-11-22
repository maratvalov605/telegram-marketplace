import React from 'react';
import { Chat } from '../../types/types';

interface ChatPreviewProps {
  chat: Chat;
  isActive: boolean;
  onClick: (chat: Chat) => void;
  currentUserId: number;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({
  chat,
  isActive,
  onClick,
  currentUserId
}) => {
  const { otherUser, lastMessage, unreadCount, product, updatedAt } = chat;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин`;
    if (diffHours < 24) return `${diffHours} ч`;
    if (diffDays < 7) return `${diffDays} д`;

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getMessagePreview = () => {
    if (!lastMessage) return 'Нет сообщений';

    const prefix = lastMessage.senderId === currentUserId ? 'Вы: ' : '';

    switch (lastMessage.type) {
      case 'image':
        return `${prefix}📷 Изображение`;
      case 'product_suggestion':
        return `${prefix}📦 Предложен товар`;
      default:
        return `${prefix}${lastMessage.content}`;
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        ...(isActive ? styles.activeContainer : {})
      }}
      onClick={() => onClick(chat)}
    >
      {/* Аватар */}
      <div style={styles.avatar}>
        {otherUser.avatar ? (
          <img src={otherUser.avatar} alt="Avatar" style={styles.avatarImage} />
        ) : (
          <div style={styles.avatarPlaceholder}>
            {otherUser.tradeName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Онлайн статус */}
        <div style={styles.onlineIndicator} />
      </div>

      {/* Контент */}
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{otherUser.tradeName}</span>
            <span style={styles.userRating}>⭐ {otherUser.rating}</span>
          </div>
          <div style={styles.time}>
            {formatTime(updatedAt)}
          </div>
        </div>

        <div style={styles.messagePreview}>
          {product && (
            <span style={styles.productBadge}>📦 {product.title}</span>
          )}
          <span style={styles.messageText}>{getMessagePreview()}</span>
        </div>
      </div>

      {/* Индикаторы */}
      {unreadCount > 0 && (
        <div style={styles.unreadBadge}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'white',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    position: 'relative' as const,
  },
  activeContainer: {
    backgroundColor: '#f0f8ff',
  },
  avatar: {
    position: 'relative' as const,
    marginRight: '12px',
  },
  avatarImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
  },
  avatarPlaceholder: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#0088cc',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute' as const,
    bottom: '2px',
    right: '2px',
    width: '12px',
    height: '12px',
    backgroundColor: '#4CAF50',
    border: '2px solid white',
    borderRadius: '50%',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '4px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#333',
  },
  userRating: {
    fontSize: '12px',
    color: '#666',
  },
  time: {
    fontSize: '12px',
    color: '#999',
    whiteSpace: 'nowrap' as const,
  },
  messagePreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  productBadge: {
    fontSize: '11px',
    color: '#0088cc',
    backgroundColor: '#f0f8ff',
    padding: '2px 6px',
    borderRadius: '10px',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
  messageText: {
    fontSize: '14px',
    color: '#666',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    flex: 1,
  },
  unreadBadge: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    backgroundColor: '#0088cc',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: 'bold',
    minWidth: '18px',
    textAlign: 'center' as const,
  },
};