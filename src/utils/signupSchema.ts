import { z } from 'zod';

import { SIGNUP_VALIDATION, SIGNUP_VALIDATION_PATTERNS } from '@/constants/validation';
import type { SignupFormData, SignupRequest } from '@/types/signup';

// 회원가입 폼 유효성 검사 스키마 정의
export const signupFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: SIGNUP_VALIDATION.REQUIRED.EMAIL })
      .email({ message: SIGNUP_VALIDATION.INVALID.EMAIL }),

    password: z
      .string()
      .min(8, { message: SIGNUP_VALIDATION.REQUIRED.PASSWORD })
      .regex(SIGNUP_VALIDATION_PATTERNS.PASSWORD, { message: SIGNUP_VALIDATION.INVALID.PASSWORD }),

    passwordConfirm: z.string().min(1, { message: SIGNUP_VALIDATION.REQUIRED.PASSWORD }),

    name: z.string().min(1, { message: SIGNUP_VALIDATION.REQUIRED.NAME }),

    gender: z.string().optional(),

    birth_date: z.string(),

    phone: z
      .string()
      .min(1, { message: SIGNUP_VALIDATION.REQUIRED.PHONE })
      .regex(SIGNUP_VALIDATION_PATTERNS.PHONE, { message: SIGNUP_VALIDATION.INVALID.PHONE }),

    terms: z.array(z.string()).refine((value) => value.length >= 3, {
      message: SIGNUP_VALIDATION.TERMS_REQUIRED,
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: SIGNUP_VALIDATION.PASSWORD_MISMATCH,
    path: ['passwordConfirm'],
  });

// 폼 데이터를 API 요청 형식으로 변환
export const transformFormToRequest = (formData: SignupFormData): SignupRequest => {
  return {
    email: formData.email,
    pwd: formData.password,
    name: formData.name,
    gender: formData.gender || null,
    birth_date: formData.birth_date,
    phone_number: formData.phone,
    tou: formData.terms.length === 3 ? 'Y' : 'N',
    is_deleted: false,
  };
};