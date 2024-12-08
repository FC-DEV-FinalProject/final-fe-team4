import { useRef, useState } from 'react';
import { TbDotsVertical, TbEdit, TbPlayerPause, TbPlayerPlay, TbTrash } from 'react-icons/tb';

import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { RadioGroupItem } from '@/components/ui/radio-group';

interface VoiceCardProps {
  voice: {
    id: string;
    name: string;
    description: string;
    audioUrl?: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onEdit?: (newName: string) => void;
}

const VoiceCard = ({ voice, isSelected, onSelect, onDelete, onEdit }: VoiceCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fileName, fileExt] = voice.name.split('.');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (!audioRef.current && voice.audioUrl) {
      audioRef.current = new Audio(voice.audioUrl);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
    }
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handleEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEdit?.(`${e.currentTarget.value}.${fileExt}`);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <Card
      className={`mb-1 cursor-pointer border ${isSelected ? 'border-primary' : 'border-border'}`}
      onClick={isEditing ? undefined : onSelect}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <RadioGroupItem
            value={voice.id}
            className="translate-y-[2px] border-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              if (!isEditing) onSelect();
            }}
          />
          <div className="flex-1">
            <div className="font-medium leading-none">
              {isEditing ? (
                <Input
                  autoFocus
                  defaultValue={fileName}
                  onKeyDown={handleEdit}
                  onClick={(e) => e.stopPropagation()}
                  className="h-6 py-0"
                />
              ) : (
                voice.name
              )}
            </div>
            <div className="text-sm text-muted-foreground">{voice.description}</div>
          </div>
          <div className="flex items-center gap-1">
            {voice.audioUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPlaying) {
                    handlePause();
                  } else {
                    handlePlay();
                  }
                }}
                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full"
              >
                {isPlaying ? (
                  <TbPlayerPause className="w-5 h-5 text-gray-800" />
                ) : (
                  <TbPlayerPlay className="w-5 h-5 text-gray-800" />
                )}
              </button>
            )}
            {(onDelete || onEdit) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button className="p-1 text-gray-800 rounded-md hover:bg-gray-100">
                    <TbDotsVertical className="w-6 h-6" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <TbEdit className="w-4 h-4 mr-2" />
                      파일명 수정
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-red-500 hover:!text-red-600 focus:!text-red-600"
                    >
                      <TbTrash className="w-4 h-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceCard;
