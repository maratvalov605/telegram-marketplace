import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { api } from '../services/api';

export default function Profile() {
  const { initData, ready } = useTelegram();
  const [tradeName, setTradeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready || !initData) return;

    const loadProfile = async () => {
      try {
        const profile = await api.getProfile(initData);
        setTradeName(profile.tradeName);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [initData, ready]);

  const handleSave = async () => {
    if (!initData || saving) return;
    setSaving(true);
    try {
      await api.updateTradeName(initData, tradeName);
      alert('✅ Псевдоним обновлён');
    } catch (e: any) {
      alert('❌ Ошибка: ' + (e.message || 'неизвестно'));
    } finally {
      setSaving(false);
    }
  };

  if (!ready) return <div>Загрузка...</div>;
  if (loading) return <div>Загрузка профиля...</div>;

  return (
    <div className="min-h-screen bg-white p-4">
      <header className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-blue-600">
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Профиль</h2>
        <div></div>
      </header>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ваше торговое имя
          </label>
          <input
            type="text"
            value={tradeName}
            onChange={e => setTradeName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Например: НадежныйПродавец_042"
          />
          <p className="text-xs text-gray-500 mt-1">
            Можно использовать буквы, цифры, _, # и -
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            saving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}