import { Product, CreateProductRequest, ProductWithSeller } from '../models/Product';
import { UserService } from './UserService';

const userService = new UserService();

// Временное хранилище
const products: Map<number, Product> = new Map();
let nextProductId = 1;

export class ProductService {
  async createProduct(productData: CreateProductRequest): Promise<Product> {
    const product: Product = {
      id: nextProductId++,
      ...productData,
      status: 'active',
      moderationStatus: 'approved', // Пока автоматически одобряем
      createdAt: new Date(),
    };

    products.set(product.id, product);
    return product;
  }

  async getProducts(
    type?: 'sell' | 'buy',
    limit: number = 20,
    offset: number = 0
  ): Promise<ProductWithSeller[]> {
    let productList = Array.from(products.values())
      .filter(product => product.status === 'active' && product.moderationStatus === 'approved');

    if (type) {
      productList = productList.filter(product => product.type === type);
    }

    // Сортируем по дате создания (новые сначала)
    productList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const paginatedProducts = productList.slice(offset, offset + limit);

    // Добавляем информацию о продавце
    const productsWithSellers: ProductWithSeller[] = [];

    for (const product of paginatedProducts) {
      const seller = await userService.findById(product.sellerId);

      if (seller) {
        productsWithSellers.push({
          ...product,
          seller: {
            id: seller.id,
            tradeName: seller.tradeName,
            rating: seller.rating,
            trustLevel: seller.trustLevel,
          },
        });
      }
    }

    return productsWithSellers;
  }

  async getProductById(id: number): Promise<ProductWithSeller | null> {
    const product = products.get(id);

    if (!product) {
      return null;
    }

    const seller = await userService.findById(product.sellerId);

    if (!seller) {
      return null;
    }

    return {
      ...product,
      seller: {
        id: seller.id,
        tradeName: seller.tradeName,
        rating: seller.rating,
        trustLevel: seller.trustLevel,
      },
    };
  }

  async getUserProducts(userId: number): Promise<Product[]> {
    return Array.from(products.values())
      .filter(product => product.sellerId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async deleteProduct(productId: number, userId: number): Promise<boolean> {
    const product = products.get(productId);

    if (!product || product.sellerId !== userId) {
      return false;
    }

    products.delete(productId);
    return true;
  }
}