import api from './api';

export const productService = {
  // filters: { keyword, categoryId, sortBy, direction, page, size }
  getProducts: (filters = {}) => api.get('/products', { params: filters }).then((res) => res.data),
  getProductById: (id) => api.get(`/products/${id}`).then((res) => res.data),
  createProduct: (data) => api.post('/products', data).then((res) => res.data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data).then((res) => res.data),
  deleteProduct: (id) => api.delete(`/products/${id}`).then((res) => res.data),
};
