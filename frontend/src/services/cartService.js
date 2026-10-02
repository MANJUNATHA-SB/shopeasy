import api from './api';

export const cartService = {
  getCart: () => api.get('/cart').then((res) => res.data),
  addItem: (productId, quantity) => api.post('/cart/items', { productId, quantity }).then((res) => res.data),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }).then((res) => res.data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`).then((res) => res.data),
};
