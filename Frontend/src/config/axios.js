// config/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://tasty-hive-9nqd.vercel.app/',
    withCredentials: true, 
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;