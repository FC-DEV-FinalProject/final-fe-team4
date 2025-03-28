import { useCallback } from 'react';

interface UseAudioDownloadProps {
  items: Array<{
    id: string;
    fileName: string;
    convertedAudioUrl?: string;
  }>;
  showAlert: (message: string, variant: 'default' | 'destructive') => void;
}

export const useAudioDownload = ({ items, showAlert }: UseAudioDownloadProps) => {
  const handleDownload = useCallback(
    async (id: string) => {
      const item = items.find((item) => item.id === id);
      if (!item?.convertedAudioUrl) {
        showAlert('변환된 음성이 없습니다.', 'destructive');
        return;
      }

      try {
        const response = await fetch(item.convertedAudioUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `converted_${item.fileName}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch {
        showAlert('다운로드에 실패했습니다.', 'destructive');
      }
    },
    [items, showAlert]
  );

  return handleDownload;
};
