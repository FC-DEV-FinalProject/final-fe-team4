/* eslint-disable @typescript-eslint/no-explicit-any */
import { customInstance } from './axios-client';

interface FindPasswordRequest {
  email: string;
  phoneNumber: string;
}

interface CheckEmailResponse {
  isDuplicate: boolean;
}

export const checkEmail = async (email: string) => {
  try {
    if (!email || email.trim() === '') {
      throw new Error('이메일을 입력해주세요.');
    }
    const response = await customInstance.post<CheckEmailResponse>('/member/check-id', { email });
    if (response.data.isDuplicate) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      if ((error as any).response?.status === 400) {
        throw new Error('잘못된 이메일 주소입니다.');
      }
      throw error;
    }
    throw new Error('이메일 중복 확인에 실패했습니다.');
  }
};

export const findID = async (name: string, phoneNumber: string) => {
  try {
    const response = await customInstance.post('/member/find-id', {
      name,
      phoneNumber,
    });
    return response;
  } catch (error) {
    const errorMessage =
      (error as any).response?.data?.message || 'ID 찾기에 실패했습니다. 다시 시도해주세요.';
    throw new Error(errorMessage);
  }
};

export const findPassword = async ({ email, phoneNumber }: FindPasswordRequest) => {
  try {
    const response = await customInstance.post('/member/find-password', {
      email,
      phoneNumber,
    });
    return response;
  } catch (error) {
    const errorMessage =
      (error as any).response?.data?.message || '비밀번호 찾기에 실패했습니다. 다시 시도해주세요.';
    throw new Error(errorMessage);
  }
};

interface Profile {
  email: string;
  name: string;
  phoneNumber: string;
}

interface Password {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const changeProfile = async ({ email, name, phoneNumber }: Profile) => {
  try {
    const response = await customInstance.put('/member/info/update', {
      email,
      name,
      phoneNumber,
    });
    return response;
  } catch (error) {
    const errorMessage =
      (error as any).response?.data?.message ||
      '프로필 업데이트에 실패했습니다. 다시 시도해주세요.';
    throw new Error(errorMessage);
  }
};

export const changePassword = async ({
  currentPassword,
  newPassword,
  confirmPassword,
}: Password) => {
  try {
    const response = await customInstance.put('/member/password/update', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response;
  } catch (error) {
    const errorMessage =
      (error as any).response?.data?.message || '비밀번호 변경에 실패했습니다. 다시 시도해주세요.';
    throw new Error(errorMessage);
  }
};
