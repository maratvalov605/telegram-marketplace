import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

router.post('/products', productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProduct);
router.get('/users/:userId/products', productController.getUserProducts);
router.delete('/products/:id', productController.deleteProduct);

export default router;