import { useCallback, useState } from 'react';

import TTSOptionsSidebar from '@/components/tts/TTSOptionsSidebar';
import { TTSTable } from '@/components/tts/TTSTable';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { Button } from '@/components/ui/CommonButton';
import {
  ApplyAllButton,
  ApplySelectionButton,
  DownloadButton,
  RecreateButton,
  ResetChangesButton,
  SaveButton,
  UploadButton,
} from '@/components/ui/IconButton';
import Tooltip from '@/components/ui/Tooltip';

const ExamplePage = () => {
  const [items, setItems] = useState([
    {
      id: '1',
      text: '안녕하세요',
      isSelected: false,
      speed: 1.0,
      volume: 60,
      pitch: 4.0,
    },
    {
      id: '2',
      text: '반갑습니다',
      isSelected: false,
      speed: 1.0,
      volume: 60,
      pitch: 4.0,
    },
  ]);

  const isAllSelected = items.every((item) => item.isSelected);

  const handleSelectAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isSelected: !isAllSelected })));
  };

  const handleSelectionChange = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSelected: !item.isSelected } : item))
    );
  };

  const handleTextChange = (id: string, newText: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, text: newText } : item)));
  };

  const handleDelete = useCallback(() => {
    setItems((prevItems) => prevItems.filter((item) => !item.isSelected));
  }, []);

  return (
    <div className="p-8 space-y-28">
      {/* 버튼 컴포넌트 */}
      <section className="space-y-12">
        <h2 className="text-xl font-bold mb-4">버튼</h2>
        <div>
          {/* default */}
          <div className="flex flex-wrap gap-4">
            <Button>Button</Button>
            <Button disabled>Button</Button>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-4">
            {/* Secondary - Grey */}
            <Button variant="secondary">Button</Button>
            <Button variant="secondary" disabled>
              Button
            </Button>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-4">
            {/* mid + icon */}
            <Button size="mid" icon>
              Button
            </Button>
            <Button size="mid" icon disabled>
              Button
            </Button>
            {/* icon */}
            <Button size="icon" />
            <Button size="icon" disabled />
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-4">
            <UploadButton />
            <SaveButton />
            <RecreateButton />
            <DownloadButton />
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <ApplySelectionButton />
            <ApplyAllButton />
            <ResetChangesButton />
          </div>
        </div>
      </section>

      {/* 툴팁 컴포넌트 */}
      <section>
        <h2 className="text-xl font-bold mb-4">툴팁</h2>
        <Tooltip text="변경된 설정을 적용하려면 재생성 버튼을 눌러주세요!" />
      </section>

      {/* AudioPlayer 컴포넌트 */}
      <section>
        <h2 className="text-xl font-bold mb-4">오디오 플레이어</h2>
        <div className="w-1/2">
          <AudioPlayer audioUrl="/sample.mp3" />
        </div>
      </section>

      {/* TTS */}
      <section>
        <h2 className="text-xl font-bold mb-4">TTS</h2>
        <div className="flex">
          <div className="flex-1">
            <div className="w-[872px] h-[580px] border rounded-md overflow-hidden">
              <TTSTable
                items={items}
                isAllSelected={isAllSelected}
                onSelectAll={handleSelectAll}
                onSelectionChange={handleSelectionChange}
                onTextChange={handleTextChange}
                onDelete={handleDelete}
                onAdd={() => {
                  setItems((prev) => [
                    ...prev,
                    {
                      id: String(Date.now()),
                      text: '',
                      isSelected: false,
                      speed: 1.0,
                      volume: 60,
                      pitch: 4.0,
                    },
                  ]);
                }}
                onRegenerate={() => console.log('재생성')}
                onDownload={() => console.log('다운로드')}
                onPlay={(id) => console.log('재생:', id)}
              />
            </div>
          </div>

          <TTSOptionsSidebar />
        </div>
      </section>
    </div>
  );
};

export default ExamplePage;
