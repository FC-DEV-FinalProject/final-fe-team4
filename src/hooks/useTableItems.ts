import { useCallback, useMemo } from 'react';

import { TableItem } from '@/types/table';

interface UseTableItemsProps {
  items: (TableItem & {
    status?: '대기중' | '완료' | '실패' | '진행';
    targetVoice?: string;
    originalAudioUrl?: string;
    convertedAudioUrl?: string;
    type?: 'TTS' | 'VC' | 'Concat';
    frontSilence?: number;
    backSilence?: number;
    endSilence?: number;
  })[];
  onPlay: (id: string) => void;
  onRegenerateItem?: (id: string) => void;
  onDownloadItem?: (id: string) => void;
  onSelectionChange: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
}

export const useTableItems = ({
  items,
  onPlay,
  onRegenerateItem,
  onDownloadItem,
  onSelectionChange,
  onTextChange,
}: UseTableItemsProps) => {
  const selectedCount = useMemo(() => items.filter((item) => item.isSelected).length, [items]);

  const handleRegenerate = useCallback(
    (itemId?: string) => {
      const selectedItems = items.filter((item) => item.isSelected);
      if (itemId) {
        onRegenerateItem?.(itemId);
      } else if (selectedItems.length > 0) {
        selectedItems.forEach((item) => onRegenerateItem?.(item.id));
      }
    },
    [items, onRegenerateItem]
  );

  const handleDownload = useCallback(
    (itemId?: string) => {
      const selectedItems = items.filter((item) => item.isSelected);
      if (itemId) {
        onDownloadItem?.(itemId);
      } else if (selectedItems.length > 0) {
        selectedItems.forEach((item) => onDownloadItem?.(item.id));
      }
    },
    [items, onDownloadItem]
  );

  const listItems = items.map((item) => ({
    id: item.id,
    text: item.text,
    isSelected: item.isSelected,
    fileName: item.fileName,
    status: item.status,
    originalAudioUrl: item.originalAudioUrl,
    convertedAudioUrl: item.convertedAudioUrl,
    onPlay: () => onPlay(item.id),
    onSelectionChange: () => onSelectionChange(item.id),
    onTextChange: (text: string) => onTextChange(item.id, text),
    type: item.type,
    speed: item.speed ?? 1,
    volume: item.volume ?? 1,
    pitch: item.pitch ?? 1,
    targetVoice: item.targetVoice,
    frontSilence: item.frontSilence ?? 0,
    backSilence: item.backSilence ?? 0,
    endSilence: item.endSilence ?? 0,
  }));

  const gridItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        text: item.text,
        isSelected: item.isSelected,
        audioUrl:
          (item.type === 'VC' ? item.originalAudioUrl : item.convertedAudioUrl || item.audioUrl) ||
          '',
        speed: item.speed,
        volume: item.volume,
        pitch: item.pitch,
        onPlay: () => onPlay(item.id),
        onRegenerate: () => handleRegenerate(item.id),
        onDownload: () => handleDownload(item.id),
        onSelectionChange,
        onTextChange,
      })),
    [items, onPlay, handleRegenerate, handleDownload, onSelectionChange, onTextChange]
  );

  return {
    selectedCount,
    handleRegenerate,
    handleDownload,
    listItems,
    gridItems,
  };
};
