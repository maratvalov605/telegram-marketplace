import { Product, CreateProductRequest } from '../types/types';

const API_BASE_URL = 'http://localhost:3001/api';

export const productService = {
  async getProducts(type?: 'sell' | 'buy', limit: number = 20, offset: number = 0): Promise<Product[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await fetch(`${API_BASE_URL}/products?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  },

  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return response.json();
  },

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  },

  async getUserProducts(userId: number): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/products`);

    if (!response.ok) {
      throw new Error('Failed to fetch user products');
    }

    return response.json();
  },


  // Добавляем метод создания продукта (если еще нет)
async createProduct(productData: CreateProductRequest): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return response.json();
}
};