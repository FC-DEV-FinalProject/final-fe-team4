export const ERROR_MESSAGES = {
  INVALID_FILE_TYPE: '텍스트(.txt) 파일만 업로드할 수 있습니다.',
  FILE_UPLOAD_FAILED: '파일 업로드에 실패했습니다. 다시 시도해주세요.',
  EMPTY_FILE: '파일이 비어있습니다.',
  NO_PROCESSABLE_TEXT: '처리할 수 있는 텍스트가 없습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const;

export const SIGNUP_VALIDATION = {
  REQUIRED: {
    EMAIL: '이메일을 입력해주세요.',
    PASSWORD: '비밀번호를 입력해주세요.',
    NAME: '이름을 입력해주세요.',
    PHONE: '전화번호를 입력해주세요.',
  },
  INVALID: {
    EMAIL: '올바른 이메일 형식이 아닙니다.',
    PASSWORD: '영문 대/소문자, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요.',
    PHONE: '올바른 전화번호 형식이 아닙니다.',
  },
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  TERMS_REQUIRED: '필수 약관에 모두 동의해주세요.',
  PASSWORD_MAX_LENGTH: '비밀번호는 최대 50자까지 입력 가능합니다.',
} as const;

export const SIGNUP_VALIDATION_PATTERNS = {
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
  PHONE: /^\d{3}-\d{4}-\d{4}$/,
} as const;

export const FILE_CONSTANTS = {
  MAX_FILE_SIZE: 1024 * 1024, // 1MB
  ERROR_TIMEOUT: 2000, // 2초
} as const;
