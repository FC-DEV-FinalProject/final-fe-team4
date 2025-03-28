import { useCallback } from 'react';

import { useVCStore } from '@/stores/vc.store';
import { ConcatTableItem } from '@/types/table';

interface UseConcatUploadOptions {
  onSuccess?: (items: ConcatTableItem[]) => void;
  onError?: (error: string) => void;
}

export const useConcatUpload = ({ onSuccess, onError }: UseConcatUploadOptions = {}) => {
  const showAlert = useVCStore((state) => state.showAlert);

  const handleAudioFiles = useCallback(
    async (files: FileList) => {
      try {
        const audioFiles = Array.from(files).filter((file) => file.type.startsWith('audio/'));

        if (audioFiles.length === 0) {
          throw new Error('오디오 파일을 찾을 수 없습니다.');
        }

        const items: ConcatTableItem[] = await Promise.all(
          audioFiles.map(async (file) => {
            const audioUrl = URL.createObjectURL(file);
            const audio = new Audio(audioUrl);

            return new Promise<ConcatTableItem>((resolve) => {
              audio.onloadedmetadata = () => {
                resolve({
                  id: crypto.randomUUID(),
                  text: '',
                  isSelected: false,
                  audioUrl,
                  frontSilence: 0,
                  backSilence: 0,
                  duration: audio.duration,
                  fileName: file.name,
                  silentRegions: [],
                });
              };
            });
          })
        );

        onSuccess?.(items);
      } catch (error) {
        const message = error instanceof Error ? error.message : '파일 업로드에 실패했습니다.';
        showAlert(message, 'destructive');
        onError?.(message);
      }
    },
    [showAlert, onSuccess, onError]
  );

  const handleTextFiles = useCallback(
    async (files: FileList) => {
      try {
        const textFiles = Array.from(files).filter((file) => file.type === 'text/plain');

        if (textFiles.length === 0) {
          throw new Error('텍스트 파일을 찾을 수 없습니다.');
        }

        const texts = await Promise.all(textFiles.map((file) => file.text()));

        onSuccess?.(
          texts.map((text) => ({
            id: crypto.randomUUID(),
            text,
            isSelected: false,
            audioUrl: '',
            frontSilence: 0,
            backSilence: 0,
            duration: 0,
            fileName: '',
            silentRegions: [],
          }))
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : '파일 업로드에 실패했습니다.';
        showAlert(message, 'destructive');
        onError?.(message);
      }
    },
    [showAlert, onSuccess, onError]
  );

  return {
    handleAudioFiles,
    handleTextFiles,
  };
};
