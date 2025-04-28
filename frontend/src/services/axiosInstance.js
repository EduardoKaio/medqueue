import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
});

// Adiciona o token em todas as requisições automaticamente
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
