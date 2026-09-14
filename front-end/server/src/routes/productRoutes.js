import { Router } from 'express';
import {
  getProductsHandler,
  getProductBySlugHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router
  .route('/')
  .get(getProductsHandler)
  .post(protect, restrictTo('admin'), createProductHandler);

router.get('/:slug', getProductBySlugHandler);

router
  .route('/id/:id')
  .put(protect, restrictTo('admin'), updateProductHandler)
  .delete(protect, restrictTo('admin'), deleteProductHandler);

export default router;
