import { Checkbox } from '@/components/ui/CheckBox';
import { PlayButton } from '@/components/ui/PlayButton';
import { SoundStatus, UNIT_SOUND_STATUS_TYPES } from '@/components/ui/SoundStatus';
import { TextInput } from '@/components/ui/TextInput';

interface TextRowProps {
  id: string;
  text: string;
  isSelected: boolean;
  onPlay: () => void;
  speed: number;
  volume: number;
  pitch: number;
  onSelectionChange: (id: string) => void;
  onTextChange: (id: string, newText: string) => void;
}

const TextRow: React.FC<TextRowProps> = ({
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
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTextChange(id, e.target.value);
  };

  return (
    <div className="flex items-center p-4 border-b">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onSelectionChange(id)}
        className="ml-2 mr-2"
      />
      <PlayButton onClick={onPlay} className="ml-2 mr-2 w-5 h-5" />
      <TextInput
        value={text}
        onChange={handleTextChange}
        placeholder="텍스트를 입력하세요."
        className="flex-1 ml-2 mr-4"
      />
      <div className="flex gap-4.5">
        <SoundStatus type={UNIT_SOUND_STATUS_TYPES.SPEED} value={speed} />
        <SoundStatus type={UNIT_SOUND_STATUS_TYPES.VOLUME} value={volume} />
        <SoundStatus type={UNIT_SOUND_STATUS_TYPES.PITCH} value={pitch} />
      </div>
    </div>
  );
};

interface TtsListTableProps {
  rows: Omit<TextRowProps, 'onTextChange'>[];
  onSelectionChange: (id: string) => void;
  onTextChange: (id: string, newText: string) => void;
}

const TtsListTable: React.FC<TtsListTableProps> = ({ rows, onSelectionChange, onTextChange }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {rows.map((row) => (
        <TextRow
          key={row.id}
          {...row}
          onSelectionChange={onSelectionChange}
          onTextChange={onTextChange}
        />
      ))}
    </div>
  );
};

export { TtsListTable };
