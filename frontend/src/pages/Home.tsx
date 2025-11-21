import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

export default function Home() {
  const { ready, user } = useTelegram();
  const navigate = useNavigate();

  if (!ready) return <div>Загрузка Telegram WebApp...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800">🛒 Анонимный Маркетплейс</h1>
        <p className="text-gray-600">
          Добро пожаловать{user?.first_name ? `, ${user.first_name}` : ''}!
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          👤 Перейти в профиль
        </button>
      </div>
    </div>
  );
}