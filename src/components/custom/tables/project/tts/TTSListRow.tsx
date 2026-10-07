import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import { TbHistory } from 'react-icons/tb';

import { PlayButton } from '@/components/custom/buttons/PlayButton';
import { SoundStatus, UNIT_SOUND_STATUS_TYPES } from '@/components/custom/features/tts/SoundStatus';
import TTSPlaybackHistory from '@/components/custom/tables/project/tts/TTSPlaybackHistory';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { cn } from '@/lib/utils';
import { useTTSStore } from '@/stores/tts.store';
import { useTTSAudioHistoryStore } from '@/stores/TTSAudioHistory.store.ts';
import { ListRowProps } from '@/types/table';

export const TTSListRow: React.FC<ListRowProps> = ({
  id,
  text,
  isSelected,
  onPlay,
  speed,
  volume,
  pitch,
  onSelectionChange,
  onTextChange,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const historyItems = useTTSAudioHistoryStore((state) => state.historyItems)[id] || [];
  const handleDelete = useTTSAudioHistoryStore((state) => state.deleteHistoryItem)(id);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const addItems = useTTSStore((state) => state.addItems);

  const { handleKeyDown } = useKeyboardNavigation({
    keyActions: {
      tab: { enabled: true },
      enter: { enabled: true, action: addItems },
    },
  });

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
        <PlayButton onClick={() => onPlay(id)} className="ml-2 mr-2 w-6 h-6" />
        <Textarea
          value={text}
          onChange={(e) => {
            onTextChange(id, e.target.value);
            handleTextAreaResize(e.target);
          }}
          onKeyDown={handleKeyDown}
          onInput={(e) => handleTextAreaResize(e.currentTarget)}
          placeholder="텍스트를 입력하세요."
          className="flex-1 w-full ml-2 mr-4 min-h-[40px] border-0 overflow-visible resize-none"
          rows={1}
        />
        <div className="flex gap-6">
          <div className="flex items-center gap-4">
            <SoundStatus type={UNIT_SOUND_STATUS_TYPES.SPEED} value={speed} />
            <SoundStatus type={UNIT_SOUND_STATUS_TYPES.VOLUME} value={volume} />
            <SoundStatus type={UNIT_SOUND_STATUS_TYPES.PITCH} value={pitch} />
          </div>
          <div className="flex w-11 justify-center items-center">
            <TbHistory
              className={cn(
                'w-6 h-6 text-gray-700 cursor-pointer hover:text-blue-700',
                isHistoryOpen && 'text-blue-700',
                historyItems.length > 0 ||
                  'pointer-events-none text-gray-700 opacity-50 cursor-not-allowed'
              )}
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            />
          </div>
        </div>
      </div>
      {isHistoryOpen && historyItems.length > 0 && (
        <TTSPlaybackHistory historyItems={historyItems} handleDelete={handleDelete} />
      )}
    </div>
  );
};
