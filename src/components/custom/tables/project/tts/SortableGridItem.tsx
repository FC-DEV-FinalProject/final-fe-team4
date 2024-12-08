import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo, useState } from 'react';

import {
  DownloadButton,
  RecreateButton,
  TTSPlaybackHistoryButton,
} from '@/components/custom/buttons/IconButton';
import { AudioPlayer } from '@/components/custom/features/common/AudioPlayer';
import { SoundStatus, UNIT_SOUND_STATUS_TYPES } from '@/components/custom/features/tts/SoundStatus';
import TooltipWrapper from '@/components/custom/guide/TooltipWrapper';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { TTS_TOOLTIP } from '@/constants/tooltips';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useTTSStore } from '@/stores/tts.store';
import { useTTSAudioHistoryStore } from '@/stores/TTSAudioHistory.store.ts';

import TTSPlaybackHistory from './TTSPlaybackHistory';

export interface SortableGridItemProps {
  id: string;
  text: string;
  audioUrl: string;
  isSelected: boolean;
  speed?: number;
  volume?: number;
  pitch?: number;
  onPlay: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
  onSelectionChange: (id: string) => void;
  onTextChange: (id: string, newText: string) => void;
}

export const SortableGridItem = memo((props: SortableGridItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.id,
  });

  const historyItems = useTTSAudioHistoryStore((state) => state.historyItems)[props.id] || [];
  const handleDelete = useTTSAudioHistoryStore((state) => state.deleteHistoryItem)(props.id);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const addItems = useTTSStore((state) => state.addItems);
  const { handleKeyDown } = useKeyboardNavigation({
    keyActions: {
      tab: { enabled: true },
      enter: { enabled: true, action: addItems },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTextAreaResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className={`bg-white rounded-md border p-4 group cursor-grab active:cursor-grabbing ${
          props.isSelected
            ? 'border border-primary shadow-[inset_0px_0px_5px_2px_rgba(59,130,246,0.2)]'
            : 'border'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-between flex-1">
            <div className="flex items-center gap-5">
              <div className="flex items-center cursor-pointer relative">
                <Checkbox
                  checked={props.isSelected}
                  onCheckedChange={() => props.onSelectionChange(props.id)}
                  className="cursor-pointer ml-2 mr-4"
                  id={`checkbox-grid-${props.id}`}
                />
                <div
                  className="absolute inset-0"
                  onClick={() => props.onSelectionChange(props.id)}
                />
              </div>

              <div className="flex gap-5">
                {props.speed !== undefined && (
                  <SoundStatus
                    type={UNIT_SOUND_STATUS_TYPES.SPEED}
                    value={props.speed}
                    showLabel={true}
                  />
                )}
                {props.volume !== undefined && (
                  <SoundStatus
                    type={UNIT_SOUND_STATUS_TYPES.VOLUME}
                    value={props.volume}
                    showLabel={true}
                  />
                )}
                {props.pitch !== undefined && (
                  <SoundStatus
                    type={UNIT_SOUND_STATUS_TYPES.PITCH}
                    value={props.pitch}
                    showLabel={true}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6 mr-2">
              <TooltipWrapper content={TTS_TOOLTIP.REGENERATE_SELECTED}>
                <div>
                  <RecreateButton onClick={props.onRegenerate} />
                </div>
              </TooltipWrapper>

              <DownloadButton onClick={props.onDownload} />

              <TooltipWrapper content={TTS_TOOLTIP.VIEW_HISTORY}>
                <div>
                  <TTSPlaybackHistoryButton
                    onClick={() => {
                      setIsHistoryOpen(!isHistoryOpen);
                    }}
                    isActive={isHistoryOpen}
                    isHistoryViewEnabled={historyItems.length > 0}
                  />
                </div>
              </TooltipWrapper>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Textarea
            value={props.text}
            onChange={(e) => {
              props.onTextChange(props.id, e.target.value);
              handleTextAreaResize(e.target);
            }}
            onInput={(e) => handleTextAreaResize(e.currentTarget)}
            placeholder="스크립트를 입력하세요."
            className="w-3/5 min-h-[40px] overflow-hidden mb-2 border-0"
            rows={1}
            onKeyDown={handleKeyDown}
          />
          <div className="w-3/5 mb-5">
            <AudioPlayer audioUrl={props.audioUrl} className="px-6 py-3" />
          </div>
        </div>
        {isHistoryOpen && historyItems.length > 0 && (
          <TTSPlaybackHistory historyItems={historyItems} handleDelete={handleDelete} />
        )}
      </div>
    </div>
  );
});

SortableGridItem.displayName = 'SortableGridItem';
