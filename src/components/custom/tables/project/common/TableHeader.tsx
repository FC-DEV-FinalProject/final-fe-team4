import * as React from 'react';
import { TbCirclePlus, TbTrash } from 'react-icons/tb';

import { UploadAudioButton, UploadTextButton } from '@/components/custom/buttons/IconButton';
import ViewButtonGroup from '@/components/custom/buttons/ViewFilterButton';
import TooltipWrapper from '@/components/custom/guide/TooltipWrapper';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { VC_TOOLTIP } from '@/constants/tooltips';
import { useTextUpload } from '@/hooks/useFileUpload';
import { cn } from '@/lib/utils';
import { useVCStore } from '@/stores/vc.store';

interface TableHeaderProps {
  onDelete: () => void;
  onAdd: () => void;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
  isListView: boolean;
  onViewChange: (isListView: boolean) => void;
  itemCount: number;
  type?: 'TTS' | 'VC' | 'Concat';
  onFileUpload: (files: FileList | null) => void;
  isLoading?: boolean;
  hasAudioFile?: boolean;
}

export const TTSTableHeader: React.FC = () => {
  return (
    <div className="sticky top-0 z-10 grid grid-cols-[auto,auto,auto,1fr,auto] px-4 py-2 border-b bg-gray-50 text-sm font-medium text-black">
      <div className="w-6" />
      <div className="w-4 ml-2 mr-2" />
      <div className="w-4 ml-2 mr-2" />
      <div className="ml-1">텍스트</div>
      <div className="flex gap-7">
        <div className="w-[60px] text-center mr-1">속도</div>
        <div className="w-[52px] text-center mr-2">볼륨</div>
        <div className="w-[56px] text-center mr-2">피치</div>
        <div className="text-center mr-3">내역</div>
      </div>
    </div>
  );
};

export const VCTableHeader: React.FC = () => {
  return (
    <div className="sticky top-0 z-10 grid grid-cols-[auto,auto,193px,1fr,202px] px-4 py-2 border-b bg-gray-50 text-sm font-medium text-black">
      <div className="w-6" />
      <div className="w-4 ml-2" />
      <div className="ml-11">파일명</div>
      <div className="ml-[54px]">텍스트</div>
      <div className="ml-5">타겟 보이스</div>
    </div>
  );
};

export const ConcatTableHeader: React.FC = () => {
  return (
    <div className="sticky top-0 z-10 grid grid-cols-[auto,auto,193px,1fr,auto] px-4 py-2 border-b bg-gray-50 text-sm font-medium text-black">
      <div className="w-6" />
      <div className="w-4 ml-2 mr-[42px]" />
      <div>파일명</div>
      <div className="ml-1">텍스트</div>
      <div className="flex gap-7">
        <div className="w-[60px] text-center mr-4.5">맨 앞</div>
        <div className="w-[60px] text-center mr-4.5">맨 뒤</div>
        <div className="w-[60px] text-center mr-5">간격</div>
      </div>
    </div>
  );
};

export const TableHeader: React.FC<TableHeaderProps> = ({
  onDelete,
  onAdd,
  onSelectAll,
  isAllSelected,
  isListView,
  onViewChange,
  itemCount,
  type = 'TTS',
  onFileUpload,
  isLoading,
  hasAudioFile = false,
}) => {
  const { openFileDialog: openTextFileDialog } = useTextUpload(
    (texts) => {
      const dataTransfer = new DataTransfer();
      texts.forEach((text) => {
        const file = new File([text], 'text.txt', { type: 'text/plain' });
        dataTransfer.items.add(file);
      });
      onFileUpload(dataTransfer.files);
    },
    {
      onError: (error) => {
        useVCStore.getState().showAlert(error, 'destructive');
      },
    }
  );

  return (
    <div className={cn('flex flex-col bg-white', !isListView ? 'rounded-md border' : 'border-b')}>
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center mr-9">
            <Checkbox
              id="select-all"
              checked={itemCount > 0 && isAllSelected}
              onCheckedChange={() => onSelectAll?.()}
              className="cursor-pointer"
            />
          </div>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-50 transition-colors"
          >
            <TbTrash className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-800">삭제</span>
          </button>
          {type === 'TTS' && (
            <>
              <Separator orientation="vertical" className="h-6 mr-2" />
              <div onClick={onAdd} className="flex items-center gap-2 py-2 hover:cursor-pointer">
                <TbCirclePlus className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-800">텍스트 추가</span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {type === 'VC' || type === 'Concat' ? (
            <div className="flex items-center gap-4">
              <UploadAudioButton onClick={onAdd} />
              <div className="flex items-center gap-2">
                <TooltipWrapper
                  content={
                    hasAudioFile ? VC_TOOLTIP.UPLOAD_TEXT.ENABLED : VC_TOOLTIP.UPLOAD_TEXT.DISABLED
                  }
                >
                  <div>
                    <UploadTextButton
                      onClick={() => {
                        if (!hasAudioFile) return;
                        openTextFileDialog();
                      }}
                      isLoading={isLoading}
                      disabled={!hasAudioFile}
                    />
                  </div>
                </TooltipWrapper>
              </div>
            </div>
          ) : type === 'TTS' ? (
            <>
              <UploadTextButton
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.txt';
                  input.multiple = true;
                  input.onchange = (e) => {
                    onFileUpload((e.target as HTMLInputElement).files);
                  };
                  input.click();
                }}
                isLoading={isLoading}
              />
              <ViewButtonGroup isListView={isListView} onViewChange={onViewChange} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
