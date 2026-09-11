import prisma from '../config/prismaClient.js';

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  compareAtPrice: true,
  images: true,
  category: { select: { id: true, name: true, slug: true } },
  variants: {
    select: { id: true, size: true, color: true, sku: true, inventory: true },
    orderBy: [{ size: 'asc' }, { color: 'asc' }],
  },
  createdAt: true,
};

/**
 * Get many products with optional filters and pagination.
 */
export const findMany = ({ categorySlug, search, minPrice, maxPrice, page = 1, limit = 12 }) => {
  const skip = (page - 1) * limit;

  const where = {
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined && { gte: parseFloat(minPrice) }),
            ...(maxPrice !== undefined && { lte: parseFloat(maxPrice) }),
          },
        }
      : {}),
  };

  return Promise.all([
    prisma.product.findMany({
      where,
      select: productSelect,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);
};

/**
 * Get a single product by slug.
 */
export const findBySlug = (slug) =>
  prisma.product.findUnique({
    where: { slug },
    select: {
      ...productSelect,
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

/**
 * Get a single product by ID.
 */
export const findById = (id) =>
  prisma.product.findUnique({ where: { id }, select: productSelect });

/**
 * Create a new product.
 */
export const create = (data) =>
  prisma.product.create({ data, select: productSelect });

/**
 * Update a product by ID.
 */
export const update = (id, data) =>
  prisma.product.update({ where: { id }, data, select: productSelect });

/**
 * Delete a product by ID.
 */
export const remove = (id) =>
  prisma.product.delete({ where: { id } });
