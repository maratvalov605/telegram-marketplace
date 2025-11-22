import React, { useState } from 'react';
import { SearchFilters } from '../../types/types';

interface SearchHeaderProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: (query: string) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  filters,
  onFiltersChange,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.query);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: '', name: 'Все категории' },
    { id: 'Электроника', name: 'Электроника' },
    { id: 'Одежда и обувь', name: 'Одежда и обувь' },
    { id: 'Дом и сад', name: 'Дом и сад' },
    { id: 'Автотовары', name: 'Автотовары' },
    { id: 'Красота и здоровье', name: 'Красота и здоровье' },
    { id: 'Спорт и отдых', name: 'Спорт и отдых' },
    { id: 'Игры и хобби', name: 'Игры и хобби' },
    { id: 'Книги', name: 'Книги' },
    { id: 'Другое', name: 'Другое' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onFiltersChange({ ...filters, query: searchQuery });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      category: '',
      minPrice: null,
      maxPrice: null,
      type: 'all',
      sortBy: 'newest'
    };
    onFiltersChange(clearedFilters);
    setSearchQuery('');
  };

  return (
    <div style={styles.container}>
      {/* Search Bar */}
      <div style={styles.searchBar}>
        <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
          <div style={styles.searchInputContainer}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск товаров..."
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>
              🔍
            </button>
          </div>
        </form>

        <button
          style={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
        >
          ⚙️
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={styles.filtersPanel}>
          <div style={styles.filtersHeader}>
            <h3 style={styles.filtersTitle}>Фильтры</h3>
            <button style={styles.clearButton} onClick={clearFilters}>
              Сбросить
            </button>
          </div>

          {/* Type Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Тип объявления</label>
            <div style={styles.typeButtons}>
              <button
                type="button"
                style={{
                  ...styles.typeButton,
                  ...(filters.type === 'all' ? styles.activeTypeButton : {})
                }}
                onClick={() => handleFilterChange('type', 'all')}
              >
                Все
              </button>
              <button
                type="button"
                style={{
                  ...styles.typeButton,
                  ...(filters.type === 'sell' ? styles.activeTypeButton : {})
                }}
                onClick={() => handleFilterChange('type', 'sell')}
              >
                Продам
              </button>
              <button
                type="button"
                style={{
                  ...styles.typeButton,
                  ...(filters.type === 'buy' ? styles.activeTypeButton : {})
                }}
                onClick={() => handleFilterChange('type', 'buy')}
              >
                Куплю
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Категория</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={styles.select}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Цена, ₽</label>
            <div style={styles.priceInputs}>
              <input
                type="number"
                placeholder="От"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : null)}
                style={styles.priceInput}
              />
              <span style={styles.priceSeparator}>—</span>
              <input
                type="number"
                placeholder="До"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : null)}
                style={styles.priceInput}
              />
            </div>
          </div>

          {/* Sort Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Сортировка</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              style={styles.select}
            >
              <option value="newest">Сначала новые</option>
              <option value="price_asc">Цена по возрастанию</option>
              <option value="price_desc">Цена по убыванию</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>

          {/* Active Filters */}
          {(filters.category || filters.minPrice !== null || filters.maxPrice !== null || filters.type !== 'all') && (
            <div style={styles.activeFilters}>
              <div style={styles.activeFiltersLabel}>Активные фильтры:</div>
              <div style={styles.activeFiltersList}>
                {filters.type !== 'all' && (
                  <span style={styles.activeFilter}>
                    {filters.type === 'sell' ? 'Продам' : 'Куплю'}
                  </span>
                )}
                {filters.category && (
                  <span style={styles.activeFilter}>
                    {categories.find(c => c.id === filters.category)?.name}
                  </span>
                )}
                {(filters.minPrice !== null || filters.maxPrice !== null) && (
                  <span style={styles.activeFilter}>
                    {filters.minPrice || 0}₽ — {filters.maxPrice || '∞'}₽
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
  },
  searchForm: {
    flex: 1,
  },
  searchInputContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: '12px 16px',
    fontSize: '14px',
    outline: 'none',
  },
  searchButton: {
    border: 'none',
    background: 'transparent',
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  filterButton: {
    border: 'none',
    background: '#f0f0f0',
    padding: '10px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    minWidth: '40px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersPanel: {
    padding: '16px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  filtersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  filtersTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
  },
  clearButton: {
    border: 'none',
    background: 'transparent',
    color: '#0088cc',
    cursor: 'pointer',
    fontSize: '14px',
  },
  filterGroup: {
    marginBottom: '16px',
  },
  filterLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '8px',
    color: '#333',
  },
  typeButtons: {
    display: 'flex',
    gap: '8px',
  },
  typeButton: {
    flex: 1,
    padding: '10px 0',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
  },
  activeTypeButton: {
    borderColor: '#0088cc',
    backgroundColor: '#0088cc',
    color: 'white',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  priceInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  priceInput: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
  },
  priceSeparator: {
    color: '#666',
    fontSize: '14px',
  },
  activeFilters: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  activeFiltersLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px',
  },
  activeFiltersList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  activeFilter: {
    padding: '4px 8px',
    backgroundColor: '#0088cc',
    color: 'white',
    borderRadius: '12px',
    fontSize: '12px',
  },
};