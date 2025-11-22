export interface Product {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  price: number;
  category: string;
  type: 'sell' | 'buy';
  status: 'active' | 'sold' | 'inactive';
  moderationStatus: 'pending' | 'approved' | 'rejected';
  images: string[];
  createdAt: Date;
}

export interface CreateProductRequest {
  sellerId: number;
  title: string;
  description: string;
  price: number;
  category: string;
  type: 'sell' | 'buy';
  images: string[];
}

export interface ProductWithSeller extends Product {
  seller: {
    id: number;
    tradeName: string;
    rating: number;
    trustLevel: string;
  };
}