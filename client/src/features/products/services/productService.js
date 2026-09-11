import apiClient from '../../../services/apiClient';

export const productService = {
  getProducts: (params) => apiClient.get('/products', { params }).then((r) => r.data),
  getProductBySlug: (slug) => apiClient.get(`/products/${slug}`).then((r) => r.data),
};
