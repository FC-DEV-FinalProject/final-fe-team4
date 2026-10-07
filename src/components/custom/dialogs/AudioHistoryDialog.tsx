import React from 'react';
import { TbTrash, TbX } from 'react-icons/tb';

import { DownloadButton } from '@/components/custom/buttons/IconButton';
import { AudioPlayer, PlayerMode } from '@/components/custom/features/common/AudioPlayer';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogClose, DialogContent, DialogPortal, DialogTitle } from '@/components/ui/dialog';
import { useAudioDownload } from '@/hooks/useAudioDownload';
import { formatUpdatedAt } from '@/utils/dateUtils';

interface AudioHistoryDialogProps {
  audioHistory: {
    id: number;
    audioUrl: string;
    fileName?: string;
    createdAt?: string;
  }[];
}

const AudioHistoryDialog: React.FC<AudioHistoryDialogProps> = ({ audioHistory }) => {
  const [selectedItems, setSelectedItems] = React.useState<number[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(audioHistory.map((audio) => audio.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectedItems((prev) => (checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)));
  };

  const handleDelete = () => {
    console.log('삭제된 아이템:', selectedItems);
  };

  const isAllSelected = selectedItems.length === audioHistory.length;

  const handleDownload = useAudioDownload({
    items: audioHistory.map((item) => ({
      id: item.id.toString(),
      fileName: item.fileName || 'audio',
      convertedAudioUrl: item.audioUrl,
    })),
    showAlert: (message, _variant) => {
      console.log(message); // 실제로는 여기에 알림 컴포넌트를 사용하면 좋습니다
    },
  });

  return (
    <DialogPortal>
      <DialogContent className="p-0 w-[789px]">
        {/* Header */}
        <div className="flex items-center p-6 border-b gap-3">
          <DialogTitle className="text-body1 pl-9">전체 음성 생성 내역</DialogTitle>
          <span className="text-body1 text-gray-700">{audioHistory.length}</span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center px-6 py-2 gap-3 border-b">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
          />
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-2 py-1 text-gray-700 hover:cursor-pointer"
            aria-label="선택된 항목 삭제"
          >
            <TbTrash className="w-5 h-5" />
            <span className="text-body2">삭제</span>
          </button>
        </div>

        {/* History Grid */}
        <div className="flex flex-col gap-4 p-6">
          {audioHistory.map((audio) => (
            <div
              key={audio.id}
              className="flex flex-col p-4 bg-white border rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedItems.includes(audio.id)}
                    onCheckedChange={(checked) => handleSelectItem(audio.id, checked as boolean)}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{audio.fileName}</span>
                    <span className="text-xs text-gray-500">
                      {audio.createdAt && formatUpdatedAt(audio.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <DownloadButton onClick={() => handleDownload(audio.id.toString())} />
                </div>
              </div>
              <div className="w-[680px]">
                <AudioPlayer audioUrl={audio.audioUrl} mode={PlayerMode.MINI} />
              </div>
            </div>
          ))}
        </div>

        <DialogClose asChild>
          <button
            className="absolute right-6 top-6 flex items-center justify-center"
            aria-label="Close"
          >
            <TbX className="w-6 h-6" />
          </button>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  );
};

export default AudioHistoryDialog;
