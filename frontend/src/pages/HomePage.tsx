import React from 'react'

interface HomePageProps {
  user: any
  onNavigate: (page: string) => void
}

const HomePage: React.FC<HomePageProps> = ({ user, onNavigate }) => {
  return (
    <div>
      <h1>🛍️ Telegram Marketplace</h1>
      <p>Добро пожаловать в анонимный маркетплейс!</p>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => onNavigate('profile')}
          style={{
            padding: '10px 20px',
            background: 'var(--tg-theme-button-color, #2481cc)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
            border: 'none',
            borderRadius: '10px',
            width: '100%'
          }}
        >
          Мой профиль
        </button>
      </div>

      {user && (
        <div style={{ marginTop: '20px', padding: '15px', background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)', borderRadius: '10px' }}>
          <p>Ваш ID: {user.telegramId}</p>
          <p>Trade Name: {user.tradeName}</p>
        </div>
      )}
    </div>
  )
}

export default HomePage