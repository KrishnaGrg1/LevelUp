import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'x-language': 'en', // Default language header
  },
});

axiosInstance.interceptors.request.use(config => {
  config.headers['X-Language'] = 'en'; // Default language
  return config;
});

export default axiosInstance;
