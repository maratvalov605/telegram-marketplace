import React, { useEffect, useRef, useState } from 'react';
import { Chat, Message } from '../types/types';
import { MessageBubble } from '../components/Chats/MessageBubble';
import { MessageInput } from '../components/Chats/MessageInput';

interface ChatRoomPageProps {
  chat: Chat;
  messages: Message[];
  currentUserId: number;
  onSendMessage: (content: string) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

export const ChatRoomPage: React.FC<ChatRoomPageProps> = ({
  chat,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  loading = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);

  const { otherUser, product } = chat;

  // Авто-скролл к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (sending) return;

    setSending(true);
    try {
      await onSendMessage(content);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  // Группировка сообщений по дням
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];

    messages.forEach(message => {
      const date = new Date(message.createdAt).toLocaleDateString('ru-RU');
      const lastGroup = groups[groups.length - 1];

      if (lastGroup && lastGroup.date === date) {
        lastGroup.messages.push(message);
      } else {
        groups.push({ date, messages: [message] });
      }
    });

    return groups;
  };

  const shouldShowAvatar = (message: Message, index: number, groupMessages: Message[]) => {
    if (message.senderId === currentUserId) return false;

    // Показываем аватар если:
    // 1. Первое сообщение в группе
    if (index === 0) return true;

    // 2. Предыдущее сообщение от другого пользователя
    const prevMessage = groupMessages[index - 1];
    if (prevMessage.senderId !== message.senderId) return true;

    // 3. Разница во времени больше 5 минут
    const prevTime = new Date(prevMessage.createdAt).getTime();
    const currentTime = new Date(message.createdAt).getTime();
    if (currentTime - prevTime > 5 * 60 * 1000) return true;

    return false;
  };

  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
      });
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>←</button>

        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {otherUser.avatar ? (
              <img src={otherUser.avatar} alt="Avatar" style={styles.avatarImage} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {otherUser.tradeName.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={styles.onlineIndicator} />
          </div>

          <div style={styles.userDetails}>
            <div style={styles.userName}>{otherUser.tradeName}</div>
            <div style={styles.userStatus}>в сети</div>
          </div>
        </div>

        <div style={styles.headerSpacer} />
      </div>

      {/* Product Info */}
      {product && (
        <div style={styles.productInfo}>
          <div style={styles.productImage}>
            {product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.title} style={styles.productImage} />
            ) : (
              <div style={styles.productImagePlaceholder}>📦</div>
            )}
          </div>
          <div style={styles.productDetails}>
            <div style={styles.productTitle}>{product.title}</div>
            <div style={styles.productPrice}>{product.price}₽</div>
          </div>
          <button style={styles.buyButton}>
            Купить
          </button>
        </div>
      )}

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {loading && messages.length === 0 ? (
          <div style={styles.loading}>
            <div style={styles.loadingSpinner}>💬</div>
            <div style={styles.loadingText}>Загрузка сообщений...</div>
          </div>
        ) : (
          <div style={styles.messagesList}>
            {groupMessagesByDate().map((group, groupIndex) => (
              <div key={group.date}>
                {/* Date Separator */}
                <div style={styles.dateSeparator}>
                  {formatGroupDate(group.date)}
                </div>

                {/* Messages */}
                {group.messages.map((message, index) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === currentUserId}
                    showAvatar={shouldShowAvatar(message, index, group.messages)}
                    userAvatar={otherUser.avatar}
                    userName={otherUser.tradeName}
                  />
                ))}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={sending || loading}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    backgroundColor: 'white',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: 'white',
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
    marginRight: '12px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    position: 'relative' as const,
    marginRight: '12px',
  },
  avatarImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
  },
  avatarPlaceholder: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#0088cc',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute' as const,
    bottom: '2px',
    right: '2px',
    width: '10px',
    height: '10px',
    backgroundColor: '#4CAF50',
    border: '2px solid white',
    borderRadius: '50%',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '2px',
  },
  userStatus: {
    fontSize: '12px',
    color: '#4CAF50',
  },
  headerSpacer: {
    width: '40px',
  },
  productInfo: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#f8f9fa',
  },
  productImage: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    objectFit: 'cover' as const,
    marginRight: '12px',
  },
  productImagePlaceholder: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '2px',
  },
  productPrice: {
    fontSize: '14px',
    color: '#0088cc',
    fontWeight: 'bold',
  },
  buyButton: {
    padding: '8px 16px',
    backgroundColor: '#0088cc',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  messagesContainer: {
    flex: 1,
    overflow: 'auto' as const,
    backgroundColor: '#f8f9fa',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '40px 20px',
  },
  loadingSpinner: {
    fontSize: '32px',
    marginBottom: '12px',
    opacity: 0.5,
  },
  loadingText: {
    fontSize: '14px',
    color: '#666',
  },
  messagesList: {
    padding: '16px 0',
  },
  dateSeparator: {
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#666',
    margin: '16px 0',
    padding: '4px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '12px',
    display: 'inline-block',
    marginLeft: '50%',
    transform: 'translateX(-50%)',
  },
};