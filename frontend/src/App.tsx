import { useTelegramAuth } from './hooks/useTelegramAuth'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import './App.css'

function App() {
  const { user, isLoading, currentPage, navigateTo } = useTelegramAuth()

  if (isLoading) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="container">
      {currentPage === 'home' && (
        <HomePage user={user} onNavigate={navigateTo} />
      )}
      {currentPage === 'profile' && (
        <ProfilePage user={user} onNavigate={navigateTo} />
      )}
    </div>
  )
}

export default App