/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosError } from 'axios';

import { customInstance } from './axios-client';

interface SignupRequest {
  email: string;
  name: string;
  pwd: string;
  pwdConfirm: string;
  phoneNumber: string;
  terms: string;
}
export const login = async (email: string, pwd: string) => {
  try {
    const data = await customInstance.post('/member/login', {
      email,
      pwd,
    });
    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || '로그인 요청에 실패했습니다. 다시 시도해주세요.';
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      throw new Error(error.message || '알 수 없는 오류가 발생했습니다.');
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};

export const logout = async () => {
  try {
    await customInstance.post('/member/logout');
  } catch {
    throw new Error('로그아웃 요청에 실패했습니다. 다시 시도해주세요.');
  }
};

export const signup = async (signupRequest: SignupRequest) => {
  try {
    const response = await customInstance.post('/member/signup', signupRequest);
    console.log('회원가입 서버 응답:', response);
    return response;
  } catch (error) {
    console.error('회원가입 요청 실패:', error);
    const errorMessage =
      (error as any).response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
    throw new Error(errorMessage);
  }
};
