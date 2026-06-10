import api from './api';

export const cartService = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (data) => api.put('/cart', data),
  remove: (data) => api.delete('/cart', { data }),
  clear: () => api.delete('/cart/clear'),
};
