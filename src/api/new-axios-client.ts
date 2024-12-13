// apiClient.ts
import axios, { AxiosInstance } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  instance.interceptors.request.use(
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

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // 에러 처리 (예: 401 인증 에러, 404 등)
      if (error.response) {
        switch (error.response.status) {
          case 401:
            break;
          case 404:
            break;
          default:
            break;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const newcustomInstance = createApiClient();
