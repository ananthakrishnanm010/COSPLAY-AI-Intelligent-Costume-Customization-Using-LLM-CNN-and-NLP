import AppError from '../utils/AppError.js';
import * as orderRepo from '../repositories/orderRepository.js';
import * as cartRepo from '../repositories/cartRepository.js';
import prisma from '../config/prismaClient.js';

/**
 * Place a new order from the user's cart.
 */
export const placeOrder = async (userId, { shippingAddress, billingAddress, couponCode, paymentMethod = 'cod' }) => {
  if (!shippingAddress) throw new AppError('Shipping address is required.', 400);

  // Get user's cart
  const cart = await cartRepo.getCartByUserId(userId);
  if (!cart || cart.items.length === 0) {
    throw new AppError('Your cart is empty. Add items before placing an order.', 400);
  }

  // Load full product data for each cart item
  const itemsWithPrices = await Promise.all(
    cart.items.map(async (item) => {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new AppError(`Product ${item.productId} no longer exists.`, 400);
      return { ...item, currentPrice: product.price };
    })
  );

  // Calculate subtotal
  const subtotal = itemsWithPrices.reduce(
    (acc, item) => acc + item.currentPrice * item.quantity,
    0
  );

  // Apply coupon if provided
  let discountAmount = 0;
  let couponId = null;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });

    if (!coupon) throw new AppError('Invalid coupon code.', 400);
    if (coupon.expiryDate < new Date()) throw new AppError('This coupon has expired.', 400);
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError('This coupon has reached its usage limit.', 400);
    }
    if (subtotal < coupon.minPurchase) {
      throw new AppError(
        `Minimum order of $${coupon.minPurchase.toFixed(2)} required for this coupon.`,
        400
      );
    }

    discountAmount =
      coupon.discountType === 'percentage'
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;

    couponId = coupon.id;

    // Increment coupon used count
    await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
  }

  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Create order with items and payment record in a transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        subtotal: parseFloat(subtotal.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        couponId,
        shippingAddress: JSON.stringify(shippingAddress),
        billingAddress: billingAddress ? JSON.stringify(billingAddress) : null,
        items: {
          create: itemsWithPrices.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            quantity: item.quantity,
            price: item.currentPrice,
          })),
        },
        payment: {
          create: {
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
            amount: parseFloat(totalAmount.toFixed(2)),
          },
        },
      },
      include: {
        items: { include: { product: true, variant: true } },
        payment: true,
        coupon: true,
      },
    });

    // Clear the cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  return order;
};

/**
 * Get all orders for the current user.
 */
export const getUserOrders = (userId) => orderRepo.findByUserId(userId);

/**
 * Get a single order, ensuring it belongs to the requesting user.
 */
export const getOrderById = async (userId, orderId, userRole) => {
  const order = await orderRepo.findById(orderId);
  if (!order) throw new AppError('Order not found.', 404);
  if (order.userId !== userId && userRole !== 'admin') {
    throw new AppError('You do not have permission to view this order.', 403);
  }
  return order;
};
