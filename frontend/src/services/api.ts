const API_BASE = 'http://localhost:3001/api'

export const authApi = {
  telegramAuth: async (initData: string) => {
    const response = await fetch(`${API_BASE}/auth/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    })
    return response.json()
  },

  updateProfile: async (userId: string, tradeName: string) => {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tradeName }),
    })
    return response.json()
  }
}