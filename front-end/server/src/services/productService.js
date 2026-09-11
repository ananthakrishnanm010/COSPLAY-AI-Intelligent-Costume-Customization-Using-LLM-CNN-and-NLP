import AppError from '../utils/AppError.js';
import * as productRepo from '../repositories/productRepository.js';

/**
 * Get paginated list of products with filters.
 */
export const getProducts = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 12, 50); // cap at 50

  const [products, totalCount] = await productRepo.findMany({
    categorySlug: query.category,
    search: query.search,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    page,
    limit,
  });

  return {
    products,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

/**
 * Get a single product by its slug.
 */
export const getProductBySlug = async (slug) => {
  const product = await productRepo.findBySlug(slug);
  if (!product) throw new AppError(`Product with slug '${slug}' not found.`, 404);
  return product;
};

/**
 * Create a new product (admin only).
 */
export const createProduct = async (data) => {
  const { variants, ...productData } = data;

  return productRepo.create({
    ...productData,
    ...(variants && {
      variants: { create: variants },
    }),
  });
};

/**
 * Update an existing product (admin only).
 */
export const updateProduct = async (id, data) => {
  const existing = await productRepo.findById(id);
  if (!existing) throw new AppError('Product not found.', 404);
  return productRepo.update(id, data);
};

/**
 * Delete a product (admin only).
 */
export const deleteProduct = async (id) => {
  const existing = await productRepo.findById(id);
  if (!existing) throw new AppError('Product not found.', 404);
  return productRepo.remove(id);
};
