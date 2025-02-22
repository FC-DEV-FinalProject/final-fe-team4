import axios, { AxiosInstance } from 'axios';

import { PATH } from '@/routes/router';

export const BASE_URL = import.meta.env.VITE_API_URL;
console.log('BASE_URL', BASE_URL);
if (!BASE_URL) {
  throw new Error('VITE_API_URL is not defined');
}

// Axios 인스턴스 생성
export const customInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 세션 쿠키를 자동으로 포함
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
customInstance.interceptors.request.use(
  (config) => {
    // 세션 기반 인증에서는 Authorization 헤더가 필요 없습니다.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
customInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터를 바로 반환
    return response.data;
  },
  (error) => {
    if (error.response?.data.code === 1004) {
      const currentUrl = window.location.href;
      localStorage.setItem('redirectAfterLogin', currentUrl);
      window.location.href = PATH.SIGNIN;
    }
    return Promise.reject(error);
  }
);
