import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useEffect } from 'react';

import { PlayButton } from '@/components/custom/buttons/PlayButton';
import {
  SILENCE_STATUS_TYPES,
  SilenceStatus,
} from '@/components/custom/features/concat/SilenceStatus';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useConcatStore } from '@/stores/concat.store';
import { ListRowProps } from '@/types/table';

export const ConcatListRow: React.FC<ListRowProps> = ({
  id,
  text,
  isSelected,
  onPlay,
  onSelectionChange,
  onTextChange,
  fileName,
  frontSilence = 0,
  backSilence = 0,
  endSilence = 0,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const { audioPlayer, handlePause } = useConcatStore();
  const isPlaying = audioPlayer.currentPlayingId === id;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTextAreaResize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, [text]);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <div className="flex items-center px-4 py-2 border-b group bg-white cursor-grab active:cursor-grabbing">
        <div className="flex items-center cursor-pointer relative">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelectionChange(id)}
            className="cursor-pointer ml-2 mr-2"
            id={`checkbox-${id}`}
          />
          <div className="absolute inset-0" onClick={() => onSelectionChange(id)} />
        </div>
        <PlayButton
          onClick={() => (isPlaying ? handlePause() : onPlay(id))}
          className="ml-2 mr-2 w-6 h-6"
          isPlaying={isPlaying}
        />
        <div className="ml-4 truncate w-[180px]">{fileName}</div>
        <Textarea
          value={text}
          onChange={(e) => {
            onTextChange(id, e.target.value);
            handleTextAreaResize(e.target);
          }}
          onInput={(e) => handleTextAreaResize(e.currentTarget)}
          placeholder="스크립트를 입력하세요."
          className="flex-1 ml-2 mr-4 min-h-[40px] border-0 overflow-visible resize-none"
          rows={1}
        />
        <div className="flex gap-8 items-center">
          <SilenceStatus
            type={SILENCE_STATUS_TYPES.FRONT_SILENCE}
            value={frontSilence}
            showLabel={false}
          />
          <SilenceStatus
            type={SILENCE_STATUS_TYPES.BACK_SILENCE}
            value={backSilence}
            showLabel={false}
          />
          <SilenceStatus
            type={SILENCE_STATUS_TYPES.END_SILENCE}
            value={endSilence}
            showLabel={false}
            className="mr-3"
          />
        </div>
      </div>
    </div>
  );
};
