import React, { useEffect } from 'react';
import { Chat } from '../types/types';
import { ChatPreview } from '../components/Chats/ChatPreview';

interface ChatsListPageProps {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  currentUserId: number;
  onOpenChat: (chat: Chat) => void;
  onRefresh: () => void;
  onBack: () => void;
}

export const ChatsListPage: React.FC<ChatsListPageProps> = ({
  chats,
  loading,
  error,
  currentUserId,
  onOpenChat,
  onRefresh,
  onBack
}) => {
  useEffect(() => {
    // Обновляем чаты при загрузке страницы
    onRefresh();
  }, [onRefresh]);

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  if (loading && chats.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={onBack}>←</button>
          <h1 style={styles.title}>Чаты</h1>
          <button style={styles.refreshButton} onClick={onRefresh}>🔄</button>
        </div>

        <div style={styles.loading}>
          <div style={styles.loadingSpinner}>💬</div>
          <div style={styles.loadingText}>Загрузка чатов...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>←</button>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Чаты</h1>
          {totalUnread > 0 && (
            <div style={styles.unreadBadge}>
              {totalUnread > 99 ? '99+' : totalUnread}
            </div>
          )}
        </div>
        <button style={styles.refreshButton} onClick={onRefresh}>🔄</button>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.error}>
          <div style={styles.errorText}>{error}</div>
          <button style={styles.retryButton} onClick={onRefresh}>
            Попробовать снова
          </button>
        </div>
      )}

      {/* Chats List */}
      <div style={styles.chatsList}>
        {chats.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <div style={styles.emptyTitle}>Нет активных чатов</div>
            <div style={styles.emptyText}>
              Напишите продавцу товара, чтобы начать общение
            </div>
          </div>
        ) : (
          chats.map(chat => (
            <ChatPreview
              key={chat.id}
              chat={chat}
              isActive={false}
              onClick={onOpenChat}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '60px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  backButton: {
    border: 'none',
    background: 'transparent',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '8px',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
  },
  unreadBadge: {
    backgroundColor: '#ff4444',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  refreshButton: {
    border: 'none',
    background: 'transparent',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '8px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  loadingSpinner: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  loadingText: {
    fontSize: '16px',
    color: '#666',
  },
  error: {
    padding: '20px',
    textAlign: 'center' as const,
    backgroundColor: '#ffebee',
    margin: '16px',
    borderRadius: '8px',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: '12px',
  },
  retryButton: {
    padding: '8px 16px',
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  chatsList: {
    backgroundColor: 'white',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '80px 20px',
    color: '#666',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    lineHeight: 1.4,
  },
};