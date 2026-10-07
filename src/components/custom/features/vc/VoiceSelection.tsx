import { TbMicrophone, TbPlus } from 'react-icons/tb';

import { ALLOWED_FILE_TYPES, useFileUpload } from '@/hooks/useFileUpload';

import { CustomVoiceUpload } from './CustomVoiceUpload';
import { VoiceList } from './VoiceList';

interface VoiceSelectionProps {
  customVoices: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  selectedVoice: string;
  onVoiceSelect: (id: string) => void;
  onVoiceUpload: (files: File[]) => void;
  onVoiceDelete?: (id: string) => void;
  onVoiceEdit?: (newName: string) => void;
}

const VoiceSelection = ({
  customVoices,
  selectedVoice,
  onVoiceSelect,
  onVoiceUpload,
  onVoiceDelete,
  onVoiceEdit,
}: VoiceSelectionProps) => {
  const { handleFiles, isLoading } = useFileUpload<File>({
    maxSizeInMB: 10,
    allowedTypes: [ALLOWED_FILE_TYPES.WAV, ALLOWED_FILE_TYPES.MP3],
    type: 'audio',
    onSuccess: (files) => {
      onVoiceUpload(files);
    },
  });

  return (
    <div className="w-full">
      {customVoices.length > 0 && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TbMicrophone className="w-4 h-4 text-primary" />
            <h2 className="text-sm">내 음성 목록</h2>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="voice-upload-header"
              className="hidden"
              accept="audio/*"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
            />
            <label
              htmlFor="voice-upload-header"
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white border border-gray-200 hover:bg-gray-50 h-9 p-2 cursor-pointer"
            >
              <TbPlus className="w-4 h-4" />
              {isLoading ? '업로드 중...' : '파일 추가'}
            </label>
          </div>
        </div>
      )}

      <div className="mb-10">
        {customVoices.length > 0 ? (
          <VoiceList
            voices={customVoices}
            selectedVoice={selectedVoice}
            onVoiceSelect={onVoiceSelect}
            onDelete={onVoiceDelete}
            onEdit={onVoiceEdit}
          />
        ) : (
          <CustomVoiceUpload onUpload={onVoiceUpload} />
        )}
      </div>
    </div>
  );
};

export default VoiceSelection;
