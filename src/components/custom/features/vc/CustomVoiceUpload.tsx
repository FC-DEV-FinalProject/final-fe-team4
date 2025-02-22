import { TbClock, TbMicrophone, TbUpload, TbVolume } from 'react-icons/tb';

interface CustomVoiceUploadProps {
  onUpload: (files: File[]) => void;
}

export const CustomVoiceUpload = ({ onUpload }: CustomVoiceUploadProps) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validFiles: File[] = [];

      Array.from(files).forEach((file) => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name}의 크기가 10MB를 초과합니다.`);
          return;
        }
        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        onUpload(validFiles);
      }
    }
  };

  return (
    <div className="flex flex-col items-center bg-white">
      <div className="w-full max-w-md px-0 mb-2">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <ul className="space-y-3">
            {[
              {
                icon: <TbMicrophone className="w-4 h-4" />,
                text: '깨끗한 음질의 음성 파일을\n준비해주세요.',
              },
              {
                icon: <TbVolume className="w-4 h-4" />,
                text: '배경 소음이 없는 음성 파일을 권장합니다.',
              },
              {
                icon: <TbClock className="w-4 h-4" />,
                text: '30초 이상의 음성 파일을\n권장합니다.',
              },
            ].map((item, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100/50">
                  {item.icon}
                </div>
                <span className="text-sm text-blue-800 whitespace-pre-line">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 my-[33px]">
        <div className="p-3 rounded-full bg-gray-50 mb-2">
          <TbMicrophone className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-sm font-medium">음성 파일을 업로드하세요</h3>
        <p className="text-xs text-muted-foreground">WAV, MP3 파일 지원 (최대 10MB)</p>
      </div>

      <input
        type="file"
        id="voice-upload"
        className="hidden"
        accept="audio/*"
        multiple
        onChange={handleFileSelect}
      />
      <label
        htmlFor="voice-upload"
        className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white border border-gray-200 hover:bg-gray-50 h-9 px-4 py-2 cursor-pointer"
      >
        <TbUpload className="w-4 h-4" />
        파일 업로드
      </label>
    </div>
  );
};
