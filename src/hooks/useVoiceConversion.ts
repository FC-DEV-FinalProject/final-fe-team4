import { useCallback, useState } from 'react';

import { processVoiceConversion } from '@/api/vcAPI';
import { useVCHistoryStore } from '@/stores/vc.history.store';
import { VCItem } from '@/types/table';

interface UseVoiceConversionProps {
  items: VCItem[];
  selectedVoice: string;
  projectData: {
    projectId: number | null;
    projectName: string;
  };
  memberId: number;
  setItems: (items: VCItem[]) => void;
  showAlert: (message: string, variant: 'default' | 'destructive') => void;
}

interface VoiceConversionResult {
  handleVoiceConversion: () => Promise<void>;
  isGenerating: boolean;
}

// const checkSrcAudioValid = (srcAudio: string | null, file: File | null) => {
//   if (srcAudio) throw new Error('srcAudio가 없습니다.');
//   if (file) return new Error('file이 없습니다.');
//   return { srcAudio, file };
// };

async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

export const useVoiceConversion = ({
  items,
  selectedVoice,
  projectData,
  memberId,
  setItems,
  showAlert,
}: UseVoiceConversionProps): VoiceConversionResult => {
  const [isGenerating, setIsGenerating] = useState(false);
  const setHistoryItems = useVCHistoryStore((state) => state.setHistoryItems);

  const handleVoiceConversion = useCallback(async () => {
    setIsGenerating(true);
    try {
      if (!selectedVoice) return;

      const selectedItems = items.filter((item) => item.isSelected && (item.file || item.srcAudio));
      if (selectedItems.length === 0) {
        showAlert('변환할 오디오를 선택해주세요.', 'destructive');
        return;
      }

      const updatedItems = items.map((item) => ({
        ...item,
        ...(item.isSelected && {
          status: '대기중' as const,
          targetVoice: selectedVoice,
        }),
      }));
      setItems(updatedItems);

      const vcSaveDto = {
        projectId: projectData.projectId || null,
        projectName: projectData.projectName,
        srcFiles: selectedItems.map((item, index) => ({
          audioType: 'VC_SRC',
          localFileName: item.fileName,
          unitScript: item.text,
          isChecked: true,
          detailId: index + 1,
        })),
        trgFiles: [
          {
            audioType: 'VC_TRG',
            localFileName: 'rico.mp3',
            s3MemberAudioMetaId: null,
          },
        ],
      };

      const targetVoiceFile = await fetch('/rico.mp3').then((res) => res.blob());
      const files = await Promise.all([
        ...selectedItems.map(
          async (item) =>
            (item.file as File) || (await urlToFile(item.srcAudio || '', item.fileName))
        ),
        new File([targetVoiceFile], 'rico.mp3', { type: 'audio/mp3' }),
      ]);

      const result = await processVoiceConversion(vcSaveDto, files, memberId);

      if (result) {
        const processedItems = items.map((item) => {
          const processedItem = result.find((r) => r.srcAudio.includes(item.fileName));
          if (processedItem) {
            return {
              ...item,
              status: '완료' as const,
              convertedAudioUrl: processedItem.genAudios[0],
            };
          }
          return item;
        });
        setItems(processedItems);

        const historyItems = result.map((item) => ({
          id: item.id,
          audioId: item.id,
          audioUrl: item.genAudios[0],
          unitScript: item.unitScript,
          fileName: item.srcAudio.split('/').pop() || '',
          createdAt: new Date().toISOString(),
        }));
        setHistoryItems(historyItems);

        showAlert('음성 변환이 완료되었습니다.', 'default');
      }
    } catch (error) {
      console.error('음성 변환 실패:', error);
      showAlert('음성 변환에 실패했습니다.', 'destructive');
    } finally {
      setIsGenerating(false);
    }
  }, [items, selectedVoice, projectData, memberId, setItems, showAlert, setHistoryItems]);

  return { handleVoiceConversion, isGenerating };
};
