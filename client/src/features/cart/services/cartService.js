import apiClient from '../../../services/apiClient';

export const cartService = {
  getCart: () => apiClient.get('/cart').then((r) => r.data),
  addItem: (data) => apiClient.post('/cart/items', data).then((r) => r.data),
  updateItem: (id, quantity) => apiClient.patch(`/cart/items/${id}`, { quantity }).then((r) => r.data),
  removeItem: (id) => apiClient.delete(`/cart/items/${id}`).then((r) => r.data),
};
