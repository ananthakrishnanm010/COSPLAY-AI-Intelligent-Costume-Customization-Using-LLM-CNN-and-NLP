/**
 * Base Axios API client.
 * Automatically injects the JWT token from localStorage into every request.
 * Handles 401 responses by clearing the stored token.
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('taf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('taf_token');
      localStorage.removeItem('taf_user');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
