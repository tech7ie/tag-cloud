import axios from 'axios';
import router from './router';

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_SSE_URL,
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response.status === 401) {
    router.push('/web/admin-login');
  }
  return Promise.reject(error);
});

export default axiosInstance;
