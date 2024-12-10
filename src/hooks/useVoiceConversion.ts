import { useCallback, useState } from 'react';

import { processVoiceConversion, VCSaveDto } from '@/api/vcAPI';
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

      const selectedItems = items.filter((item) => item.isSelected && item.file);
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

      const vcSaveDto: VCSaveDto = {
        projectId: projectData.projectId ?? undefined,
        projectName: projectData.projectName,
        srcFiles: selectedItems.map((item) => ({
          audioType: 'VC_SRC',
          localFileName: item.fileName,
          unitScript: item.text,
          isChecked: true,
        })),
        trgFiles: [
          {
            audioType: 'VC_TRG',
            localFileName: 'rico.mp3',
            s3MemberAudioMetaId: undefined,
          },
        ],
      };

      const targetVoiceFile = await fetch('/rico.mp3').then((res) => res.blob());
      const files = [
        ...selectedItems.map((item) => item.file as File),
        new File([targetVoiceFile], 'rico.mp3', { type: 'audio/mp3' }),
      ];

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
