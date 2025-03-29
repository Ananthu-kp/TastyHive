// config/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backendv2-theta.vercel.app',
  withCredentials: true,
});

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;