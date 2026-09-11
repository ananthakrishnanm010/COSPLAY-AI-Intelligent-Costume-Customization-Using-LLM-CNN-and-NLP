import { Router } from 'express';
import {
  getCartHandler,
  addItemHandler,
  updateItemHandler,
  removeItemHandler,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCartHandler);
router.post('/items', addItemHandler);
router.patch('/items/:id', updateItemHandler);
router.delete('/items/:id', removeItemHandler);

export default router;
