import { z } from 'zod';

import { signupFormSchema } from '@/utils/signupSchema';

// DB 테이블 타입 정의
export interface Member {
  member_id: number;
  email: string;
  pwd: string;
  name: string;
  phone_number: string;
  tou: string;
  is_deleted: boolean;
}

// 폼 데이터 타입
export type SignupFormData = z.infer<typeof signupFormSchema>;

// API 요청 타입 정의
export interface SignupRequest {
  email: string;
  pwd: string;
  name: string;
  phone_number: string;
  tou: string;
  is_deleted: boolean;
}
