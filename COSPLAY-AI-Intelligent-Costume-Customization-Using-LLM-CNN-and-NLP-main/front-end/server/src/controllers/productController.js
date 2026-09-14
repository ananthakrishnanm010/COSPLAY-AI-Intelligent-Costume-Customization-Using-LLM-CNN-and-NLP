import catchAsync from '../utils/catchAsync.js';
import * as productService from '../services/productService.js';

/**
 * GET /api/v1/products
 * Query params: category, search, minPrice, maxPrice, page, limit
 */
export const getProductsHandler = catchAsync(async (req, res) => {
  const { products, pagination } = await productService.getProducts(req.query);

  res.status(200).json({
    status: 'success',
    data: products,
    pagination,
  });
});

/**
 * GET /api/v1/products/:slug
 */
export const getProductBySlugHandler = catchAsync(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

/**
 * POST /api/v1/products (Admin only)
 */
export const createProductHandler = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    status: 'success',
    data: { product },
  });
});

/**
 * PUT /api/v1/products/:id (Admin only)
 */
export const updateProductHandler = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

/**
 * DELETE /api/v1/products/:id (Admin only)
 */
export const deleteProductHandler = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.status(204).json({ status: 'success', data: null });
});
