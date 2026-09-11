import AppError from '../utils/AppError.js';
import * as cartRepo from '../repositories/cartRepository.js';
import prisma from '../config/prismaClient.js';

/**
 * Get the user's cart, creating one if it doesn't exist.
 */
export const getCart = async (userId) => {
  const cart = await cartRepo.getOrCreateCart(userId);
  return enrichCart(cart);
};

/**
 * Add an item to the cart.
 */
export const addItem = async (userId, { productId, variantId, quantity = 1 }) => {
  if (!productId) throw new AppError('productId is required.', 400);
  if (quantity < 1) throw new AppError('Quantity must be at least 1.', 400);

  // Verify product exists
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError('Product not found.', 404);

  // Verify variant if provided, and check inventory
  if (variantId) {
    const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!variant || variant.productId !== productId) {
      throw new AppError('Variant not found for this product.', 404);
    }
    if (variant.inventory < quantity) {
      throw new AppError(`Only ${variant.inventory} items left in stock.`, 400);
    }
  }

  const cart = await cartRepo.getOrCreateCart(userId);
  await cartRepo.upsertCartItem(cart.id, productId, variantId ?? null, quantity);

  return getCart(userId);
};

/**
 * Update the quantity of a cart item.
 */
export const updateItem = async (userId, itemId, { quantity }) => {
  if (quantity < 1) throw new AppError('Quantity must be at least 1.', 400);

  const cart = await cartRepo.getCartByUserId(userId);
  if (!cart) throw new AppError('Cart not found.', 404);

  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw new AppError('Cart item not found.', 404);

  await cartRepo.updateCartItemQuantity(itemId, quantity);
  return getCart(userId);
};

/**
 * Remove an item from the cart.
 */
export const removeItem = async (userId, itemId) => {
  const cart = await cartRepo.getCartByUserId(userId);
  if (!cart) throw new AppError('Cart not found.', 404);

  const item = cart.items.find((i) => i.id === itemId);
  if (!item) throw new AppError('Cart item not found.', 404);

  await cartRepo.deleteCartItem(itemId);
  return getCart(userId);
};

/**
 * Add computed totals to cart for client consumption.
 */
const enrichCart = (cart) => {
  const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return { ...cart, subtotal: parseFloat(subtotal.toFixed(2)), itemCount };
};
