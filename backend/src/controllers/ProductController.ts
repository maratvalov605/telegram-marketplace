import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { CreateProductRequest } from '../models/Product';

const productService = new ProductService();

export class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const productData: CreateProductRequest = req.body;

      // Валидация
      if (!productData.title || !productData.price || !productData.category) {
        return res.status(400).json({
          error: 'title, price, and category are required'
        });
      }

      if (productData.price <= 0) {
        return res.status(400).json({
          error: 'price must be positive'
        });
      }

      const product = await productService.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error in createProduct:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProducts(req: Request, res: Response) {
    try {
      const { type, limit = '20', offset = '0' } = req.query;

      const products = await productService.getProducts(
        type as 'sell' | 'buy',
        Number(limit),
        Number(offset)
      );

      res.json(products);
    } catch (error) {
      console.error('Error in getProducts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product = await productService.getProductById(Number(id));

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      console.error('Error in getProduct:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserProducts(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const products = await productService.getUserProducts(Number(userId));
      res.json(products);
    } catch (error) {
      console.error('Error in getUserProducts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const success = await productService.deleteProduct(Number(id), Number(userId));

      if (!success) {
        return res.status(404).json({ error: 'Product not found or access denied' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}