import * as React from 'react';
import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FILE_CONSTANTS } from '@/constants/messages';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useTableItems } from '@/hooks/useTableItems';
import TableUploadMessage from '@/images/table-upload-message.svg';
import { cn } from '@/lib/utils';
import { TableItem } from '@/types/table';
import { textSplitter } from '@/utils/textSpliter';

import { TTSTableGridView } from '../tts/TTSTableGridView';
import { TableFooter } from './TableFooter';
import { TableHeader } from './TableHeader';
import { TableListView } from './TableListView';

interface TableContentsProps {
  items: (TableItem & {
    status?: '대기중' | '완료' | '실패' | '진행';
    targetVoice?: string;
    originalAudioUrl?: string;
    convertedAudioUrl?: string;
    type?: 'TTS' | 'VC' | 'Concat';
  })[];
  onSelectionChange: (id: string) => void;
  onTextChange: (id: string, newText: string) => void;
  onDelete: () => void;
  onAdd: (newItems?: TableItem[]) => void;
  onRegenerateItem?: (id: string) => void;
  onDownloadItem?: (id: string) => void;
  onPlay: (id: string) => void;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
  type?: 'TTS' | 'VC' | 'Concat';
  onReorder?: (startIndex: number, endIndex: number) => void;
  onFileUpload?: (files: FileList | null) => void;
  hasAudioFile?: boolean;
}

export const TableContents: React.FC<TableContentsProps> = ({
  items,
  onSelectionChange,
  onTextChange,
  onDelete,
  onAdd,
  onRegenerateItem,
  onDownloadItem,
  onPlay,
  onSelectAll,
  isAllSelected,
  type,
  onReorder,
  onFileUpload,
  hasAudioFile,
}) => {
  const [isListView, setIsListView] = React.useState(true);
  const [error, setError] = useState<string | null>(null);

  const { handleFiles } = useFileUpload<string>({
    maxSizeInMB: 5,
    allowedTypes: ['text/plain'],
    type: 'text',
    onSuccess: (texts) => {
      const sentences = texts.flatMap((text) => textSplitter(text));
      const newItems = sentences.map((text) => ({
        id: crypto.randomUUID(),
        text,
        isSelected: false,
      }));
      onAdd(newItems);
    },
    onError: setError,
  });

  const { selectedCount, handleRegenerate, handleDownload, listItems, gridItems } = useTableItems({
    items: items.map((item) => ({
      ...item,
      audioUrl:
        type === 'VC'
          ? item.originalAudioUrl || item.audioUrl
          : item.convertedAudioUrl || item.audioUrl,
    })),
    onPlay,
    onRegenerateItem,
    onDownloadItem,
    onSelectionChange,
    onTextChange,
  });

  React.useEffect(() => {
    if (items.length === 0 && isAllSelected) {
      onSelectAll?.();
    }
  }, [items.length, isAllSelected, onSelectAll]);

  React.useEffect(() => {
    if (error) {
      const timer = window.setTimeout(() => {
        setError(null);
      }, FILE_CONSTANTS.ERROR_TIMEOUT);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [error]);

  return (
    <>
      {error && (
        <Alert
          variant="destructive"
          className="fixed left-1/2 top-8 -translate-x-1/2 transform z-[9999] w-auto min-w-[300px] max-w-[400px] shadow-lg bg-white border border-red-200"
        >
          <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
        </Alert>
      )}
      <div
        className={cn(
          'flex flex-col h-[580px]',
          isListView ? 'bg-white border rounded-md overflow-hidden' : 'bg-transparent'
        )}
      >
        <TableHeader
          onDelete={onDelete}
          onAdd={onAdd}
          onSelectAll={onSelectAll}
          isAllSelected={isAllSelected}
          isListView={isListView}
          onViewChange={setIsListView}
          itemCount={items.length}
          type={type}
          onFileUpload={onFileUpload || handleFiles}
          hasAudioFile={hasAudioFile}
        />
        <div className="flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-12">
              <img src={TableUploadMessage} alt="Empty table message" />
            </div>
          ) : (
            <ScrollArea className={cn('h-full', !isListView && 'mt-3')}>
              {isListView ? (
                <TableListView
                  rows={listItems}
                  type={type}
                  onReorder={onReorder}
                  onSelectionChange={onSelectionChange}
                  onTextChange={onTextChange}
                />
              ) : (
                <TTSTableGridView items={gridItems} onReorder={onReorder} />
              )}
            </ScrollArea>
          )}
        </div>
        <TableFooter
          selectedCount={selectedCount}
          onRegenerate={() => handleRegenerate()}
          onDownload={() => handleDownload()}
          isListView={isListView}
          type={type}
        />
      </div>
    </>
  );
};
