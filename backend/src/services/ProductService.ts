import { Product, GetProductsParams, CreateProductRequest } from '../types';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getProducts = async (params: GetProductsParams): Promise<{ products: Product[]; total: number }> => {
  const queryParams = new URLSearchParams({
    limit: params.limit?.toString() || '20',
    offset: params.offset?.toString() || '0'
  });

  if (params.category) queryParams.append('category', params.category);
  if (params.type) queryParams.append('type', params.type);

  const response = await fetch(`${API_BASE_URL}/api/products?${queryParams}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const createProduct = async (productData: CreateProductRequest): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};