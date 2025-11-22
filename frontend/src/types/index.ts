export interface Product {
  product_id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  type: 'sell' | 'buy';
  status: 'active' | 'sold' | 'inactive';
  images: string[];
  created_at?: string;
  updated_at?: string;
}

export interface GetProductsParams {
  limit?: number;
  offset?: number;
  category?: string;
  type?: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  type: 'sell' | 'buy';
  images?: string[];
}

export interface User {
  user_id: number;
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  created_at: string;
}