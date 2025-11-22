import React from 'react';
import { SearchHeader } from '../components/Search/SearchHeader';
import { ProductCard } from '../components/Product/ProductCard';
import { SearchState, SearchFilters } from '../types/types';

interface SearchPageProps {
  searchState: SearchState;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: (query: string) => void;
  onBuyProduct: (productId: number) => void;
  onBack: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  searchState,
  onFiltersChange,
  onSearch,
  onBuyProduct,
  onBack
}) => {
  const { results, loading, filters } = searchState;

  return (
    <div style={styles.container}>
      {/* Search Header */}
      <SearchHeader
        filters={filters}
        onFiltersChange={onFiltersChange}
        onSearch={onSearch}
      />

      {/* Results */}
      <div style={styles.content}>
        {/* Results Info */}
        <div style={styles.resultsInfo}>
          <div style={styles.resultsCount}>
            Найдено: {results.length} объявлений
          </div>
          {filters.query && (
            <div style={styles.searchQuery}>
              По запросу: "{filters.query}"
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={styles.loading}>
            <div style={styles.loadingSpinner}>⏳</div>
            <div style={styles.loadingText}>Поиск...</div>
          </div>
        )}

        {/* Results List */}
        {!loading && (
          <div style={styles.resultsList}>
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={onBuyProduct}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <div style={styles.emptyText}>
              {filters.query ? 'Ничего не найдено' : 'Нет товаров по выбранным фильтрам'}
            </div>
            <div style={styles.emptySubtext}>
              {filters.query
                ? 'Попробуйте изменить поисковый запрос или фильтры'
                : 'Попробуйте изменить параметры фильтрации'
              }
            </div>
            <button
              style={styles.backButton}
              onClick={onBack}
            >
              Назад к товарам
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
  content: {
    padding: '16px',
  },
  resultsInfo: {
    marginBottom: '16px',
    padding: '12px 16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  resultsCount: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
    marginBottom: '4px',
  },
  searchQuery: {
    fontSize: '12px',
    color: '#666',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '40px 20px',
  },
  loadingSpinner: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  loadingText: {
    fontSize: '14px',
    color: '#666',
  },
  resultsList: {
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
    marginBottom: '24px',
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