import React from 'react';

interface BottomNavProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Главная' },
    { id: 'search', icon: '🔍', label: 'Поиск' },
    { id: 'create', icon: '✏️', label: 'Создать' },
    { id: 'chats', icon: '💬', label: 'Чаты' },
    { id: 'profile', icon: '👤', label: 'Профиль' },
  ];

  return (
    <div style={styles.navContainer}>
      {navItems.map((item) => (
        <button
          key={item.id}
          style={{
            ...styles.navButton,
            ...(currentPage === item.id ? styles.activeButton : {})
          }}
          onClick={() => onPageChange(item.id)}
        >
          <span style={styles.navIcon}>{item.icon}</span>
          <span style={styles.navLabel}>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

const styles = {
  navContainer: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    backgroundColor: '#fff',
    borderTop: '1px solid #e0e0e0',
    padding: '8px 0',
    zIndex: 1000,
  },
  navButton: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    border: 'none',
    background: 'transparent',
    padding: '4px 0',
    cursor: 'pointer',
  },
  activeButton: {
    color: '#0088cc',
  },
  navIcon: {
    fontSize: '20px',
    marginBottom: '2px',
  },
  navLabel: {
    fontSize: '10px',
    fontWeight: 500,
  },
};