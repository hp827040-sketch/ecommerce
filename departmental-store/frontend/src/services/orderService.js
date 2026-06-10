import api from './api';

export const orderService = {
  create: (data) => api.post('/orders', data),
  createAdmin: (data) => api.post('/orders/admin', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  update: (id, data) => api.put(`/orders/${id}`, data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  remove: (id) => api.delete(`/orders/${id}`),
};
