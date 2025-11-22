import { useState, useEffect, useCallback } from 'react';
import { Product, SearchFilters, SearchState } from '../types/types';
import { productService } from '../services/productService';

export const useSearch = (initialProducts: Product[] = []) => {
  const [searchState, setSearchState] = useState<SearchState>({
    filters: {
      query: '',
      category: '',
      minPrice: null,
      maxPrice: null,
      type: 'all',
      sortBy: 'newest'
    },
    results: initialProducts,
    loading: false,
    hasMore: true
  });

  // Функция применения фильтров
  const applyFilters = useCallback(async (filters: SearchFilters) => {
    setSearchState(prev => ({ ...prev, loading: true }));

    try {
      let filteredProducts = [...initialProducts];

      // Фильтрация по поисковому запросу
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }

      // Фильтрация по типу
      if (filters.type !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.type === filters.type);
      }

      // Фильтрация по категории
      if (filters.category) {
        filteredProducts = filteredProducts.filter(product => product.category === filters.category);
      }

      // Фильтрация по цене
      if (filters.minPrice !== null) {
        filteredProducts = filteredProducts.filter(product => product.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== null) {
        filteredProducts = filteredProducts.filter(product => product.price <= filters.maxPrice!);
      }

      // Сортировка
      filteredProducts.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'rating':
            return (b.seller.rating || 0) - (a.seller.rating || 0);
          case 'newest':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      setSearchState(prev => ({
        ...prev,
        results: filteredProducts,
        filters,
        loading: false
      }));

    } catch (error) {
      console.error('Error applying filters:', error);
      setSearchState(prev => ({ ...prev, loading: false }));
    }
  }, [initialProducts]);

  // Обновление результатов при изменении initialProducts
  useEffect(() => {
    applyFilters(searchState.filters);
  }, [initialProducts, applyFilters]);

  const updateFilters = (newFilters: SearchFilters) => {
    applyFilters(newFilters);
  };

  const searchProducts = (query: string) => {
    const newFilters = { ...searchState.filters, query };
    applyFilters(newFilters);
  };

  return {
    searchState,
    updateFilters,
    searchProducts,
    applyFilters
  };
};