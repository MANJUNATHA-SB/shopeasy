import api from './api';

export const categoryService = {
  getCategories: () => api.get('/categories').then((res) => res.data),
  createCategory: (data) => api.post('/categories', data).then((res) => res.data),
};
