import axios from 'axios';

const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'  
  : 'https://backendv2-theta.vercel.app'; 

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
