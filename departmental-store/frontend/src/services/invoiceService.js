import api from './api';

export const invoiceService = {
  getAll: () => api.get('/invoices'),
  getById: (id) => api.get(`/invoices/${id}`),
  generate: (orderId) => api.post(`/invoices/generate/${orderId}`),
  remove: (id) => api.delete(`/invoices/${id}`),
};
