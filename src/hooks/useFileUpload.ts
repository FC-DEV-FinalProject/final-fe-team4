import { useCallback, useState } from 'react';

export const ALLOWED_FILE_TYPES = {
  WAV: 'audio/wav',
  MP3: 'audio/mpeg',
  TEXT: 'text/plain',
} as const;

export const FILE_TYPES_TO_KOREAN = {
  [ALLOWED_FILE_TYPES.WAV]: 'WAV',
  [ALLOWED_FILE_TYPES.MP3]: 'MP3',
  [ALLOWED_FILE_TYPES.TEXT]: '텍스트',
} as const;

export type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[keyof typeof ALLOWED_FILE_TYPES];

// 파일 처리 타입 정의
type FileProcessor<T> = (file: File) => Promise<T>;

// 파일 처리기 인터페이스
interface FileProcessors {
  audio: FileProcessor<File>;
  text: FileProcessor<string>;
}

// 파일 타입별 처리 로직
const fileProcessors: FileProcessors = {
  audio: async (file: File) => file,
  text: async (file: File) => file.text(),
};

interface UseFileUploadOptions<T> {
  maxSizeInMB: number;
  allowedTypes: AllowedFileType[];
  onSuccess: (result: T[]) => void;
  onError?: (error: string) => void;
  multiple?: boolean;
  accept?: string;
  type: keyof FileProcessors;
}

export const useFileUpload = <T>({
  maxSizeInMB,
  allowedTypes,
  onSuccess,
  onError,
  multiple = true,
  accept,
  type,
}: UseFileUploadOptions<T>) => {
  const [isLoading, setIsLoading] = useState(false);

  const validateFile = useCallback(
    (file: File) => {
      if (file.size === 0) {
        throw new Error('빈 파일은 업로드할 수 없습니다!');
      }
      if (file.size > maxSizeInMB * 1024 * 1024) {
        throw new Error(`파일 크기는 ${maxSizeInMB}MB를 초과할 수 없습니다.`);
      }
      if (!allowedTypes.includes(file.type as AllowedFileType)) {
        const allowedTypeNames = allowedTypes.map((type) => FILE_TYPES_TO_KOREAN[type]).join(', ');
        throw new Error(`${allowedTypeNames} 파일만 업로드할 수 있습니다.`);
      }
    },
    [maxSizeInMB, allowedTypes]
  );

  const processFiles = useCallback(
    async (files: File[]) => {
      const processor = fileProcessors[type] as FileProcessor<T>;
      return Promise.all(files.map(processor));
    },
    [type]
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) {
        return;
      }

      setIsLoading(true);

      try {
        const fileArray = Array.from(files);
        fileArray.forEach(validateFile);

        const result = await processFiles(fileArray);
        onSuccess(result as T[]);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '파일 업로드에 실패했습니다.';
        if (onError) {
          onError(errorMessage);
        } else {
          alert(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [validateFile, processFiles, onSuccess, onError]
  );

  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    const inputConfig = {
      type: 'file',
      multiple,
      accept: accept || allowedTypes.join(','),
    };

    Object.assign(input, inputConfig);

    input.onchange = ({ target }) => {
      const { files } = target as HTMLInputElement;
      handleFiles(files);
    };

    input.click();
  }, [multiple, accept, allowedTypes, handleFiles]);

  return {
    handleFiles,
    openFileDialog,
    isLoading,
  };
};

interface AudioUploadResult {
  id: string;
  text: string;
  isSelected: boolean;
  fileName: string;
  status: '대기중' | '완료' | '실패' | '진행';
  originalAudioUrl: string;
}

interface FileUploadConfig {
  audio: {
    maxSizeInMB: number;
    allowedTypes: [typeof ALLOWED_FILE_TYPES.WAV, typeof ALLOWED_FILE_TYPES.MP3];
    accept: 'audio/*';
  };
  text: {
    maxSizeInMB: number;
    allowedTypes: [typeof ALLOWED_FILE_TYPES.TEXT];
    accept: '.txt';
  };
}

const CONFIG: FileUploadConfig = {
  audio: {
    maxSizeInMB: 10,
    allowedTypes: [ALLOWED_FILE_TYPES.WAV, ALLOWED_FILE_TYPES.MP3],
    accept: 'audio/*',
  },
  text: {
    maxSizeInMB: 5,
    allowedTypes: [ALLOWED_FILE_TYPES.TEXT],
    accept: '.txt',
  },
} as const;

export const useAudioUpload = (
  onSuccess: (items: AudioUploadResult[]) => void,
  onError: (error: string) => void
) => {
  return useFileUpload<File>({
    ...CONFIG.audio,
    type: 'audio',
    onSuccess: (files) => {
      const newItems = files.map((file) => ({
        id: crypto.randomUUID(),
        text: '',
        isSelected: false,
        fileName: file.name,
        status: '대기중' as const,
        originalAudioUrl: URL.createObjectURL(file),
      }));
      onSuccess(newItems);
    },
    onError,
  });
};

export const useTextUpload = (
  onSuccess: (texts: string[]) => void,
  options?: { onError?: (error: string) => void }
) => {
  return useFileUpload<string>({
    ...CONFIG.text,
    type: 'text',
    onSuccess,
    onError: options?.onError,
  });
};
