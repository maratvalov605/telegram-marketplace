import { useState, useEffect } from 'react'
import { authApi } from '../services/api'

declare global {
  interface Window {
    Telegram: any
  }
}

export const useTelegramAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    initAuth()
  }, [])

  const initAuth = async () => {
    try {
      const tg = window.Telegram.WebApp
      tg.expand()

      const initData = tg.initData
      const userData = await authApi.telegramAuth(initData)

      setUser(userData.user)
    } catch (error) {
      console.error('Auth failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const navigateTo = (page: string) => {
    setCurrentPage(page)
  }

  return { user, isLoading, currentPage, navigateTo }
}