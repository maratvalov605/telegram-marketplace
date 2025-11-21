const API_BASE = 'http://localhost:3001';

export const api = {
  async auth(initData: string) {
    const res = await fetch(`${API_BASE}/auth/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': initData,
      },
    });
    if (!res.ok) throw new Error('Auth failed');
    return res;
  },

  async getProfile(initData: string) {
    const res = await fetch(`${API_BASE}/users/me`, {
      headers: { 'X-Telegram-Init-Data': initData },
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateTradeName(initData: string, tradeName: string) {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Telegram-Init-Data': initData,
      },
      body: JSON.stringify({ tradeName }),
    });
    if (!res.ok) throw new Error('Failed to update trade name');
    return res.json();
  },
};