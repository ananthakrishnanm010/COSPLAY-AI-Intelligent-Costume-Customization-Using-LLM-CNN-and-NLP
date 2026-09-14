import catchAsync from '../utils/catchAsync.js';
import * as cartService from '../services/cartService.js';

/**
 * GET /api/v1/cart
 */
export const getCartHandler = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  res.status(200).json({ status: 'success', data: { cart } });
});

/**
 * POST /api/v1/cart/items
 * Body: { productId, variantId?, quantity? }
 */
export const addItemHandler = catchAsync(async (req, res) => {
  const cart = await cartService.addItem(req.user.id, req.body);
  res.status(200).json({ status: 'success', data: { cart } });
});

/**
 * PATCH /api/v1/cart/items/:id
 * Body: { quantity }
 */
export const updateItemHandler = catchAsync(async (req, res) => {
  const cart = await cartService.updateItem(req.user.id, req.params.id, req.body);
  res.status(200).json({ status: 'success', data: { cart } });
});

/**
 * DELETE /api/v1/cart/items/:id
 */
export const removeItemHandler = catchAsync(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.id);
  res.status(200).json({ status: 'success', data: { cart } });
});
