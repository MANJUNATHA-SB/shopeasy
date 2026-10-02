import api from './api';

export const orderService = {
  createOrder: (data) => api.post('/orders', data).then((res) => res.data),
  getMyOrders: () => api.get('/orders/my').then((res) => res.data),
  getOrderById: (id) => api.get(`/orders/${id}`).then((res) => res.data),
  getAllOrdersAdmin: () => api.get('/admin/orders').then((res) => res.data),
};
