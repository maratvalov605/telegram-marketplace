export interface User {
  id: number;
  telegramId: number;
  tradeName: string;
  rating: number;
  trustLevel: string;
  successfulOrders: number;
  totalOrders: number;
  createdAt: string;
  avatar?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  type: 'sell' | 'buy';
  status: string;
  images: string[];
  createdAt: string;
  seller: User;
}

// Добавляем новый тип для табов
export type ProductTypeFilter = 'all' | 'sell' | 'buy';

// Обновляем интерфейс состояния
export interface AppState {
  user: User | null;
  products: Product[];
  currentPage: 'home' | 'search' | 'create' | 'chats' | 'profile';
  productTypeFilter: ProductTypeFilter;
}

// Добавляем новые типы
export interface CreateProductRequest {
  sellerId: number;
  title: string;
  description: string;
  price: number;
  category: string;
  type: 'sell' | 'buy';
  images: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

// Добавляем типы для поиска и фильтров
export interface SearchFilters {
  query: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  type: 'all' | 'sell' | 'buy';
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'rating';
}

export interface SearchState {
  filters: SearchFilters;
  results: Product[];
  loading: boolean;
  hasMore: boolean;
}

// Добавляем типы для чатов
export interface Chat {
  id: string;
  productId: number;
  buyerId: number;
  sellerId: number;
  product?: Product; // Информация о товаре
  otherUser: User;   // Собеседник
  lastMessage?: Message;
  unreadCount: number;
  status: 'active' | 'closed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: number;
  type: 'text' | 'image' | 'product_suggestion' | 'system';
  content: string;
  productId?: number;
  read: boolean;
  createdAt: string;
}

export interface CreateChatRequest {
  productId: number;
  buyerId: number;
  sellerId: number;
  initialMessage?: string;
}

export interface SendMessageRequest {
  chatId: string;
  senderId: number;
  type: 'text' | 'image' | 'product_suggestion';
  content: string;
  productId?: number;
}

export interface ChatsState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}