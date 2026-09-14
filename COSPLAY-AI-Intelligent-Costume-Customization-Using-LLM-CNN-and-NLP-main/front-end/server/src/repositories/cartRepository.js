import prisma from '../config/prismaClient.js';

const cartInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          compareAtPrice: true,
          images: true,
        },
      },
      variant: {
        select: { id: true, size: true, color: true, sku: true, inventory: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  },
};

/**
 * Get or create a cart for a user.
 */
export const getOrCreateCart = (userId) =>
  prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: cartInclude,
  });

/**
 * Get cart with items for a user.
 */
export const getCartByUserId = (userId) =>
  prisma.cart.findUnique({ where: { userId }, include: cartInclude });

/**
 * Find a specific cart item.
 */
export const findCartItem = (cartId, productId, variantId) =>
  prisma.cartItem.findUnique({
    where: { cartId_productId_variantId: { cartId, productId, variantId: variantId ?? null } },
  });

/**
 * Add or increment a cart item.
 */
export const upsertCartItem = (cartId, productId, variantId, quantity) =>
  prisma.cartItem.upsert({
    where: { cartId_productId_variantId: { cartId, productId, variantId: variantId ?? null } },
    update: { quantity: { increment: quantity } },
    create: { cartId, productId, variantId: variantId ?? null, quantity },
  });

/**
 * Update quantity of a specific cart item.
 */
export const updateCartItemQuantity = (id, quantity) =>
  prisma.cartItem.update({ where: { id }, data: { quantity } });

/**
 * Delete a specific cart item.
 */
export const deleteCartItem = (id) =>
  prisma.cartItem.delete({ where: { id } });

/**
 * Clear all items from a cart.
 */
export const clearCart = (cartId) =>
  prisma.cartItem.deleteMany({ where: { cartId } });
