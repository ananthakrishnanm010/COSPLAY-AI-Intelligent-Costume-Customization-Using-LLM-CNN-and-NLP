import apiClient from '../../../services/apiClient';

export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials).then((r) => r.data),
  register: (data) => apiClient.post('/auth/register', data).then((r) => r.data),
  getMe: () => apiClient.get('/auth/me').then((r) => r.data),
};
