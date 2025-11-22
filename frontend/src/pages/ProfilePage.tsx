import React from 'react';
import { User } from '../types/types';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { StatsGrid } from '../components/Profile/StatsGrid';

interface ProfilePageProps {
  user: User;
  onEditProfile: () => void;
  onCreateAd: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onEditProfile,
  onCreateAd
}) => {
  const menuItems = [
    { icon: '📦', label: 'Мои объявления (12)', action: () => console.log('Go to ads') },
    { icon: '💬', label: 'Отзывы (127)', action: () => console.log('Go to reviews') },
  ];

  return (
    <div style={styles.container}>
      <ProfileHeader user={user} onEdit={onEditProfile} />
      <StatsGrid
        successfulOrders={user.successfulOrders}
        totalOrders={user.totalOrders}
        createdAt={user.createdAt}
      />

      <div style={styles.menu}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            style={styles.menuItem}
            onClick={item.action}
          >
            <span style={styles.menuIcon}>{item.icon}</span>
            <span style={styles.menuLabel}>{item.label}</span>
            <span style={styles.menuArrow}>➡</span>
          </button>
        ))}
      </div>

      <button style={styles.createButton} onClick={onCreateAd}>
        📝 Создать объявление
      </button>
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '60px',
  },
  menu: {
    padding: '16px 0',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '16px',
    border: 'none',
    backgroundColor: 'transparent',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
  },
  menuIcon: {
    fontSize: '18px',
    marginRight: '12px',
  },
  menuLabel: {
    flex: 1,
    textAlign: 'left' as const,
    fontSize: '16px',
  },
  menuArrow: {
    color: '#999',
  },
  createButton: {
    width: 'calc(100% - 32px)',
    margin: '16px',
    padding: '16px',
    backgroundColor: '#0088cc',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};