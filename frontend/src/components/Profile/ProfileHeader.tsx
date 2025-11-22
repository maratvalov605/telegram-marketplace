import React from 'react';
import { User } from '../../types/types';

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEdit }) => {
  return (
    <div style={styles.header}>
      <div style={styles.avatarSection}>
        <div style={styles.avatar}>
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" style={styles.avatarImage} />
          ) : (
            <span style={styles.avatarPlaceholder}>👤</span>
          )}
        </div>
        <button style={styles.editButton} onClick={onEdit}>
          ✏️
        </button>
      </div>

      <div style={styles.infoSection}>
        <h1 style={styles.tradeName}>{user.tradeName}</h1>
        <div style={styles.rating}>
          ⭐ Рейтинг: {user.rating} ({user.successfulOrders} отзывов)
        </div>
        <div style={styles.trustLevel}>
          🛡️ Уровень: {user.trustLevel}
        </div>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e0e0e0',
  },
  avatarSection: {
    position: 'relative',
    marginRight: '16px',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  avatarPlaceholder: {
    fontSize: '32px',
  },
  editButton: {
    position: 'absolute' as const,
    bottom: '-4px',
    right: '-4px',
    backgroundColor: '#0088cc',
    border: '2px solid white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    cursor: 'pointer',
  },
  infoSection: {
    flex: 1,
  },
  tradeName: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  rating: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '4px',
  },
  trustLevel: {
    fontSize: '14px',
    color: '#666',
  },
};