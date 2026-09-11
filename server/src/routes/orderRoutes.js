import { Router } from 'express';
import { placeOrderHandler, getOrdersHandler, getOrderHandler } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.route('/').post(placeOrderHandler).get(getOrdersHandler);

router.get('/:id', getOrderHandler);

export default router;
