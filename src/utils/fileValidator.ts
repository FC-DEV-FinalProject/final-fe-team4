import { ERROR_MESSAGES } from '@/constants/messages';

export const validateTextFile = (file: File): boolean => {
  if (!file.type.includes('text/plain') && !file.name.endsWith('.txt')) {
    throw new Error(ERROR_MESSAGES.INVALID_FILE_TYPE);
  }
  return true;
};
