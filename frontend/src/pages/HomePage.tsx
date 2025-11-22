import React from 'react';
import { Product, ProductTypeFilter } from '../types/types';
import { ProductCard } from '../components/Product/ProductCard';

interface HomePageProps {
  products: Product[];
  productTypeFilter: ProductTypeFilter;
  onBuyProduct: (productId: number) => void;
  onFilterChange: (filter: ProductTypeFilter) => void;
  onRefresh?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  productTypeFilter,
  onBuyProduct,
  onFilterChange,
  onRefresh
}) => {
  const filteredProducts = products.filter(product =>
    productTypeFilter === 'all' || product.type === productTypeFilter
  );

  const getEmptyStateText = () => {
    switch (productTypeFilter) {
      case 'sell':
        return 'Нет товаров для продажи';
      case 'buy':
        return 'Нет запросов на покупку';
      default:
        return 'Пока нет товаров';
    }
  };

  const getEmptyStateSubtext = () => {
    switch (productTypeFilter) {
      case 'sell':
        return 'Будьте первым, кто предложит товар!';
      case 'buy':
        return 'Создайте запрос на покупку первым!';
      default:
        return 'Будьте первым, кто добавит объявление!';
    }
  };

  return (
    <div style={styles.container}>
      {/* Search Bar */}
      <div style={styles.searchBar}>
        <div style={styles.searchRow}>
          <div style={styles.searchInput}>
            <span style={styles.searchIcon}>🔍</span>
            <span style={styles.searchText}>Поиск товаров...</span>
          </div>
          {onRefresh && (
            <button
              style={styles.refreshButton}
              onClick={onRefresh}
              title="Обновить"
            >
              🔄
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(productTypeFilter === 'all' ? styles.activeTab : {})
            }}
            onClick={() => onFilterChange('all')}
          >
            Все
          </button>
          <button
            style={{
              ...styles.tab,
              ...(productTypeFilter === 'sell' ? styles.activeTab : {})
            }}
            onClick={() => onFilterChange('sell')}
          >
            Продам
          </button>
          <button
            style={{
              ...styles.tab,
              ...(productTypeFilter === 'buy' ? styles.activeTab : {})
            }}
            onClick={() => onFilterChange('buy')}
          >
            Куплю
          </button>
        </div>
      </div>

      {/* Products List */}
      <div style={styles.content}>
        {/* Products Count */}
        <div style={styles.productsCount}>
          Найдено объявлений: {filteredProducts.length}
        </div>

        {/* Products Grid */}
        <div style={styles.productsList}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onBuy={onBuyProduct}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <div style={styles.emptyText}>{getEmptyStateText()}</div>
            <div style={styles.emptySubtext}>{getEmptyStateSubtext()}</div>
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <div style={styles.loadMore}>
            <button
              style={styles.loadMoreButton}
              onClick={() => console.log('Load more...')}
            >
              Показать еще...
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingBottom: '60px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },

  searchBar: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '16px',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },

  searchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  searchInput: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '20px',
    fontSize: '14px',
    color: '#888',
    cursor: 'pointer',
  },

  searchIcon: {
    fontSize: '16px',
  },

  searchText: {
    flex: 1,
  },

  refreshButton: {
    padding: '10px',
    border: 'none',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    minWidth: '40px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },

  tabsContainer: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    padding: '0 16px',
  },

  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '8px 0',
  },

  tab: {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },

  activeTab: {
    backgroundColor: '#0088cc',
    color: 'white',
  },

  content: {
    padding: '16px',
  },

  productsCount: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    padding: '0 4px',
  },

  productsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#666',
  },

  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    opacity: 0.5,
  },

  emptyText: {
    fontSize: '18px',
    marginBottom: '8px',
    fontWeight: 600,
  },

  emptySubtext: {
    fontSize: '14px',
    lineHeight: 1.4,
  },

  loadMore: {
    textAlign: 'center' as const,
    marginTop: '24px',
    padding: '16px 0',
  },

  loadMoreButton: {
    padding: '14px 32px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    color: '#333',
    transition: 'background-color 0.2s',
  },
};

// Добавляем hover эффекты
const hoverStyles = `
  .refreshButton:hover {
    background-color: #e0e0e0 !important;
  }
  
  .tab:hover:not(.activeTab) {
    background-color: #f5f5f5 !important;
  }
  
  .loadMoreButton:hover {
    background-color: #e0e0e0 !important;
  }
`;

// Вставляем стили в документ
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = hoverStyles;
  document.head.appendChild(styleSheet);
}

export default HomePage;