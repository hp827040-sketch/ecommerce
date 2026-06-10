import api from './api';

export const customerService = {
  getDashboard: () => api.get('/customer/dashboard'),
  updateProfile: (data) => api.put('/customer/profile', data),
};
