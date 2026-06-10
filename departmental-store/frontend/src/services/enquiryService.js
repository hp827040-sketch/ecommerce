import api from './api';

export const enquiryService = {
  create: (data) => api.post('/enquiries', data),
  getAll: (params) => api.get('/enquiries', { params }),
  update: (id, data) => api.put(`/enquiries/${id}`, data),
  markRead: (id) => api.patch(`/enquiries/${id}/read`),
  remove: (id) => api.delete(`/enquiries/${id}`),
};
