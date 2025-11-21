import React, { useState } from 'react'
import { authApi } from '../services/api'

interface ProfilePageProps {
  user: any
  onNavigate: (page: string) => void
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigate }) => {
  const [tradeName, setTradeName] = useState(user?.tradeName || '')
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async () => {
    try {
      await authApi.updateProfile(user.id, tradeName)
      setIsEditing(false)
      window.location.reload() // Простой способ обновить данные
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return (
    <div>
      <button
        onClick={() => onNavigate('home')}
        style={{ marginBottom: '20px', background: 'none', border: 'none', color: 'var(--tg-theme-link-color, #2481cc)' }}
      >
        ← Назад
      </button>

      <h2>👤 Мой профиль</h2>

      <div style={{ marginTop: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Trade Name:</label>

        {isEditing ? (
          <div>
            <input
              type="text"
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid var(--tg-theme-hint-color, #999)',
                borderRadius: '5px',
                width: '100%',
                marginBottom: '10px'
              }}
            />
            <button onClick={handleSave} style={{ marginRight: '10px' }}>Сохранить</button>
            <button onClick={() => setIsEditing(false)}>Отмена</button>
          </div>
        ) : (
          <div>
            <p style={{ padding: '10px', background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)', borderRadius: '5px' }}>
              {user?.tradeName}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              style={{ marginTop: '10px' }}
            >
              Изменить
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)', borderRadius: '10px' }}>
        <p><strong>Telegram ID:</strong> {user?.telegramId}</p>
        <p><strong>Зарегистрирован:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default ProfilePage