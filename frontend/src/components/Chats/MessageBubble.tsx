import React from 'react';
import { Message } from '../../types/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  userAvatar?: string;
  userName: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar,
  userAvatar,
  userName
}) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div style={styles.imageContent}>
            <img
              src={message.content}
              alt="Uploaded"
              style={styles.image}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div style={styles.imageFallback}>📷 Изображение</div>
          </div>
        );

      case 'product_suggestion':
        return (
          <div style={styles.productSuggestion}>
            <div style={styles.productIcon}>📦</div>
            <div style={styles.productText}>Предложен товар</div>
          </div>
        );

      case 'system':
        return (
          <div style={styles.systemMessage}>
            {message.content}
          </div>
        );

      default:
        return (
          <div style={styles.textContent}>
            {message.content}
          </div>
        );
    }
  };

  if (message.type === 'system') {
    return (
      <div style={styles.systemContainer}>
        {renderContent()}
      </div>
    );
  }

  return (
    <div style={{
      ...styles.container,
      ...(isOwn ? styles.ownContainer : styles.otherContainer)
    }}>
      {/* Аватар собеседника */}
      {!isOwn && showAvatar && (
        <div style={styles.avatar}>
          {userAvatar ? (
            <img src={userAvatar} alt="Avatar" style={styles.avatarImage} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Сообщение */}
      <div style={styles.messageWrapper}>
        {!isOwn && showAvatar && (
          <div style={styles.userName}>{userName}</div>
        )}

        <div style={{
          ...styles.bubble,
          ...(isOwn ? styles.ownBubble : styles.otherBubble)
        }}>
          {renderContent()}
          <div style={styles.time}>
            {formatTime(message.createdAt)}
            {isOwn && (
              <span style={styles.readStatus}>
                {message.read ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Пустое место для выравнивания */}
      {isOwn && <div style={styles.avatarSpacer} />}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    marginBottom: '8px',
    padding: '0 16px',
  },
  ownContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginRight: '8px',
    alignSelf: 'flex-end',
  },
  avatarImage: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
  },
  avatarPlaceholder: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#0088cc',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  avatarSpacer: {
    width: '32px',
    marginLeft: '8px',
  },
  messageWrapper: {
    maxWidth: '70%',
  },
  userName: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '2px',
    marginLeft: '8px',
  },
  bubble: {
    padding: '12px 16px',
    borderRadius: '18px',
    position: 'relative' as const,
  },
  ownBubble: {
    backgroundColor: '#0088cc',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    borderBottomLeftRadius: '4px',
  },
  textContent: {
    fontSize: '14px',
    lineHeight: 1.4,
    wordWrap: 'break-word' as const,
  },
  imageContent: {
    position: 'relative' as const,
  },
  image: {
    maxWidth: '200px',
    maxHeight: '200px',
    borderRadius: '12px',
  },
  imageFallback: {
    padding: '20px',
    textAlign: 'center' as const,
    color: '#666',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
  },
  productSuggestion: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
  },
  productIcon: {
    fontSize: '16px',
  },
  productText: {
    fontSize: '14px',
    fontWeight: 500,
  },
  systemContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '8px 16px',
  },
  systemMessage: {
    fontSize: '12px',
    color: '#666',
    backgroundColor: '#f8f9fa',
    padding: '4px 12px',
    borderRadius: '12px',
    textAlign: 'center' as const,
  },
  time: {
    fontSize: '11px',
    opacity: 0.7,
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  readStatus: {
    fontSize: '10px',
  },
};