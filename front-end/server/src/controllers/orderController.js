import catchAsync from '../utils/catchAsync.js';
import * as orderService from '../services/orderService.js';

/**
 * POST /api/v1/orders
 */
export const placeOrderHandler = catchAsync(async (req, res) => {
  const order = await orderService.placeOrder(req.user.id, req.body);
  res.status(201).json({ status: 'success', data: { order } });
});

/**
 * GET /api/v1/orders
 */
export const getOrdersHandler = catchAsync(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);
  res.status(200).json({ status: 'success', data: orders });
});

/**
 * GET /api/v1/orders/:id
 */
export const getOrderHandler = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.user.id, req.params.id, req.user.role);
  res.status(200).json({ status: 'success', data: { order } });
});
