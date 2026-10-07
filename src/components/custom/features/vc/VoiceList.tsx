import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

import VoiceCard from '@/components/custom/cards/VoiceCard';
import { RadioGroup } from '@/components/ui/radio-group';
import { usePagination } from '@/hooks/usePagination';

interface VoiceListProps {
  voices: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  selectedVoice: string;
  onVoiceSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (newName: string) => void;
}

export const VoiceList = ({
  voices,
  selectedVoice,
  onVoiceSelect,
  onDelete,
  onEdit,
}: VoiceListProps) => {
  const { currentPage, setCurrentPage, getCurrentPageItems, totalPages } = usePagination({
    data: voices,
    itemsPerPage: 4,
  });

  return (
    <div>
      <div className="h-[292px] mb-4">
        <RadioGroup value={selectedVoice} onValueChange={onVoiceSelect}>
          {getCurrentPageItems().map((voice) => (
            <VoiceCard
              key={voice.id}
              voice={voice}
              isSelected={selectedVoice === voice.name}
              onSelect={() => onVoiceSelect(voice.name)}
              onDelete={() => onDelete?.(voice.id)}
              onEdit={onEdit}
            />
          ))}
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between px-4">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed text-muted-foreground'
              : 'text-foreground'
          }`}
        >
          <TbChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors ${
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed text-muted-foreground'
              : 'text-foreground'
          }`}
        >
          <TbChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
