import prisma from '../config/prismaClient.js';

const orderInclude = {
  items: {
    include: {
      product: { select: { id: true, name: true, slug: true, images: true } },
      variant: { select: { id: true, size: true, color: true } },
    },
  },
  payment: true,
  coupon: { select: { code: true, discountType: true, discountValue: true } },
};

/**
 * Create a new order.
 */
export const create = (data) =>
  prisma.order.create({ data, include: orderInclude });

/**
 * Get all orders for a user.
 */
export const findByUserId = (userId) =>
  prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });

/**
 * Get a single order by ID.
 */
export const findById = (id) =>
  prisma.order.findUnique({ where: { id }, include: orderInclude });

/**
 * Update order status.
 */
export const updateStatus = (id, status) =>
  prisma.order.update({ where: { id }, data: { status }, include: orderInclude });
