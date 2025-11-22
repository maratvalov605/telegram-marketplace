import React, { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { CreateAdPage } from './pages/CreateAdPage';
import { SearchPage } from './pages/SearchPage';
import { ChatsListPage } from './pages/ChatsListPage';
import { ChatRoomPage } from './pages/ChatRoomPage';
import { BottomNav } from './components/Layout/BottomNav';
import { User, Product, AppState, ProductTypeFilter, CreateProductRequest } from './types/types';
import { userService } from './services/userService';
import { productService } from './services/productService';
import { useSearch } from './hooks/useSearch';
import { useChats } from './hooks/useChats';
import './App.css';

// Mock user для инициализации
const mockUser: User = {
  id: 1,
  telegramId: 123456789,
  tradeName: 'Загрузка...',
  rating: 5.0,
  trustLevel: 'new',
  successfulOrders: 0,
  totalOrders: 0,
  createdAt: new Date().toISOString(),
};

function App() {
  const { user: tgUser } = useTelegram();
  const [appState, setAppState] = useState<AppState>({
    user: mockUser,
    products: [],
    currentPage: 'home',
    productTypeFilter: 'all',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Инициализация поиска и чатов
  const search = useSearch(appState.products);
  const chats = useChats(appState.user?.id || 0);

  // Загрузка пользователя и товаров при старте
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Создаем/получаем пользователя
      let user: User;
      if (tgUser) {
        // Используем реальные данные из Telegram
        user = await userService.findOrCreate({
          telegramId: tgUser.id,
          tradeName: tgUser.username ? `@${tgUser.username}` : `User_${tgUser.id.toString().slice(-4)}`,
        });
      } else {
        // В режиме разработки без Telegram
        user = await userService.findOrCreate({
          telegramId: Date.now(),
          tradeName: 'Dev_User',
        });
      }

      // 2. Загружаем товары
      const products = await productService.getProducts();

      setAppState(prev => ({
        ...prev,
        user,
        products,
      }));

    } catch (err) {
      console.error('Error initializing app:', err);
      setError('Не удалось загрузить данные приложения');
    } finally {
      setLoading(false);
    }
  };

  // Обработчики навигации
  const handlePageChange = (page: string) => {
    setAppState(prev => ({ ...prev, currentPage: page as any }));
  };

  const handleHomeNavigation = () => {
    setAppState(prev => ({ ...prev, currentPage: 'home' }));
  };

  const handleSearchNavigation = () => {
    setAppState(prev => ({ ...prev, currentPage: 'search' }));
  };

  const handleCreateNavigation = () => {
    setAppState(prev => ({ ...prev, currentPage: 'create' }));
  };

  const handleChatsNavigation = () => {
    setAppState(prev => ({ ...prev, currentPage: 'chats' }));
  };

  const handleProfileNavigation = () => {
    setAppState(prev => ({ ...prev, currentPage: 'profile' }));
  };

  // Обработчики для товаров
  const handleBuyProduct = async (productId: number) => {
    try {
      const product = appState.products.find(p => p.id === productId);
      if (product) {
        alert(`Покупка товара: ${product.title}\nЦена: ${product.price}₽\n\nФункция покупки в разработке...`);
      }
    } catch (err) {
      console.error('Error buying product:', err);
      alert('Ошибка при покупке товара');
    }
  };

  const handleFilterChange = async (filter: ProductTypeFilter) => {
    try {
      const products = await productService.getProducts(filter === 'all' ? undefined : filter);
      setAppState(prev => ({
        ...prev,
        productTypeFilter: filter,
        products
      }));
    } catch (err) {
      console.error('Error filtering products:', err);
      alert('Ошибка при загрузке товаров');
    }
  };

  const refreshProducts = async () => {
    try {
      const products = await productService.getProducts(
        appState.productTypeFilter === 'all' ? undefined : appState.productTypeFilter
      );
      setAppState(prev => ({ ...prev, products }));
    } catch (err) {
      console.error('Error refreshing products:', err);
      alert('Ошибка при обновлении списка');
    }
  };

  // Обработчики для профиля
  const handleEditProfile = async () => {
    try {
      const newTradeName = prompt('Введите новое торговое имя:', appState.user?.tradeName);
      if (newTradeName && appState.user) {
        const updatedUser = await userService.updateProfile(
          appState.user.telegramId,
          { tradeName: newTradeName }
        );
        setAppState(prev => ({ ...prev, user: updatedUser }));
        alert('Профиль успешно обновлен!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Ошибка при обновлении профиля');
    }
  };

  const handleCreateAd = () => {
    handleCreateNavigation();
  };

  // Обработчики для создания объявлений
  const handleCreateProduct = async (productData: CreateProductRequest) => {
    try {
      const newProduct = await productService.createProduct(productData);

      // Добавляем новый товар в список
      setAppState(prev => ({
        ...prev,
        products: [newProduct, ...prev.products]
      }));

      alert('✅ Объявление успешно создано!');
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  };

  const handleBackFromCreate = () => {
    handleHomeNavigation();
  };

  // Обработчики для чатов
  const handleOpenChat = async (chat: any) => {
    const stopPolling = await chats.openChat(chat);
    setAppState(prev => ({ ...prev, currentPage: 'chat_room' }));

    // Возвращаем функцию остановки polling для cleanup
    return stopPolling;
  };

  const handleBackFromChats = () => {
    chats.closeChat();
    handleHomeNavigation();
  };

  const handleBackFromChatRoom = () => {
    chats.closeChat();
    handleChatsNavigation();
  };

  const handleSendMessage = async (content: string) => {
    await chats.sendMessage(content);
  };

  // Обновление поиска при изменении продуктов
  useEffect(() => {
    search.applyFilters(search.searchState.filters);
  }, [appState.products]);

  // Рендер текущей страницы
  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case 'home':
        return (
          <HomePage
            products={appState.products}
            productTypeFilter={appState.productTypeFilter}
            onBuyProduct={handleBuyProduct}
            onFilterChange={handleFilterChange}
            onRefresh={refreshProducts}
          />
        );

      case 'search':
        return (
          <SearchPage
            searchState={search.searchState}
            onFiltersChange={search.updateFilters}
            onSearch={search.searchProducts}
            onBuyProduct={handleBuyProduct}
            onBack={handleHomeNavigation}
          />
        );

      case 'create':
        return (
          <CreateAdPage
            userId={appState.user!.id}
            onCreateProduct={handleCreateProduct}
            onBack={handleBackFromCreate}
          />
        );

      case 'chats':
        return (
          <ChatsListPage
            chats={chats.chats}
            loading={chats.loading}
            error={chats.error}
            currentUserId={appState.user!.id}
            onOpenChat={handleOpenChat}
            onRefresh={chats.loadChats}
            onBack={handleBackFromChats}
          />
        );

      case 'chat_room':
        if (!chats.currentChat) {
          return (
            <div style={styles.placeholderPage}>
              <div style={styles.placeholderIcon}>⚠️</div>
              <div style={styles.placeholderTitle}>Чат не найден</div>
              <div style={styles.placeholderText}>Возможно, чат был удален или у вас нет к нему доступа</div>
              <button
                style={styles.backButton}
                onClick={handleBackFromChatRoom}
              >
                Назад к чатам
              </button>
            </div>
          );
        }

        return (
          <ChatRoomPage
            chat={chats.currentChat}
            messages={chats.messages}
            currentUserId={appState.user!.id}
            onSendMessage={handleSendMessage}
            onBack={handleBackFromChatRoom}
            loading={chats.loading}
          />
        );

      case 'profile':
        return (
          <ProfilePage
            user={appState.user!}
            onEditProfile={handleEditProfile}
            onCreateAd={handleCreateAd}
          />
        );

      default:
        return (
          <div style={styles.placeholderPage}>
            <div style={styles.placeholderIcon}>🚧</div>
            <div style={styles.placeholderTitle}>В разработке</div>
            <div style={styles.placeholderText}>Страница скоро будет доступна</div>
            <button
              style={styles.backButton}
              onClick={handleHomeNavigation}
            >
              На главную
            </button>
          </div>
        );
    }
  };

  // Обработчик навигации через bottom nav
  const handleNavigation = (page: string) => {
    switch (page) {
      case 'home':
        handleHomeNavigation();
        break;
      case 'search':
        handleSearchNavigation();
        break;
      case 'create':
        handleCreateNavigation();
        break;
      case 'chats':
        handleChatsNavigation();
        break;
      case 'profile':
        handleProfileNavigation();
        break;
      default:
        handleHomeNavigation();
    }
  };

  // Состояние загрузки
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>🛍️</div>
        <div style={styles.loadingText}>Загрузка маркетплейса...</div>
        <div style={styles.loadingSubtext}>Создаем ваш уникальный опыт</div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <div style={styles.errorText}>{error}</div>
        <div style={styles.errorSubtext}>Проверьте подключение к интернету и обновите страницу</div>
        <button
          style={styles.retryButton}
          onClick={initializeApp}
        >
          Попробовать снова
        </button>
        <button
          style={styles.secondaryButton}
          onClick={() => window.location.reload()}
        >
          Обновить страницу
        </button>
      </div>
    );
  }

  // Основной интерфейс
  return (
    <div className="App">
      {renderCurrentPage()}

      {/* Bottom Navigation - скрываем на страницах чата и создания */}
      {!['chat_room', 'create'].includes(appState.currentPage) && (
        <BottomNav
          currentPage={appState.currentPage}
          onPageChange={handleNavigation}
        />
      )}
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center' as const,
  },
  loadingSpinner: {
    fontSize: '64px',
    marginBottom: '20px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  loadingText: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#333',
    marginBottom: '8px',
  },
  loadingSubtext: {
    fontSize: '14px',
    color: '#666',
  },

  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center' as const,
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  errorText: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#d32f2f',
    marginBottom: '8px',
  },
  errorSubtext: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '24px',
    lineHeight: 1.4,
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: '#0088cc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    marginBottom: '12px',
    width: '200px',
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#0088cc',
    border: '1px solid #0088cc',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    width: '200px',
  },

  placeholderPage: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    textAlign: 'center' as const,
  },
  placeholderIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    opacity: 0.7,
  },
  placeholderTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#333',
    marginBottom: '12px',
  },
  placeholderText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '24px',
    lineHeight: 1.4,
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: '#0088cc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
};

// Добавляем CSS анимацию для лоадера
const loaderStyles = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

// Вставляем стили в документ
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = loaderStyles;
  document.head.appendChild(styleSheet);
}

export default App;