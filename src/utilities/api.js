import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }else {
    console.log('no token')
  }
  return config;
});

// Handle 401s (e.g., expired token) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';  // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;